import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Alert, FlatList, TouchableOpacity, useColorScheme, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import styled from "styled-components/native";
import ScreenLayout from "../../../../components/ScreenLayout";
import useMe from "../../../../hooks/useMe";
import { sendMessage, sendMessageVariables } from "../../../../__generated__/sendMessage";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { MessageNavProps } from "../../../../components/type";
import IfUnreadMessageThenReadThemItNeedRoomIdAndUnreadTotal from "../../../../components/room/IfUnreadMessageThenReadThemItNeedRoomIdAndUnreadTotal";
import { roomUpdate } from "../../../../__generated__/roomUpdate";
import { getRoomMessages, getRoomMessagesVariables, getRoomMessages_getRoomMessages_messages, getRoomMessages_getRoomMessages_messages_user } from "../../../../__generated__/getRoomMessages";
import RenderEachMessages from "../../../../components/room/RenderEachMessages";
import { readMessage, readMessageVariables } from "../../../../__generated__/readMessage";
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../../../logic/subscribeToMoreExcuteOnlyOnce";
import messageCreatedAtChangeToCreateDayIFNewAndTransformTime from "../../../../components/room/messageCreatedAtChangeToCreateDayIFNewAndTransformTime";
import { MESSAGE_FRAGMENT } from "../../../../fragment";
import { transformedMessages } from "./transformedMessages";
import MessageKeyboardAvoidLayout from "../../../../components/MessageKeyboardAvoidLayout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";

// 근데 어차피 둘이 얘기하는 거면 유저 정보를 받을 이유가 없네. isMine 만 받고 상대방 유저 이미지 uri 한번 받고 캐시에 저장? 이미지 캐시 저장은 안되나?

const ROOM_UPDATES = gql`
  subscription roomUpdate($id: Int!) {
    roomUpdate(id: $id) {
      ...MessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload:String!,$roomId:Int,$userId:Int) {
    sendMessage(payload:$payload,roomId:$roomId,userId:$userId) {
      ok
      id
    }
  }
`;

const GET_ROOM_MESSAGES = gql`
  query getRoomMessages($roomId:Int!,$cursorId:Int) {
    getRoomMessages(roomId:$roomId,cursorId:$cursorId) {
      cursorId
      hasNextPage
      messages {
        ...MessageFragment
      }
      error
      # 프론트엔드에서 쓸라고 우겨넣은거. 다른 방법 있으면 백엔드까지 다 변경
      isNotFetchMore
    }
  }
  ${MESSAGE_FRAGMENT}
`;

const READ_MESSAGE = gql`
  mutation readMessage($id:Int!) {
    readMessage(id:$id){
      ok
      error
    }
  }
`;

const READ_UPDATE = gql`
  subscription readUpdate($id:Int!) {
    readUpdate(id:$id){
      userId
    }
  }
`;

const UserInput = styled.TextInput<{darkMode:string}>`
  /* 다크모드에 따라 색상 바뀜. */
  border: ${props => props.darkMode === "light" ? "2px solid rgba(0,0,0,0.2)" : "2px solid rgba(255,255,255,0.5)"};
  padding: 10px 20px;
  border-radius: 100px;
  color: ${props => props.theme.textColor};
  width: 90%;
  margin-right: 10px;
`;
const InputContainer = styled.View`
  margin: 10px auto 50px auto;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;
const SendButton = styled.TouchableOpacity`
  
`;

type Props = NativeStackScreenProps<MessageNavProps, "Room">

type FormType = {
  message: string;
};


const Room = ({route,navigation}:Props) => {
  const roomId = Number(route.params.id)
  const unreadTotal = route.params.unreadTotal;
  const userName = route.params.opponentUserName;
  // const userName = route.params.talkingTo?.userName;

  // opponentUserName

  // 안읽은 메세지 있으면 들어왔을 때 읽음 처리. roomId, unreadTotal 인수로 필요함.
  // 새로 방 만든 경우에는 unreadTotal 자체를 안보내서 역시 실행 안됨.
  if(unreadTotal){
    IfUnreadMessageThenReadThemItNeedRoomIdAndUnreadTotal(roomId,unreadTotal);
  }

  const darkModeSubscription = useColorScheme();

  const {register,handleSubmit,setValue,getValues,watch} = useForm<FormType>();
  useEffect(()=>{
    register("message",{
      required:true,
    })
  },[register]);

  const {data:meData} = useMe();

  const updateSendMessage:MutationUpdaterFunction<sendMessage, sendMessageVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    console.log("send message")
    const ok = result.data?.sendMessage.ok;
    const id = result.data?.sendMessage.id;
    if(ok && meData) {
      // read 는 기본으로 false 인데 상대가 들어와있는 상태면 true 로 바꿀 수 있도록. 지금은 읽음을 처리 안했지만.
      const messageObj = {
        createdAt:String(new Date().getTime()),
        id,
        payload:getValues().message,
        read:false,
        user:{
          id:meData?.me?.id,
          userName:meData?.me?.userName,
          avatar:meData?.me?.avatar
        },
      };
      
      cache.writeFragment({
        id:`Comment:${id}`,
        fragment:gql`
          fragment NewMessage on Message {
            createdAt
            id
            payload
            read
            user {
              id
              userName
              avatar
            }
          }
        `,
        data:messageObj
      });

      // useQuery 의 updateQuery 로 캐시 변경. typePolicies 가 있기 때문에 cache.modify, cache.writeFragment 로 하면 오류남.
      updateGetRoomMessagesQuery((prev)=>{
        const {getRoomMessages:{ messages:prevMessages, isNotFetchMore, ...prevRest }} = prev;

        const {user,...rest} = messageObj;
        const userWithTypename: getRoomMessages_getRoomMessages_messages_user = {"__typename":"User",...user};
        const newMessageWithTypename: getRoomMessages_getRoomMessages_messages = {"__typename": "Message",user:userWithTypename,...rest};

        const newMergedMessageArray = prevMessages ? [ newMessageWithTypename, ...prevMessages ] : [ newMessageWithTypename ];

        const sendResult = {
          getRoomMessages:{
            messages:newMergedMessageArray,
            isNotFetchMore:true,
            ...prevRest,
          }
        };
        return sendResult;
      });
    }
  };
  
  const [sendMessageMutation,{loading:sendLoading}] = useMutation<sendMessage,sendMessageVariables>(SEND_MESSAGE_MUTATION,{
    // 그냥 subscription 으로... typePolicies 가 왜 못받는질 모르겠네
    update:updateSendMessage,
  });
  
  const onValid:SubmitHandler<FormType> = async({message}) => {
    if(sendLoading) return;
    await sendMessageMutation({
      variables:{
        payload:message,
        roomId:route.params?.id
      }
    })
    setValue("message","")
  };

  const {data,loading,refetch,subscribeToMore,fetchMore,updateQuery:updateGetRoomMessagesQuery} = useQuery<getRoomMessages,getRoomMessagesVariables>(GET_ROOM_MESSAGES,{
    variables:{
      roomId,
    },
    onCompleted(){
      console.log("onCompleted");
    },
  });

  useEffect(()=>{
    refetch();
  },[]);

  // 메세지에서 에러 받을 시 알림창 띄움
  useEffect(()=>{
    if(data?.getRoomMessages.error){
      Alert.alert(data.getRoomMessages.error,null,[
        {
          text:"확인"
        },
      ])
    }
  },[data])



  const [readMessage] = useMutation<readMessage,readMessageVariables>(READ_MESSAGE);

  const roomUpdateUpdateQuery:UpdateQueryFn<getRoomMessages, {
    id: number | undefined;
  }, roomUpdate> | undefined = (prev, {subscriptionData}) => {
    console.log("get subscription on roomUpdate")
    if (!subscriptionData.data) return prev;
    // 바로 읽음 처리, await 는 안해도 알아서 되겠지
    readMessage({
      variables:{
        id:subscriptionData.data.roomUpdate.id,
      },
    });
    const {data:{roomUpdate:message}} = subscriptionData;

    const { messages:prevMessages, isNotFetchMore, ...prevRest } = prev.getRoomMessages;
    const messages = prevMessages ? [ message, ...prevMessages ] : [ message ];

    return {
      "getRoomMessages": {
        messages,
        ...prevRest,
        isNotFetchMore:true,
      }
    };
  };

  const roomUpdateSubscribeToMoreFn = () => {
    console.log("subscribe Message")
    subscribeToMore({
      document:ROOM_UPDATES,
      variables:{
        id:roomId
      },
      updateQuery:roomUpdateUpdateQuery,
      onError:(err) => console.error("error is "+err),
    });
  };
  
  // subscription 한번만 실행되게 하기 위함
  subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData(roomUpdateSubscribeToMoreFn,data?.getRoomMessages);


  const readUpdateUpdateQuery:UpdateQueryFn<getRoomMessages, {
    id: number | undefined;
  }, roomUpdate> | undefined = (prev, {subscriptionData}) => {
    console.log("get subscription on readUpdate")
    if (!subscriptionData.data) return prev;
    
    const { messages:prevMessages, ...prevRest } = prev.getRoomMessages;
    const messages = prevMessages.map(message=>{
      const newMessage = {...message};
      newMessage.read = true
      return newMessage;
    });

    return {
      "getRoomMessages": {
        messages,
        ...prevRest,
        isNotFetchMore:true,
      }
    };
  };

  const readUpdateSubscribeToMoreFn = () => {
    console.log("readUpdate Read")
    subscribeToMore({
      document:READ_UPDATE,
      variables:{
        id:roomId
      },
      updateQuery:readUpdateUpdateQuery,
      onError:(err) => console.error("error is "+err),
    });
  };
  
  // subscription 한번만 실행되게 하기 위함
  subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData(readUpdateSubscribeToMoreFn,data?.getRoomMessages);


  useEffect(()=>{
    navigation.setOptions({
      title: userName ? `${userName} 님 과의 대화` : "알 수 없는 유저",
      headerBackTitleVisible:false,
      headerLeft:({tintColor}) => (
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Ionicons name="chevron-back" color={tintColor} size={30} />
        </TouchableOpacity>
      )
    })
  },[]);
  

  const messages = [...(data?.getRoomMessages?.messages ?? [])];
  // 밑에는 못 쓸듯. KeyboardAvoidingView 가 화면을 통째로 옮겨서 FlatList 밑에부터 그려져야함.
  // const messages = [...(data?.getRoomMessages ?? [])].reverse();


  const transformedMessages:transformedMessages = messageCreatedAtChangeToCreateDayIFNewAndTransformTime(messages);

  // 메세지 입력하면 색 찐해지게
  const sendBtnColor = () => {
    if(watch("message") === "") {
      if(darkModeSubscription === "light"){
        return "rgba(0,0,0,0.3)";
      } else {
        return "rgba(255,255,255,0.7)";
      }
    } else {
      if(darkModeSubscription === "light"){
        return "rgba(0,0,0,0.7)";
      } else {
        return "white";
      }
    }
  };
  
  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.getRoomMessages.cursorId,
      },
    });
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.getRoomMessages,fetchMoreFn);
  };

  return (
    <MessageKeyboardAvoidLayout>
      <ScreenLayout loading={loading}>
        <FlatList
          data={transformedMessages}
          // renderItem={({item})=><RenderEachMessages item={item} talkingTo={route.params.talkingTo}/>}
          renderItem={({item})=><RenderEachMessages item={item} opponentUserName={route.params.opponentUserName}/>}
          keyExtractor={message=>"" + message?.id}
          style={{width:"100%", marginVertical:10}}
          ItemSeparatorComponent={()=><View style={{height:20}} />}
          showsVerticalScrollIndicator={false}
          inverted
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />
        <InputContainer>
          <UserInput
            placeholder="Write a message"
            returnKeyType="send"
            placeholderTextColor={darkModeSubscription === "light" ? "rgba(0,0,0,0.7)" :"rgba(255,255,255,0.7)"}
            autoCapitalize="none"
            autoCorrect={false} 
            onChangeText={text => setValue("message",text)}
            onSubmitEditing={handleSubmit(onValid)}
            value={watch("message")}
            darkMode={darkModeSubscription}
          />
          <SendButton onPress={handleSubmit(onValid)} disabled={watch("message") === ""}>
            <Ionicons name="send" color={sendBtnColor()} size={25} />
          </SendButton>
        </InputContainer>
      </ScreenLayout>
    </MessageKeyboardAvoidLayout>
  );
};
export default Room;
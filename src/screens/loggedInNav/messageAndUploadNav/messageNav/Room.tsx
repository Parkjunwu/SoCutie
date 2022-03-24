import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation, useQuery } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FlatList, useColorScheme, View } from "react-native";
import {Ionicons} from "@expo/vector-icons"
import styled from "styled-components/native";
import ScreenLayout from "../../../../components/ScreenLayout";
import useMe from "../../../../hooks/useMe";
import { sendMessage, sendMessageVariables } from "../../../../__generated__/sendMessage";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { MessageNavProps } from "../../../../components/type";
import IfUnreadMessageThenReadThemItNeedRoomIdAndUnreadTotal from "../../../../components/room/IfUnreadMessageThenReadThemItNeedRoomIdAndUnreadTotal";
import { roomUpdate } from "../../../../__generated__/roomUpdate";
import { getRoomMessages, getRoomMessagesVariables } from "../../../../__generated__/getRoomMessages";
import RenderEachMessages from "../../../../components/room/RenderEachMessages";
import { readMessage, readMessageVariables } from "../../../../__generated__/readMessage";
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../../../logic/subscribeToMoreExcuteOnlyOnce";
import messageCreatedAtChangeToCreateDayIFNewAndTransformTime from "../../../../components/room/messageCreatedAtChangeToCreateDayIFNewAndTransformTime";
import { MESSAGE_FRAGMENT } from "../../../../fragment";
import { transformedMessages } from "./transformedMessages";
import MessageKeyboardAvoidLayout from "../../../../components/MessageKeyboardAvoidLayout";
import { setHasNextPageNeedTakeOnceLength } from "../../../../utils";

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
      ...MessageFragment
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

type Props = StackScreenProps<MessageNavProps>

type FormType = {
  message: string;
};

const {hasNextPage,isFetchDataLengthLessThanTakeOnceLength} = setHasNextPageNeedTakeOnceLength(20);

let fetchCount = -1;

const Room = ({route,navigation}:Props) => {
  const roomId = route.params.id
  const unreadTotal = route.params.unreadTotal;
  // 안읽은 메세지 있으면 들어왔을 때 읽음 처리. roomId, unreadTotal 인수로 필요함
  IfUnreadMessageThenReadThemItNeedRoomIdAndUnreadTotal(roomId,unreadTotal);
  

  const darkModeSubscription = useColorScheme();

  const {register,handleSubmit,setValue,getValues,watch} = useForm<FormType>();
  useEffect(()=>{
    register("message",{
      required:true,
    })
  },[register]);

  const {data:meData} = useMe();

  const updateSendMessage:MutationUpdaterFunction<sendMessage, sendMessageVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    const ok = result.data?.sendMessage.ok;
    const id = result.data?.sendMessage.id;
    if(ok && meData) {
      const messageObj = {
        id,
        payload:getValues().message,
        user:{
          userName:meData?.me?.userName,
          avatar:meData?.me?.avatar
        },
        read:true,
        __typename:"Message"
      }
      const messageFragment = cache.writeFragment({
        // id:`Comment:${id}`,
        fragment:gql`
          fragment NewMessage on Message {
            id
            payload
            user{
              userName
              avatar
            }
            read
          }
        `,
        data:messageObj
      });

      cache.modify({
        id:`Room:${route?.params?.id}`,
        fields:{
          messages(prev){
            return [...prev,messageFragment]
          }
        }
      });
    }
  };
  
  const [sendMessageMutation,{loading:sendLoading}] = useMutation<sendMessage,sendMessageVariables>(SEND_MESSAGE_MUTATION,{
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

  const {data,loading,refetch,subscribeToMore,fetchMore} = useQuery<getRoomMessages,getRoomMessagesVariables>(GET_ROOM_MESSAGES,{
    variables:{
      roomId
    },
    skip:!hasNextPage,
    ////////
    onCompleted:(data)=>{
      fetchCount++
      console.log(hasNextPage);
      if(fetchCount === 0) return;
      console.log("fetchCount");
      console.log(fetchCount);
      const dataLength = data.getRoomMessages.length/fetchCount
      console.log(dataLength)
      console.log("dataLength")
      isFetchDataLengthLessThanTakeOnceLength(dataLength);
    },
    ////////

  });

  useEffect(()=>{
    refetch();
  },[]);


  const [readMessage] = useMutation<readMessage,readMessageVariables>(READ_MESSAGE);

  const updateQuery:UpdateQueryFn<getRoomMessages, {
    id: number | undefined;
  }, roomUpdate> | undefined = (prev, {subscriptionData}) => {
    console.log("get subscription")
    if (!subscriptionData.data) return prev;
    // 바로 읽음 처리, await 는 안해도 알아서 되겠지
    readMessage({
      variables:{
        id:subscriptionData.data.roomUpdate.id,
      },
    });
    const {data:{roomUpdate:message}} = subscriptionData;
    return Object.assign({}, prev, {
      getRoomMessages: [message, ...prev.getRoomMessages]
    });
  };

  const wholeSubscribeToMoreFn = () => {
    subscribeToMore({
      document:ROOM_UPDATES,
      variables:{
        id:roomId
      },
      updateQuery,
      onError:(err) => console.error("error is "+err),
    });
  };
  
  // subscription 한번만 실행되게 하기 위함
  subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData(wholeSubscribeToMoreFn,data?.getRoomMessages);

  useEffect(()=>{
    navigation.setOptions({
      title:`Conversation with ${route?.params?.talkingTo?.userName}`,
      headerBackTitleVisible:false,
    })
  },[]);
  
  const messages = [...(data?.getRoomMessages ?? [])];
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

  // flatList 맨 아래로 가기 위함
  const flatList = React.useRef(null);


  ////////////
  const onEndReached = async() => {
    console.log("getRoomMessages fetchMore");
    const prevData = data?.getRoomMessages;
    if(!prevData) return;
    await fetchMore({
      variables:{
        cursorId:prevData[prevData.length-1].id
      },
      // updateQuery:(prev,{fetchMoreResult}) => {
      //   return {
      //     getRoomMessages:[...prev.getRoomMessages,...fetchMoreResult.getRoomMessages]
      //   }
      // }
    });
  };
  //////////////

  return (
    <MessageKeyboardAvoidLayout>
      <ScreenLayout loading={loading}>
        <FlatList
          // data={messages}
          data={transformedMessages}
          renderItem={({item})=><RenderEachMessages item={item} talkingTo={route.params.talkingTo}/>}
          keyExtractor={message=>"" + message?.id}
          style={{width:"100%", marginVertical:10}}
          ItemSeparatorComponent={()=><View style={{height:20}} />}
          showsVerticalScrollIndicator={false}
          ref={flatList}
          inverted
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          // onContentSizeChange={()=> flatList.current.scrollToEnd({animated:false})}
        />
        <InputContainer>
        <UserInput
          placeholder="Write a message"
          returnKeyType="send"
          placeholderTextColor={darkModeSubscription === "light" ? "rgba(0,0,0,0.7)" :"rgba(255,255,255,0.7)"}
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
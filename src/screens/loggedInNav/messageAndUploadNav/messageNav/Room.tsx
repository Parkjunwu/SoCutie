import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FlatList, KeyboardAvoidingView, ListRenderItem, Text, useColorScheme, View } from "react-native";
import {Ionicons} from "@expo/vector-icons"
import styled from "styled-components/native";
import ScreenLayout from "../../../../components/ScreenLayout";
import useMe from "../../../../hooks/useMe";
import { seeRoom, seeRoomVariables, seeRoom_seeRoom_messages } from "../../../../__generated__/seeRoom";
import { sendMessage, sendMessageVariables } from "../../../../__generated__/sendMessage";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { subscribeProfile, subscribeProfileVariables } from "../../../../__generated__/subscribeProfile";

const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    payload
    user{
      id
      userName
      avatar
    }
    read
  }
`;

const ROOM_UPDATES = gql`
  subscription roomUpdate($id: Int!) {
    roomUpdate(id:$id) {
      # ...MessageFragment
      id
    payload
    # user{
    #   userName
    #   avatar
    # }
    userId
    read
    }
  }
`;
  // ${MESSAGE_FRAGMENT}

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload:String!,$roomId:Int,$userId:Int) {
    sendMessage(payload:$payload,roomId:$roomId,userId:$userId) {
      ok
      id
    }
  }
`;

const SEE_ROOM = gql`
  query seeRoom($id:Int!) {
    seeRoom(id:$id){
      id
      messages{
        ...MessageFragment
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;

const SUBSCRIBE_PROFILE = gql`
  query subscribeProfile($id:Int!){
    subscribeProfile(id:$id){
      id
      userName
      avatar
    }
  }
`;

const MessageContainer = styled.View<{outGoing:boolean}>`
  flex-direction: ${props => props.outGoing ? "row-reverse" : "row"};
  padding: 0px 10px;
  align-items: flex-end;
`;
const Author = styled.View`
`;
const Avatar = styled.Image`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  `;
const Message = styled.Text<{darkMode:string}>`
  margin: 0px 10px;
  color: ${props => props.theme.textColor};
  /* 다크모드에 따라 색상 바뀜. */
  background-color: ${props => props.darkMode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.5)"};
  padding: 5px 20px;
  border-radius: 10px;
  overflow: hidden;
  font-size: 16px;
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


type NavList = {
  Rooms:undefined;
  Room:{id:number,talkingTo:{avatar:string,id:number,userName:string}|null}
}
type Props = StackScreenProps<NavList>

type FormType = {
  message:string;
}

const Room = ({route,navigation}:Props) => {
  const darkModeSubscription = useColorScheme();
  const [subscribeProfile,{data:subscribeProfileData,called}] = useLazyQuery<subscribeProfile,subscribeProfileVariables>(SUBSCRIBE_PROFILE)
  const {register,handleSubmit,setValue,getValues,watch} = useForm<FormType>();
  useEffect(()=>{
    register("message",{
      required:true,
    })
  },[register]);
  const {data:meData} = useMe();
  const updateSendMessage:MutationUpdaterFunction<sendMessage, sendMessageVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    const ok = result.data?.sendMessage.ok
    const id = result.data?.sendMessage.id
    console.log(ok)
    console.log(meData)
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
      })
      const modifyResult = cache.modify({
        id:`Room:${route?.params?.id}`,
        fields:{
          messages(prev){
            return [...prev,messageFragment]
          }
        }
      });
    }
  }
  
  const [sendMessageMutation,{loading:sendLoading}] = useMutation<sendMessage,sendMessageVariables>(SEND_MESSAGE_MUTATION,{
      update:updateSendMessage,
  })
  
  const onValid:SubmitHandler<FormType> = async({message}) => {
    if(sendLoading) return;
    await sendMessageMutation({
      variables:{
        payload:message,
        roomId:route.params?.id
      }
    })
    setValue("message","")
  }
  const {data,loading,refetch,subscribeToMore} = useQuery<seeRoom,seeRoomVariables>(SEE_ROOM,{
    variables:{
      id:route?.params?.id
    },
    skip:!route?.params?.id
  });
  // refetch()
  const client = useApolloClient()
  const updateQuery:UpdateQueryFn<seeRoom, {
    id: number | undefined;
}, seeRoom> | undefined = async(_, options) => {
    const {subscriptionData:{data:{roomUpdate:message}}} = options;
    if(message.id){
      let user;
      if(!called) {
        const userData = await subscribeProfile({
          variables:{
            id:message.userId
          }
        })
        console.log("typename");
        user = {"__typename": "User",...userData.data.subscribeProfile};
      } else {
        const userData = await client.cache.readFragment({
          id:`User:${message.userId}`,
          fragment:gql`
            fragment MessageUser on User {
              id
              userName
              avatar
            }
          `,
        })
        console.log("alreadyName");
        user = userData
      }
      const { userId,...rest } = message
      console.log(user)
      const newMessage = {...rest,user}
      const incommingMessage = client.cache.writeFragment({
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
        // data: message,
        data: newMessage,
      })
      const modifyResult = client.cache.modify({
        id:`Room:${route?.params?.id}`,
        fields:{
          messages(prev){
            const existingArray = prev.find(aMessage=>aMessage.__ref === incommingMessage.__ref)
            if(existingArray) return prev;
            return [...prev,incommingMessage];
          }
        }
      });
      // return modifyResult;
    }
  }
  const [subscribed, setSubscribed] = useState(false)
  useEffect(()=>{
    if(data?.seeRoom && !subscribed){
      console.log("seeRoom is")
      subscribeToMore({
        document:ROOM_UPDATES,
        variables:{
          id:route?.params?.id
        },
        updateQuery,
        onError:(err) => console.error(err),
      });
      setSubscribed(true);
    }
  },[data,subscribed])
  console.log(data);
  // refetch();
  useEffect(()=>{
    navigation.setOptions({
      title:`Conversation with ${route?.params?.talkingTo?.userName}`,
      headerBackTitleVisible:false,
    })
  },[]);
  const renderItem:ListRenderItem<seeRoom_seeRoom_messages | null> = ({item:message}) => {
    if(message){
      const outGoing = message?.user?.userName !== route.params?.talkingTo?.userName
      return <MessageContainer outGoing={outGoing}>
        <Author>
          <Avatar source={{uri: outGoing ? message?.user?.avatar : route.params?.talkingTo?.avatar}}/>
        </Author>
        <Message darkMode={darkModeSubscription}>{message.payload}</Message>
      </MessageContainer>
    }
    return null;
  };
  const messages = [...(data?.seeRoom?.messages ?? [])].reverse()
  
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

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior="padding" keyboardVerticalOffset={100}>
      <ScreenLayout loading={loading}>
        <FlatList
          style={{width:"100%", marginVertical:10}}
          data={messages}
          keyExtractor={message=>"" + message?.id}
          renderItem={renderItem}
          ItemSeparatorComponent={()=><View style={{height:20}} />}
          inverted
          showsVerticalScrollIndicator={false}
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
    </KeyboardAvoidingView>
  );
};
export default Room;
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import NotificationLayout from "../../../components/notification/NotificationLayout";
import { FeedStackProps } from "../../../components/type";
import { readNotification } from "../../../__generated__/readNotification";
import { seeUserNotificationList, seeUserNotificationListVariables } from "../../../__generated__/seeUserNotificationList";
import { userNotificationUpdate } from "../../../__generated__/userNotificationUpdate";

const SEE_USER_NOTIFICATION_LIST = gql`
  query seeUserNotificationList($cursorId:Int) {
    seeUserNotificationList(cursorId:$cursorId) {
      id
      publishUser{
        id
        userName
        avatar
      }
      which
      read
      createdAt
    }
  }
`;

const READ_NOTIFICATION = gql`
  mutation readNotification {
    readNotification {
      ok
      error
    }
  }
`;

const USER_NOTIFICATION_UPDATE = gql`
  subscription userNotificationUpdate {
    userNotificationUpdate {
      id
      publishUser{
        id
        userName
        avatar
      }
      which
      createdAt
    }
  }
`;
const ListFooterComponents = styled.TouchableOpacity`

`;
const ListFooterComponentText = styled.Text`
  text-align: center;
`;

// let cursorId;

type Props = NativeStackScreenProps<FeedStackProps, 'Notification'>;

const Notification = ({navigation,route}:Props) => {
  // notification 데이터 받기
  const {data,fetchMore,refetch,subscribeToMore} = useQuery<seeUserNotificationList,seeUserNotificationListVariables>(SEE_USER_NOTIFICATION_LIST);
  // 처음 마운트 됐을 때 다시 받기.
  useEffect(()=>{
    refetch();
  },[])

  // 안읽은 notification 있을 시 읽음 처리
  const [readNotification] = useMutation<readNotification>(READ_NOTIFICATION);
  useEffect(()=>{
    if(route.params.unreadNotification) {
      readNotification({
        update: (cache,result) => {
          if(result.data.readNotification.ok) {
            cache.modify({
              id: "ROOT_QUERY",
              fields: {
                getNumberOfUnreadMessage:()=>0,
              }
            });
          }
        }
      });
    };
  },[])

  ///[Error: Cannot read properties of undefined (reading 'id')] 는 subscribed 어딘가 에서 나옴.
  const client = useApolloClient()
  // subscription 을 캐시에 반영
  const updateQuery:UpdateQueryFn<seeUserNotificationList,null, userNotificationUpdate> | undefined = async(_, options) => {
    const {subscriptionData:{data:{userNotificationUpdate:message}}} = options;
    if(message?.id){
      // let user;
      // if(!called) {
      //   const userData = await subscribeProfile({
      //     variables:{
      //       id:message.userId
      //     }
      //   })
      //   console.log("typename");
      //   user = {"__typename": "User",...userData.data.subscribeProfile};
      // } else {
      //   const userData = await client.cache.readFragment({
      //     id:`User:${message.userId}`,
      //     fragment:gql`
      //       fragment MessageUser on User {
      //         id
      //         userName
      //         avatar
      //       }
      //     `,
      //   })
      //   console.log("alreadyName");
      //   user = userData
      // }
      // const { userId,...rest } = message
      // console.log(user)
      // const newMessage = {...rest,user}
      const incommingMessage = client.cache.writeFragment({
        // id:`Comment:${id}`,
        fragment:gql`
          fragment NewMessage on Message {
            id
            publishUser{
              id
              userName
              avatar
            }
            which
            createdAt
          }
        `,
        data: message,
        // data: newMessage,
      })
      // seeUserNotificationList 에다가도 넣어야 되나?

      // const modifyResult = client.cache.modify({
      //   id:`Room:${route?.params?.id}`,
      //   fields:{
      //     messages(prev){
      //       const existingArray = prev.find(aMessage=>aMessage.__ref === incommingMessage.__ref)
      //       if(existingArray) return prev;
      //       return [...prev,incommingMessage];
      //     }
      //   }
      // });
      // return modifyResult;
    }
  }

  // subscription 한번만 등록되게 하기 위함.
  const [subscribed, setSubscribed] = useState(false)
  // subscription 등록.
  useEffect(()=>{
    if(data?.seeUserNotificationList && !subscribed){
      console.log("seeRoom is")
      subscribeToMore({
        document:USER_NOTIFICATION_UPDATE,
        updateQuery,
        onError:(err) => console.error(err),
      });
      setSubscribed(true);
    }
  },[data,subscribed]);


  // 더보기 누르면 fetchMore 함. 더 받을 데이터가 없으면 더보기 역시 사라짐.
  // nomad-app feed 에 있군.
  // const onPressfetchMore = () => {
  //   fetchMore({
  //     variables:{
  //       cursorId: 데이터 마지막 id
  //     }
  //   });
  // }
  const ListFooterComponent = () => {
    return (
      <ListFooterComponents >
        <ListFooterComponentText>더 보기</ListFooterComponentText>
      </ListFooterComponents>
    );
  }
  return (
    <FlatList
      data={data.seeUserNotificationList}
      renderItem={({item})=>NotificationLayout(item)}
      keyExtractor={(item) => item.id + ""}
      ListFooterComponent={ListFooterComponent}
    />
  );
}
export default Notification;
import { gql, useMutation, useQuery } from "@apollo/client";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import NotificationLayout from "../../../components/notification/NotificationLayout";
import { FeedStackProps } from "../../../components/type";
import getUnreadNumberOfNotificationOnCache from "../../../logic/getUnreadNumberOfNotificationOnCache";
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../../logic/subscribeToMoreExcuteOnlyOnce";
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
      read
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
  
  const isFocused = useIsFocused();

  const unreadNotification = getUnreadNumberOfNotificationOnCache();
  
  useEffect(()=>{
    if(unreadNotification) {
      console.log("readNotification !!")
      readNotification({
        update: (cache,result) => {
          if(result.data.readNotification.ok) {
            console.log("read")
            cache.writeFragment({
              id:"ROOT_QUERY",
              fragment: gql`
                fragment Numbers on Query {
                  getNumberOfUnreadNotification
                }
              `,
              data:{
                getNumberOfUnreadNotification:null,
              },
            });
          }
        }
      });
    };
  },[isFocused]);


  // subscription 을 캐시에 반영
  const updateQuery:UpdateQueryFn<seeUserNotificationList,null, userNotificationUpdate> | undefined = (prev, {subscriptionData}) => {
    if(!subscriptionData.data){
      return prev;
    }
    return Object.assign({}, prev, {
      seeUserNotificationList:[subscriptionData.data.userNotificationUpdate, ...prev.seeUserNotificationList]
    });
  }

  // 전체 subscribeToMore 함수
  const wholeSubscribeToMoreFn = () => {
    subscribeToMore({
      document:USER_NOTIFICATION_UPDATE,
      updateQuery,
      onError:(err) => console.error(err),
    });
  };
  
  // subscription 한번만 등록되게 하기 위함.
  subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData(wholeSubscribeToMoreFn,data?.seeUserNotificationList);

  const [refreshing,setRefreshing] = useState(false);
  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const ListFooterComponent = () => {
    return (
      <ListFooterComponents >
        <ListFooterComponentText>더 보기</ListFooterComponentText>
      </ListFooterComponents>
    );
  };

  return (
    <FlatList
      data={data.seeUserNotificationList}
      renderItem={({item})=>NotificationLayout(item)}
      keyExtractor={(item) => item.id + ""}
      ListFooterComponent={ListFooterComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};

export default Notification;
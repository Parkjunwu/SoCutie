import { gql, useMutation, useQuery } from "@apollo/client";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import NotificationLayout from "../../../components/notification/NotificationLayout";
import { FeedStackProps } from "../../../components/type";
import getUnreadNumberOfNotificationOnCache from "../../../logic/getUnreadNumberOfNotificationOnCache";
import cursorPaginationFetchMore from "../../../logic/cursorPaginationFetchMore";
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../../logic/subscribeToMoreExcuteOnlyOnce";
import { readNotification } from "../../../__generated__/readNotification";
import { seeUserNotificationList, seeUserNotificationListVariables } from "../../../__generated__/seeUserNotificationList";
import { userNotificationUpdate } from "../../../__generated__/userNotificationUpdate";
import ScreenLayout from "../../../components/ScreenLayout";

// 로그인 안했을 때 설정은 MainNav 에 있음.

const SEE_USER_NOTIFICATION_LIST = gql`
  query seeUserNotificationList($cursorId:Int) {
    seeUserNotificationList(cursorId:$cursorId) {
      cursorId
      hasNextPage
      notification {
        id
        publishUser{
          id
          userName
          avatar
        }
        which
        read
        createdAt
        commentId
        commentOfCommentId
        userId
        postId
        petLogId
      }
      error
      isNotFetchMore
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
      postId
      commentId
      commentOfCommentId
      userId
      petLogId
    }
  }
`;

const NotiListContainer = styled.FlatList`
  background-color: ${props=>props.theme.backgroundColor};
`;
const ItemSeparatorComponent = styled.View`
  background-color: grey;
  opacity: 0.2;
  width: 100%;
  height: 1px;
`;
const ListFooterComponents = styled.TouchableOpacity`

`;
const ListFooterComponentText = styled.Text`
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;
const ListEmptyComponents = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;
const ListEmptyComponentText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 15px;
`;

// let cursorId;

type Props = NativeStackScreenProps<FeedStackProps, 'Notification'>;

const Notification = ({navigation,route}:Props) => {
  // notification 데이터 받기
  const {data,loading,fetchMore,refetch,subscribeToMore} = useQuery<seeUserNotificationList,seeUserNotificationListVariables>(SEE_USER_NOTIFICATION_LIST);
  // 처음 마운트 됐을 때 다시 받기.
  useEffect(()=>{
    refetch();
  },[]);

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
    const { data:{ userNotificationUpdate:newNoti }} = subscriptionData;
    const { seeUserNotificationList: { notification: prevNoti, isNotFetchMore, ...prevRest } } = prev
    const notification = prevNoti ? [ newNoti, ...prevNoti ] : [ newNoti ];
    return {
      seeUserNotificationList:{
        notification,
        isNotFetchMore:true,
        ...prevRest,
      }
    }
  };

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

  // infinite scroll, 얘는 더보기 누를때 실행
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.seeUserNotificationList.cursorId,
      },
    });
  };

  const onPress더보기 = async() => {
    await cursorPaginationFetchMore(data?.seeUserNotificationList,fetchMoreFn);
  };

  const ListFooterComponent = () => {
    return (<>
        {data?.seeUserNotificationList.hasNextPage && <ListFooterComponents onPress={onPress더보기}>
          <ListFooterComponentText>더 보기</ListFooterComponentText>
        </ListFooterComponents>}
      </>
    );
  };

  const ListEmptyComponent = () => (
    <ListEmptyComponents>
      <ListEmptyComponentText>알림이 없습니다.</ListEmptyComponentText>
    </ListEmptyComponents>
  )

  return (
    // 오류가 styled component 쓰면 나옴. 신경 안써도 됨.
    <ScreenLayout loading={loading}>
      {data?.seeUserNotificationList.notification.length !== 0 ?
        <NotiListContainer
          data={data?.seeUserNotificationList.notification}
          renderItem={({item})=>NotificationLayout(item,navigation)}
          keyExtractor={(item) => item.id + ""}
          ListFooterComponent={ListFooterComponent}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ItemSeparatorComponent={()=><ItemSeparatorComponent />}
        />
        :
        <ListEmptyComponent/>
      }
    </ScreenLayout>
  );
};

export default Notification;
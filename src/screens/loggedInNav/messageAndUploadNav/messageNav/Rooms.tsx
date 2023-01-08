import React, { useEffect } from "react";
import { FlatList, View, ListRenderItem, useColorScheme } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { gql, useQuery } from "@apollo/client";
import { ROOM_FRAGMENT } from "../../../../fragment";
import { seeRooms, seeRooms_seeRooms_rooms } from "../../../../__generated__/seeRooms";
import RoomItem from "../../../../components/rooms/RoomItem";
import ScreenLayout from "../../../../components/ScreenLayout";
import { MessageNavProps } from "../../../../components/type";
import { useIsFocused } from "@react-navigation/native";
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../../../logic/subscribeToMoreExcuteOnlyOnce";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { roomUpdate } from "../../../../__generated__/roomUpdate";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";
import styled from "styled-components/native";
import messageMockData from "./messageMockData";
import { ROOM_UPDATE } from "../../../../gql/forCodeGen";

const SEE_ROOMS = gql`
  query seeRooms($cursorId:Int) {
    seeRooms(cursorId:$cursorId) {
      cursorId
      hasNextPage
      rooms{
        ...RoomParts
      }
      error
      # 프론트엔드에서 subscription 데이터 받기 위함... 다른 방법이 안떠오름.
      isNotFetchMore
    }
  }
  ${ROOM_FRAGMENT}
`;

// forCodeGen 으로 옮김
// const ROOM_UPDATE 

const ListEmptyComponents = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
`;
const ListEmptyComponentText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 15px;
`;

type Props = NativeStackScreenProps<MessageNavProps>

const Rooms = ({navigation}:Props) => {
  const darkModeSubscription = useColorScheme();
  // Room 목록 받음
  const {data,loading,refetch,subscribeToMore,fetchMore,updateQuery:updateQuerySeeRooms} = useQuery<seeRooms>(SEE_ROOMS);

  const isFocused = useIsFocused();

  useEffect(()=>{
    console.log("refetch")
    refetch();
  },[isFocused]);


  // 메세지 subscription + 캐시 업데이트
  const updateQuery:UpdateQueryFn<seeRooms, null, roomUpdate> = (prev, {subscriptionData}) => {
    console.log("get subscription Rooms s")
    if (!subscriptionData.data) return prev;

    // isNotFetchMore 안썼는데 되나?
    
    const roomUpdate = subscriptionData.data.roomUpdate;
    const roomId = roomUpdate.roomId;
    const {seeRooms:{rooms,isNotFetchMore,...prevRest}} = prev;
    const isAlreadyRoom = rooms.some(room => room.id === roomId);
    const user = roomUpdate.user
    const nowTime = String(new Date().getTime())
    
    // 기존에 없던 방일 때. (새로운 유저가 대화 걸었을 때)
    if(!isAlreadyRoom) {
      const obj = {
        "__typename": "Room",
        id: roomId,
        lastMessage:{
          "__typename": "Message",
          createdAt: nowTime,
          id: roomUpdate.id,
          payload: roomUpdate.payload,
        },
        talkingTo:{
          "__typename": "User",
          avatar: user.avatar,
          id: user.id,
          userName: user.userName,
        },
        unreadTotal: 1,
      };
      return Object.assign({}, prev, {
        seeRooms:{
          ...prevRest,
          rooms:[obj,...rooms],
          isNotFetchMore:true,
        }
      });
    }

    // 기존에 있는 방일 때
    const newSeeRooms = rooms.map(room => {
      if(room.id === roomId) {
        const newRoom = {...room};
        newRoom.lastMessage = {
          "__typename": "Message",
          createdAt: nowTime,
          id: roomUpdate.id,
          payload: roomUpdate.payload,
        };
        newRoom.unreadTotal = newRoom.unreadTotal + 1;
        return newRoom;
      }
      return room;
    });
    
    return Object.assign({}, prev, {
      seeRooms: {
        ...prevRest,
        rooms:newSeeRooms,
        isNotFetchMore:true,
      }
    });
  };

  // subscribeToMore 전체 함수. 캐시 변경 까지
  const wholeSubscribeToMoreFn = () => {
    console.log("subscribe Rooms")
    subscribeToMore({
      document:ROOM_UPDATE,
      updateQuery,
      onError:(e)=>console.error(e)
    })
  }

  // subscribe 한번만 하기 위함
  subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData(wholeSubscribeToMoreFn,data?.seeRooms.rooms);

  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.seeRooms.cursorId,
      },
    });
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.seeRooms,fetchMoreFn);
  };

  // Room 렌더링
  const renderRooms:ListRenderItem<seeRooms_seeRooms_rooms | null> = ({item:room}) => {
    if(room) {
      return <RoomItem room={room}/>;
    }
    return null;
  };

  const ListEmptyComponent = () => (
    <ListEmptyComponents>
      <ListEmptyComponentText>대화창이 없습니다.</ListEmptyComponentText>
    </ListEmptyComponents>
  );

  if(!loading && data?.seeRooms.rooms.length === 0) {
    return <ListEmptyComponent />;
  }

  return (
    <ScreenLayout loading={loading}>
      {data?.seeRooms.rooms && <FlatList
      data={data?.seeRooms.rooms}
      // data={messageMockData}
      keyExtractor={room => room?.id +""}
      renderItem={renderRooms}
      ItemSeparatorComponent={()=><View style={{height:1,width:"100%",backgroundColor: darkModeSubscription === "light"?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.5)"}}/>}
      style={{width:"100%"}}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      />}
    </ScreenLayout>
  );
}
export default Rooms;
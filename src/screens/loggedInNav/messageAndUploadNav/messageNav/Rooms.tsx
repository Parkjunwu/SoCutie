import React, { useEffect } from "react";
import { FlatList, View, ListRenderItem, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { gql, useQuery } from "@apollo/client";
import { ROOM_FRAGMENT } from "../../../../fragment";
import { seeRooms, seeRooms_seeRooms } from "../../../../__generated__/seeRooms";
import RoomItem from "../../../../components/rooms/RoomItem";
import ScreenLayout from "../../../../components/ScreenLayout";
import { MessageNavProps } from "../../../../components/type";
import { useIsFocused } from "@react-navigation/native";
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../../../logic/subscribeToMoreExcuteOnlyOnce";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { roomUpdate } from "../../../../__generated__/roomUpdate";

const SEE_ROOMS = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;
const ROOM_UPDATE = gql`
  subscription roomUpdate ($id:Int){
    roomUpdate (id:$id) {
      id
      payload
      user {
        id
        userName
        avatar
      }
      roomId
    }
  }
`;

type Props = NativeStackScreenProps<MessageNavProps>

const Rooms = ({navigation}:Props) => {
  const darkModeSubscription = useColorScheme();
  // Room 목록 받음
  const {data,loading,refetch,subscribeToMore} = useQuery<seeRooms>(SEE_ROOMS);

  // 메세지 최근에 받은 순서로 정렬
  const compare = (a:seeRooms_seeRooms, b:seeRooms_seeRooms) => {
    const aCreatedAt = a.lastMessage.createdAt;
    const bCreatedAt = b.lastMessage.createdAt;
    if (aCreatedAt < bCreatedAt) {
      return 1;
    }
    if (aCreatedAt > bCreatedAt) {
      return -1;
    }
    return 0;
  }
  
  const copiedData = data?.seeRooms && [...data?.seeRooms]
  const sortedData = copiedData?.sort(compare);
  
  // 마운트 시에 헤더 설정, 데이터 받아옴.
  useEffect(()=>{
    navigation.setOptions({
      headerLeft:({tintColor}) => <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="chevron-down" color={tintColor} size={30} />
      </TouchableOpacity>
    })
  },[])

  const isFocused = useIsFocused();

  useEffect(()=>{
    console.log("refetch")
    refetch();
  },[isFocused]);


  // 메세지 subscription + 캐시 업데이트
  const updateQuery:UpdateQueryFn<seeRooms, null, roomUpdate> = (prev, {subscriptionData}) => {
    console.log("get subscription")
    if (!subscriptionData.data) return prev;

    const roomUpdate = subscriptionData.data.roomUpdate;
    const roomId = roomUpdate.roomId;
    const isAlreadyRoom = prev.seeRooms.some(room => room.id === roomId);
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
        seeRooms:[obj,...prev.seeRooms]
      });
    }

    // 기존에 있는 방일 때
    const {seeRooms} = prev;
    const newSeeRooms = seeRooms.map(room => {
      if(room.id === roomId) {
        const newRoom = {...room};
        newRoom.lastMessage = {
          "__typename": "Message",
          createdAt: nowTime,
          id: roomUpdate.id,
          payload: roomUpdate.payload,
        };
        newRoom.unreadTotal = newRoom.unreadTotal + 1;
        console.log(newRoom)
        return newRoom;
      }
      return room;
    });
    return Object.assign({}, prev, {
      seeRooms: newSeeRooms
    });
    
  };

  // subscribeToMore 전체 함수. 캐시 변경 까지
  const wholeSubscribeToMoreFn = () => {
    console.log("subscribe!!!!")
    subscribeToMore({
      document:ROOM_UPDATE,
      updateQuery,
      onError:(e)=>console.error(e)
    })
  }

  // subscribe 한번만 하기 위함
  subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData(wholeSubscribeToMoreFn,sortedData);

  // Room 렌더링
  const renderRooms:ListRenderItem<seeRooms_seeRooms | null> = ({item:room}) => {
    if(room) {
      return <RoomItem room={room}/>
    }
    return null;
  }
  return <ScreenLayout loading={loading}>
    {/* {data?.seeRooms && <FlatList
      data={data.seeRooms} */}
      {sortedData && <FlatList
      data={sortedData}
      keyExtractor={room => room?.id +""}
      renderItem={renderRooms}
      ItemSeparatorComponent={()=><View style={{height:1,width:"100%",backgroundColor: darkModeSubscription === "light"?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.5)"}}/>}
      style={{width:"100%"}}
      />}
  </ScreenLayout>
}
export default Rooms;
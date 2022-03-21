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

const SEE_ROOMS = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;


type Props = NativeStackScreenProps<MessageNavProps>

const Rooms = ({navigation}:Props) => {
  const darkModeSubscription = useColorScheme();
  // Room 목록 받음
  const {data,loading,refetch} = useQuery<seeRooms>(SEE_ROOMS);
  // console.log(data);
  // 마운트 시에 헤더 설정, 데이터 받아옴.
  useEffect(()=>{
    navigation.setOptions({
      headerLeft:({tintColor}) => <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="chevron-down" color={tintColor} size={30} />
      </TouchableOpacity>
    })
  },[])
  useEffect(()=>{
    refetch();
  },[])
  // Room 렌더링
  const renderRooms:ListRenderItem<seeRooms_seeRooms | null> = ({item:room}) => {
    if(room) {
      return <RoomItem room={room}/>
    }
    return null;
  }
  return <ScreenLayout loading={loading}>
    {data?.seeRooms && <FlatList
      style={{width:"100%"}}
      ItemSeparatorComponent={()=><View style={{height:1,width:"100%",backgroundColor: darkModeSubscription === "light"?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.5)"}}/>}
      data={data.seeRooms}
      keyExtractor={room => room?.id +""}
      renderItem={renderRooms}
    />}
  </ScreenLayout>
}
export default Rooms;
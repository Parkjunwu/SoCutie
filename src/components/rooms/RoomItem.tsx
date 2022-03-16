import { useNavigation } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../../color";
import useMe from "../../hooks/useMe";
import { seeRooms_seeRooms } from "../../__generated__/seeRooms";

const RoomContainer = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content:space-between;
`;
const Column = styled.View`
  flex-direction: row;
  align-items:center;
  justify-content: space-between;
`;
const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 13px;
`;
const Data = styled.View``;
const UserName = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 1px;
`;
const UnreadText = styled.Text`
  color: white;
  font-weight: 500;
`;
const UnreadDot = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${colors.blue};
  border-radius: 5px;
`;

const RoomItem = ({room}:{room:seeRooms_seeRooms}) => {
  const navigation = useNavigation();
  const {data:meData} = useMe();
  const talkingTo = room.users?.find(user => user?.userName !== meData?.me?.userName)
      console.log(talkingTo?.avatar)
      return <RoomContainer onPress={()=>navigation.navigate("Room",{id:room.id,talkingTo})}>
        <Column>
          {talkingTo?.avatar && <Avatar source={{uri:talkingTo.avatar}}/>}
          <Data>
            <UserName>{talkingTo?.userName}</UserName>
            <UnreadText>{room.unreadTotal} unread {room.unreadTotal === 1 ? "message" : "messages"}</UnreadText>
          </Data>
        </Column>
        <Column>
          {room.unreadTotal !== 0 && <UnreadDot />}
        </Column>
      </RoomContainer>;
};
export default RoomItem;
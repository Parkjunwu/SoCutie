import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../../color";
import { seeRooms_seeRooms } from "../../__generated__/seeRooms";
import { MessageNavProps } from "../type";
import setRoomUpdatedTimeNeedTimestamp from "./logic/setRoomUpdatedTimeNeedTimestamp";

const RoomContainer = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content:space-between;
`;
const Column = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Avatar = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  margin-right: 13px;
`;
const Data = styled.View``;
const UserName = styled.Text`
  color: ${props => props.theme.textColor};
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 1px;
`;
const LastMessage = styled.Text`
  color: ${props => props.theme.textColor};
  font-weight: 400;
  opacity: 0.9;
`;
const UnreadText = styled.Text`
  color: ${props => props.theme.textColor};
  font-weight: 500;
`;
const RightContainer = styled.View``;
const DivideContainer = styled.View`
  flex:1;
  align-items: flex-end;
  justify-content: center;
`;
const MessageGettingTime = styled.Text`
  color: ${props => props.theme.textColor};
  font-size: 12px;
`;
const UnreadDot = styled.View`
  background-color: red;
  border-radius: 4px;
`;
const UnreadDotText = styled.Text`
  padding: 1px 5px;
  font-weight: 600;
  /* color: rgba(0,0,0,0.7); */
  color: yellow;
`;

type Props = NativeStackScreenProps<MessageNavProps, 'Room'>;

const RoomItem = ({room}:{room:seeRooms_seeRooms}) => {
  const navigation = useNavigation<Props["navigation"]>();
  const unreadTotal = room.unreadTotal;
  const talkingTo = room.talkingTo;
  const userName = talkingTo?.userName;
  const userNameIfNullThenSetDontKnow = userName ? userName : "알 수 없는 유저"
  const avatar = talkingTo?.avatar
  const avatarUriIfNullThenSetNoUser = avatar ? { uri: avatar } : require("../../../assets/no_user.png")
  const lastMessage = room.lastMessage.payload;
  const updatedAt = room.lastMessage.createdAt;
  const messageGettingTime = setRoomUpdatedTimeNeedTimestamp(updatedAt);
  return (
    <RoomContainer onPress={()=>navigation.navigate("Room",{
      id: room.id,
      talkingTo,
      unreadTotal,
    })}>
      <Column>
        <Avatar source={avatarUriIfNullThenSetNoUser}/>
        <Data>
          <UserName>{userNameIfNullThenSetDontKnow}</UserName>
          <LastMessage>{lastMessage}</LastMessage>
          <UnreadText>{room.unreadTotal} unread {room.unreadTotal === 1 ? "message" : "messages"}</UnreadText>
        </Data>
      </Column>
      <Column>
        <RightContainer>
          <DivideContainer>
            {room.unreadTotal !== 0 && <UnreadDot>
              <UnreadDotText>New!</UnreadDotText>  
            </UnreadDot>}
          </DivideContainer>
          <DivideContainer>
            <MessageGettingTime>{messageGettingTime}</MessageGettingTime>
          </DivideContainer>
          <DivideContainer/>
        </RightContainer>
      </Column>
    </RoomContainer>
  );
};
export default RoomItem;
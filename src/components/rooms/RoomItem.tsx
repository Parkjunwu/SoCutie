import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import styled from "styled-components/native";
import { seeRooms_seeRooms_rooms } from "../../__generated__/seeRooms";
import { MessageNavProps } from "../type";
import setRoomUpdatedTimeNeedTimestamp from "./logic/setRoomUpdatedTimeNeedTimestamp";
import FastImage from 'react-native-fast-image'
import image from "../../image";


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
  max-width: 80%;
  overflow: hidden;
`;
const Data = styled.View`
  flex:1;
`;
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
  color: yellow;
`;

type Props = NativeStackScreenProps<MessageNavProps, 'Room'>;

const RoomItem = ({room}:{room:seeRooms_seeRooms_rooms}) => {
  const navigation = useNavigation<Props["navigation"]>();
  const unreadTotal = room.unreadTotal;
  const talkingTo = room.talkingTo;
  const userName = talkingTo?.userName;
  const userNameIfNullThenSetDontKnow = userName ? userName : "알 수 없는 유저";
  const avatar = talkingTo?.avatar;
  // const avatarUriIfNullThenSetNoUser = avatar ? { uri: avatar } : require("../../../assets/no_user.png");
  const avatarUriIfNullThenSetNoUser = avatar ? { uri: avatar } : image.no_user;
  const roomLastMessage = room.lastMessage;
  
  const lastMessage = roomLastMessage && room.lastMessage.payload;
  const updatedAt = roomLastMessage && room.lastMessage.createdAt;
  const messageGettingTime = roomLastMessage && setRoomUpdatedTimeNeedTimestamp(updatedAt);
  return (
    <RoomContainer onPress={()=>navigation.navigate("Room",{
      id: room.id,
      // talkingTo,
      opponentUserName:userName,
      unreadTotal,
    })}>
      <Column>
        <FastImage
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            marginRight: 13,
          }}
          source={avatarUriIfNullThenSetNoUser}
        />
        <Data>
          <UserName>{userNameIfNullThenSetDontKnow}</UserName>
          <LastMessage numberOfLines={1}>{lastMessage}</LastMessage>
          <UnreadText>{room.unreadTotal ? `${room.unreadTotal} 개의 메세지` : null}</UnreadText>
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
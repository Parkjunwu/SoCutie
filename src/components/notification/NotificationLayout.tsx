import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import getNotificationMessage from "../../logic/getNotificationMessage";
import getPassedTime from "../../logic/getPassedTime";
import { seeUserNotificationList_seeUserNotificationList } from "../../__generated__/seeUserNotificationList";

const Container = styled.TouchableOpacity`
  flex-direction: row;
  /* height: 30px; */
  /* background-color: tomato; */
`;
const UserAvatarContainer = styled.TouchableOpacity``;
const UserAvatar = styled.Image`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  margin: 10px;
`;
const ContentsContainer = styled.View`
  justify-content: center;
`;
const NotificationContents = styled.View`
  justify-content: center;
  align-items: center;
  /* background-color:mediumblue; */
  flex-direction: row;
`;
const NotificationContentsText = styled.Text`
  text-align: center;
  /* font-size: 14px; */
`;

const UserLink = styled.TouchableOpacity`
  /* background-color: red; */
  /* margin: auto 0px; */
`;
const UserLinkText = styled.Text`
  font-weight: 600;
  font-size: 16px;
  /* text-align: center; */
  /* font-size: 15px; */
`;
const MessageView = styled.View`

`;
const PublishTime = styled.Text`
  
`;

const NotificationLayout = (data:seeUserNotificationList_seeUserNotificationList) => {
  
  // 알림 메세지 내용
  const notificationMessage = getNotificationMessage(data.which);
  // 알림 발생한 시간
  const passedTime = getPassedTime(data.createdAt)

  return <Container>
    <TouchableOpacity>
      <UserAvatar source={data.publishUser.avatar?{uri:data.publishUser.avatar}:require("../../../assets/no_user.png")}/>
    </TouchableOpacity>
    <ContentsContainer>
      <NotificationContents>
        <UserLink><UserLinkText>{data.publishUser.userName}</UserLinkText></UserLink>
        <NotificationContentsText> 님이 {notificationMessage}</NotificationContentsText>
      </NotificationContents>
      <PublishTime>{passedTime}</PublishTime>
    </ContentsContainer>
  </Container>;
};
export default NotificationLayout;
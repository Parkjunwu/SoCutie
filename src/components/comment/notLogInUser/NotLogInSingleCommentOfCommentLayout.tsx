import React from "react";
import styled from "styled-components/native";
import { Alert, Platform } from "react-native";
import FlexRowContainer from "../commonStyledComponent/FlexRowContainer";
import { LikesAndPassedTimeContainer } from "../layoutComponent/PayloadAndLikesContainer";
import { CommentsNavProps, NotLogInSingleCommentOfCommentProps } from "../../../types/comment";
import AvatarContainer from "../commonStyledComponent/AvatarContainer";
import UserNameAndPayloadContainer from "../commonStyledComponent/UserNameAndPayloadContainer";
import UserActionContainer from "../commonStyledComponent/UserActionContainer";
import getPassedTime from "../../../logic/getPassedTime";
import { useNavigation } from "@react-navigation/native";

const FlexRowContainerWithMargin = styled(FlexRowContainer)<{isAndroid:boolean}>`
  margin: ${props=>props.isAndroid ? "0px" : "1px 0px" };
`;
const LeftMarginContainer = styled.View`
  width: 40px;
`;
const ContentContainer = styled.View`
  flex: 1;
`;

const NotLogInSingleCommentOfCommentLayout = ({mention}:NotLogInSingleCommentOfCommentProps) => {

  const onPressLike = () => {
    Alert.alert("로그인 후 이용 가능합니다.",null,[{
      text:"확인"
    }])
  };

  const user = mention.user;
  const userId = user.id;
  const userName = user.userName;
  const avatar = user.avatar;
  const payload = mention.payload;
  const createAt = mention.createdAt;

  const passedTime = getPassedTime(createAt);
  
  const navigation = useNavigation<CommentsNavProps["navigation"]>();
  const onPressUserInfo = () => {
    navigation.navigate("Profile",{id:userId,userName});
  };

  const isAndroid = Platform.OS === "android";

  return (
    <FlexRowContainerWithMargin isAndroid={isAndroid}>
      <LeftMarginContainer/>
      <AvatarContainer
        avatar={avatar}
        onPressAvatar={onPressUserInfo}
      />
      <ContentContainer>
        <UserNameAndPayloadContainer
          onPressUserName={onPressUserInfo}
          userName={userName}
          payload={payload}
        />
        <UserActionContainer>
          <LikesAndPassedTimeContainer
            onPressLike={onPressLike}
            isLiked={false}
            totalLikes={mention.totalLikes}
            passedTime={passedTime}
          />
        </UserActionContainer>
      </ContentContainer>
    </FlexRowContainerWithMargin>
  )
};

export default NotLogInSingleCommentOfCommentLayout;
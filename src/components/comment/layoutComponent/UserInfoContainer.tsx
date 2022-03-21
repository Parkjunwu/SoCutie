import React from "react";
import styled from "styled-components/native";

const UContainer = styled.View``;
const UserContainer = styled.View`
  flex-direction: row;
`;
const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;
const UserName = styled.Text`
  color: ${props => props.theme.textColor};
  font-size: 18px;
  font-weight: 600;
  margin: auto 10px;
`;

const UserInfoContainer = ({avatarUri,userName}) => {
  return (
    <UContainer>
      <UserContainer>
        <Avatar source={avatarUri ? {uri:avatarUri} : require("../../../../assets/no_user.png")}/>
        <UserName>{userName}</UserName>
      </UserContainer>
    </UContainer>
  );
};

export default UserInfoContainer;
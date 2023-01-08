import { useNavigation } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from "react-native";
import { colors } from "../color";

const Container = styled.View`
  background-color: ${props=>props.theme.backgroundColor};
  flex:1;
  justify-content: center;
  align-items: center;
`;
const AttractText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 17px;
  margin-bottom: 20px;
`;
const GoToLink = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const LinkText = styled.Text`
  color: ${props=>props.theme.linkTextColor};
  font-weight: 600;
`;

const NotLoggedInUserView = () => {
  const navigation = useNavigation();

  const darkModeSubscription = useColorScheme();

  const onPressNavigate = () => navigation.navigate("AuthNav");
  return (
    <Container>
      <AttractText>회원가입 하고 나와 잘 맞는 유저들과 소통하세요!</AttractText>
      <GoToLink onPress={onPressNavigate}>
        <LinkText>로그인 / 회원가입 페이지로 이동 </LinkText>
        <MaterialCommunityIcons name="login" size={22} color={darkModeSubscription === "light" ? colors.darkYellow : colors.yellow } />
      </GoToLink>
    </Container>
  )
};

export default NotLoggedInUserView;
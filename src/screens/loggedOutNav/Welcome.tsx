import React from "react";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { colors } from "../../color";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthButton from "../../components/auth/AuthButton";

const LoginLink = styled.Text`
  color: ${colors.brown};
  font-weight: 600;
  margin-top: 10px;
`;
type RouteParams = {
  userName: string;
  password: string;
}

type RootStackParamList = {
  Welcome: undefined;
  LogIn: RouteParams | undefined;
  CreateAccount: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const Welcome = ({navigation:{navigate},route:{params}}:Props) => {
  const goToCreateAccount = () => navigate("CreateAccount");
  const goToLogIn = () => navigate("LogIn")
  return <AuthLayout>
    <AuthButton onPress={goToCreateAccount} disabled={false} text="Create New Account" loading={false}/>
    <TouchableOpacity onPress={goToLogIn}>
      <LoginLink>Log In</LoginLink>
    </TouchableOpacity>
  </AuthLayout>
};

export default Welcome;
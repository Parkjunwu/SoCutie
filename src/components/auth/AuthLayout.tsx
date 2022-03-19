import React from "react";
import { Platform } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../DismissKeyboard";

const Container = styled.View`
  background-color: ${props=>props.theme.backgroundColor};
  flex:1;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
`;
const Logo = styled.Image`
  max-width:50%;
  width: 100%;
  height: 100px;
`;
const KeyboardAvoidLayout = styled.KeyboardAvoidingView`
  width: 100%;
  align-items:center;
`;

// 얘 아래에 flex:1 인 View 있어야 함.
const AuthLayout:React.FC = ({children}) => {
  return (
  <DismissKeyboard>
    <Container>
    <KeyboardAvoidLayout
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={30}  
    >
        <Logo resizeMode="contain" source={require("../../../assets/logo.png")}  />
        {children}
    </KeyboardAvoidLayout>
      </Container>
  </DismissKeyboard>
  );
};

export default AuthLayout;
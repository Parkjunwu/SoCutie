import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../DismissKeyboard";

const Container = styled.View`
  background-color: black;
  flex:1;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
`;
const Logo = styled.Image`
  max-width:50%;
  width: 100%;
  height: 100px;
  /* margin: 0 auto; */
`;
const KeyboardAvoidLayout = styled.KeyboardAvoidingView`
  /* flex:1; */
  width: 100%;
  /* padding: 0px auto; */
  align-items:center;
  /* justify-content:center; */
`;

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
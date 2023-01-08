import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessageNavProps } from "../../../../components/type";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons"
import { Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, useColorScheme } from "react-native";
import { useMutation } from "@apollo/client";
import { sendMessage, sendMessageVariables } from "../../../../__generated__/sendMessage";
import { SEND_MESSAGE_MUTATION } from "../../../../gql/forCodeGen";

// forCodeGen 으로 옮김
// const SEND_MESSAGE_MUTATION 

const Container = styled.View`
  background-color: ${props=>props.theme.backgroundColor};
  flex:1;
  /* align-items: flex-end; */
  justify-content: flex-end;
`;
const UserInput = styled.TextInput<{darkMode:string}>`
  /* 다크모드에 따라 색상 바뀜. */
  border: ${props => props.darkMode === "light" ? "2px solid rgba(0,0,0,0.2)" : "2px solid rgba(255,255,255,0.5)"};
  padding: 10px 20px;
  border-radius: 100px;
  color: ${props => props.theme.textColor};
  width: 90%;
  margin-right: 10px;
`;
const InputContainer = styled.View`
  margin: 10px auto 50px auto;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;
const SendButton = styled.TouchableOpacity`
  
`;
type Props = NativeStackScreenProps<MessageNavProps, "TemporaryRoom">

const TemporaryRoom = ({navigation,route}:Props) => {
  const darkModeSubscription = useColorScheme();
  const [payload,setPayload] = useState("");
  const userId = route.params.userId;
  const userName = route.params.userName;
  

  useEffect(()=>{
    navigation.setOptions({
      headerLeft:({tintColor}) => <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="chevron-back" color={tintColor} size={30} />
      </TouchableOpacity>,
      title:`${userName} 님 과의 대화`,
      headerBackTitleVisible:false,
    })
  },[])
  
  const [sendMessage,{loading}] = useMutation<sendMessage,sendMessageVariables>(SEND_MESSAGE_MUTATION,{
    variables:{
      payload,
      userId,
    }
  });
  
  const onSubmitEditing = async() => {
    const result = await sendMessage();
    // null 체크 안함. 맞는지 모름.
    const mutationResult = result.data.sendMessage;
    if(mutationResult.ok) {
      navigation.replace("Room",{
        id:mutationResult.roomId,
        opponentUserName:userName,
      });
    } else if (mutationResult.error){
      Alert.alert(mutationResult.error,null,[
        {
          text:"확인",
        }
      ])
    }
  };
  
  // 메세지 입력하면 색 찐해지게
  const sendBtnColor = () => {
    if(payload === "") {
      if(darkModeSubscription === "light"){
        return "rgba(0,0,0,0.3)";
      } else {
        return "rgba(255,255,255,0.7)";
      }
    } else {
      if(darkModeSubscription === "light"){
        return "rgba(0,0,0,0.7)";
      } else {
        return "white";
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    {/* <MessageKeyboardAvoidLayout> */}
    <KeyboardAvoidingView style={{flex:1, backgroundColor:"yellow"}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={50}>
      <Container>
      {/* <ScreenLayout loading={loading}> */}
        {/* 없어도 될라나? 아님 여기에 ScreenLayout 넣거나 */}
        {/* <View style={{width:"100%", marginVertical:10}}/> */}
        <InputContainer>
          <UserInput
            placeholder="Write a message"
            returnKeyType="send"
            placeholderTextColor={darkModeSubscription === "light" ? "rgba(0,0,0,0.7)" :"rgba(255,255,255,0.7)"}
            value={payload}
            autoCapitalize="none"
            autoCorrect={false} 
            onChangeText={text => setPayload(text)}
            onSubmitEditing={onSubmitEditing}
            darkMode={darkModeSubscription}
          />
          <SendButton onPress={onSubmitEditing} disabled={payload === ""}>
            <Ionicons name="send" color={sendBtnColor()} size={25} />
          </SendButton>
        </InputContainer>
      {/* </ScreenLayout> */}
        </Container>
        </KeyboardAvoidingView>
    {/* </MessageKeyboardAvoidLayout> */}
    </TouchableWithoutFeedback>
  );
};

export default TemporaryRoom;
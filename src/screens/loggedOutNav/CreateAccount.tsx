import { gql, useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Alert, TextInput, TouchableOpacity, useColorScheme } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";
import AuthButton from "../../components/auth/AuthButton";
import AuthLayout from "../../components/auth/AuthLayout";
import { Input } from "../../components/auth/AuthShared";
import { createAccount, createAccountVariables } from "../../__generated__/createAccount";

const LoginLink = styled.Text`
  color: ${colors.brown};
  font-weight: 600;
  margin-top: 10px;
`;

type RouteParams = {
  userName: string;
  password: string;
  // 어차피 로그인 화면에서 구현할거니까
  message: boolean;
}

type RootStackParamList = {
  Welcome: undefined;
  LogIn: RouteParams | undefined;
  CreateAccount: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

type FormData = {
  firstName:string;
  lastName:string;
  userName:string;
  email:string;
  password:string;
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!,
    $lastName: String,
    $userName: String!,
    $email: String!,
    $password: String!
  ) { createAccount(
    firstName:$firstName,
    lastName:$lastName,
    userName:$userName,
    email:$email,
    password:$password
  ){
    ok
    # error
    errorCode
  }}
`;

const CreateAccount = ({navigation:{navigate}}:Props) => {
  const onCompleted = (data:createAccount) => {
    const {createAccount:{ok, errorCode}} = data;
    if(ok){
      const {userName,password} = getValues();
      navigate("LogIn", {
        userName,
        password,
        message:true
      });
    } else {
      if(errorCode === "UNKNOWN") {
        Alert.alert("계정을 생성하지 못하였습니다.","알 수 없는 오류가 발생하였습니다. 같은 문제가 지속적으로 발생 시 문의 주시면 감사드리겠습니다.")
      } else if ( errorCode === "EMAIL") {
        Alert.alert("같은 이메일의 계정이 존재합니다.","다른 이메일로 가입해 주시면 감사드리겠습니다.")
      } else {
        Alert.alert("같은 이름의 계정이 존재합니다.","다른 이름으로 가입해 주시면 감사드리겠습니다.")
      }
    }
  }
  const [createAccountMutation,{loading}] = useMutation<createAccount,createAccountVariables>(CREATE_ACCOUNT_MUTATION)
  const {register, handleSubmit, setValue, watch,getValues} = useForm<FormData>();
  const lastNameRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const onNext = (nextOne:React.RefObject<TextInput>) => {
    nextOne.current?.focus();
  }
  const goToLogIn = () => navigate("LogIn");
  const onValid: SubmitHandler<FormData> = (data) => {
    if(!loading){
      createAccountMutation({
        variables:{
          ...data
        },
        onCompleted,
      })
    }
  };
  useEffect(() => {
    register("firstName",{
      required:true,
    });
    register("lastName",{
      required:true,
    });
    register("userName",{
      required:true,
    });
    register("email",{
      required:true,
    });
    register("password",{
      required:true,
    });
  },[register])

  const darkModeSubscription = useColorScheme();
  const placeholderTextColor = darkModeSubscription === "light" ? "grey" : "rgba(255,255,255,0.8)"

  return <AuthLayout>
    <Input
      placeholder="First Name"
      returnKeyType="next"
      autoCapitalize="none"
      onSubmitEditing={()=>onNext(lastNameRef)}
      blurOnSubmit={false}
      placeholderTextColor={placeholderTextColor}
      onChangeText={(text)=>setValue("firstName",text)}
    />
    <Input
      placeholder="Last Name"
      returnKeyType="next"
      autoCapitalize="none"
      autoCorrect={false}
      ref={lastNameRef}
      onSubmitEditing={()=>onNext(userNameRef)}
      blurOnSubmit={false} 
      placeholderTextColor={placeholderTextColor}
      onChangeText={(text)=>setValue("lastName",text)}
    />
    <Input
      placeholder="User Name"
      returnKeyType="next"
      autoCapitalize="none"
      autoCorrect={false}
      ref={userNameRef}
      onSubmitEditing={()=>onNext(emailRef)}
      blurOnSubmit={false} 
      placeholderTextColor={placeholderTextColor}
      onChangeText={(text)=>setValue("userName",text)}
    />
    <Input
      placeholder="Email"
      keyboardType="email-address"
      returnKeyType="next"
      autoCapitalize="none"
      autoCorrect={false}
      ref={emailRef}
      onSubmitEditing={()=>onNext(passwordRef)}
      blurOnSubmit={false} 
      placeholderTextColor={placeholderTextColor}
      onChangeText={(text)=>setValue("email",text)}
    />
    <Input
      placeholder="Password"
      secureTextEntry={true}
      // autoCapitalize="none"
      returnKeyType="done"
      autoCorrect={false}
      ref={passwordRef}
      onSubmitEditing={handleSubmit(onValid)}
      placeholderTextColor={placeholderTextColor}
      lastOne={true}
      onChangeText={(text)=>setValue("password",text)}
    />
    <AuthButton text="Create Account" onPress={handleSubmit(onValid)} disabled={loading} loading={loading}/>
    <TouchableOpacity onPress={goToLogIn}>
      <LoginLink>Log In</LoginLink>
    </TouchableOpacity>
  </AuthLayout>;
};

export default CreateAccount;
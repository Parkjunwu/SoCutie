import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Alert, TextInput } from "react-native";
import { isLoggedInVar, logUserIn } from "../apollo";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { Input } from "../components/auth/AuthShared";
import { login, loginVariables } from "../__generated__/login";

const LOGIN_MUTATION = gql`
  mutation login($userName: String!,$password: String!){
    login(userName: $userName, password: $password){
      ok
      token
      error
    }
  }
`;

type RouteParams = {
  userName: string;
  password: string;
  message: boolean;
}

type RootStackParamList = {
  Welcome: undefined;
  LogIn: RouteParams | undefined;
  CreateAccount: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LogIn'>;

type FormData = {
  userName: string;
  password: string;
};

const LogIn = ({navigation:{navigate},route:{params}}:Props) => {
  useEffect(()=>{
    if(params?.message) {
      Alert.alert("계정이 생성되었습니다.","로그인해 주시면 감사드리겠습니다.")
    }
  },[])
  const onCompleted = async(data:login) => {
    const {login:{ok,token}} = data;
    if(ok) {
      await logUserIn(token||"");
    }
  }
  const [loginMutation,{loading,data}] = useMutation<login,loginVariables>(LOGIN_MUTATION, {onCompleted})
  const {register,handleSubmit,setValue,watch} = useForm<FormData>({
    // defaultValues:{
    //   userName:params?.userName,
    //   password:params?.password,
    // }
  });
  useEffect(()=>{
    setValue("userName",params?.userName || "")
    setValue("password",params?.password || "")
  },[])
  console.log(params)
  const passwordRef = useRef<TextInput>(null);
  const onEmailSubmit = () => passwordRef.current?.focus();
  const onVaild:SubmitHandler<FormData> = (data) => {
    if(!loading){
      // console.log(data);
      // const {userName,password} = data;
      loginMutation({
        variables:{
          ...data,
          // userName,
          // password,
        }
      })
    }
  };

  useEffect(()=>{
    register("userName",{
      required:true,
    });
    register("password",{
      required:true,
    });
  },[register])
  return <AuthLayout>
    <Input
      placeholder="Username"
      returnKeyType="next"
      autoCapitalize="none"
      onSubmitEditing={onEmailSubmit}
      blurOnSubmit={false} 
      placeholderTextColor={"rgba(255,255,255,0.8)"}
      onChangeText={(text)=>setValue("userName",text)}
      value={watch("userName")}
      // defaultValue={params?.userName}
    />
    <Input
      placeholder="Password"
      secureTextEntry={true}
      autoCapitalize="none"
      returnKeyType="done"
      ref={passwordRef}
      placeholderTextColor={"rgba(255,255,255,0.8)"}
      lastOne={true}
      onSubmitEditing={handleSubmit(onVaild)}
      onChangeText={(text)=>setValue("password",text)}
      value={watch("password")}
      // defaultValue={params?.password}
    />
    <AuthButton onPress={handleSubmit(onVaild)} disabled={!(watch("userName") && watch("password"))} text="Log in" loading={loading} />
  </AuthLayout>;
};

export default LogIn;
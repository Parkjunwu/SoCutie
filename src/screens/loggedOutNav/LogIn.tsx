import { gql, useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Text, TextInput } from "react-native";
import AuthButton from "../../components/auth/AuthButton";
import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/auth/AuthShared";
import useLogIn from "../../hooks/useLogIn";
import usePlaceHolderColor from "../../hooks/usePlaceHolderColor";
import getDomainUrl from "../../logic/getDomainUrl";
import { emailCheck } from "../../logic/userInfoFormCheck";
import { login, loginVariables } from "../../__generated__/login";
import * as WebBrowser from 'expo-web-browser';
import useResendEmail from "../../hooks/useResendEmail";
import useResendEmailWhenFirstCreateAccountNeedEmail from "../../hooks/useResendEmailWhenFirstCreateAccount";

const LOGIN_MUTATION = gql`
  mutation login($email: String!,$password: String!){
    login(email: $email, password: $password){
      ok
      accessToken
      refreshToken
      errorCode
    }
  }
`;

type RouteParams = {
  email: string;
  // password: string;
}

type RootStackParamList = {
  Welcome: undefined;
  LogIn: RouteParams | undefined;
  CreateAccount: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LogIn'>;

type FormData = {
  email: string;
  password: string;
};

const LogIn = ({navigation:{navigate},route:{params}}:Props) => {
  const emailParam = params?.email;

  const alertResendEmailWhenFirstCreateAccount = useResendEmailWhenFirstCreateAccountNeedEmail(emailParam)

  useEffect(()=>{
    if(emailParam) {
      // 모달? 띄움. 웹사이트 이동
      const domainUrl = getDomainUrl(emailParam);
      Alert.alert("작성해주신 이메일 주소로 확인 메일이 발송 되었습니다. 이메일 인증이 완료되면 회원가입이 완료되며 30분 이내에 미인증시 해당 데이터는 삭제됩니다.",`이메일 인증을 위하여 ${domainUrl}로 이동하시겠습니까?`,[
        {
          text:"이동",
          onPress:async()=>{
            await WebBrowser.openBrowserAsync(domainUrl);
            alertResendEmailWhenFirstCreateAccount();
          }
        },
        {
          text:"취소"
        }
      ]);
    }
  },[]);

  const { register, handleSubmit, getValues, watch, control, formState: { errors }} = useForm<FormData>();
  
  // // useLogIn 에서 받게함
  // const {refetch} = useMe();
  const logInFunctionNeedToken = useLogIn();

  const alertResendEmailNeedEmail = useResendEmail();
  
  const alertCheckEmailAndPassword = () => Alert.alert("아이디 / 비밀번호를 확인해 주세요.",null,[
    {
      text:"확인"
    },
  ]);

  const onCompleted = async(data:login) => {

    const {login: { ok, accessToken, refreshToken, errorCode }} = data;

    // 로그인 정보가 틀릴 때
    if(!ok) {
      if(errorCode === "NO_USER"){
        return alertCheckEmailAndPassword();
      } else if (errorCode === "NOT_AUTHENTICATED") {
        return alertResendEmailNeedEmail(getValues("email"));
      }
    }
    
    // 로그인 성공 시
    await logInFunctionNeedToken(accessToken,refreshToken);
    navigate("FeedTab",{
      screen:"Feed"
    });
  };

  const [loginMutation,{loading,data}] = useMutation<login,loginVariables>(LOGIN_MUTATION, {
    onCompleted
  });

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const onEmailSubmit = () => passwordRef.current?.focus();

  const onVaild:SubmitHandler<FormData> = (data) => {
    if(!loading){
      loginMutation({
        variables:{
          ...data,
        },
      });
    }
  };

  useEffect(()=>{
    register("email",{
      required:true,
    });
    register("password",{
      required:true,
    });
  },[register])

  const placeholderTextColor = usePlaceHolderColor();

  const logInResultOk = data?.login.ok;
  const disabled = () => {
    if(loading){
      return true;
    }
    if(logInResultOk){
      return true;
    }
    const isNotWrite = !(watch("email") && watch("password"))
    if(isNotWrite){
      return true;
    }
    return false;
  };
  
  const logInText = logInResultOk ? "done!" : "Log in";

  return <AuthLayout>
    <Controller
      control={control}
      rules={{
        required: true,
        validate:(value)=>emailCheck(value),
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder="이메일"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={false}
          ref={emailRef}
          onSubmitEditing={onEmailSubmit}
          blurOnSubmit={false}
          placeholderTextColor={placeholderTextColor}
        />
      )}
      name="email"
    />
    {errors.email?.type === "required" && <Text>이메일을 입력해 주세요.</Text>}
    {errors.email?.type === "validate" && <Text>이메일 형식이 맞지 않습니다.</Text>}
    <Controller
      control={control}
      rules={{
        required: true,
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder="비밀번호"
          secureTextEntry={true}
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={false}
          ref={passwordRef}
          lastOne={true}
          onSubmitEditing={handleSubmit(onVaild)}
          // onSubmitEditing={()=>onNext(userNameRef)}
          blurOnSubmit={false}
          placeholderTextColor={placeholderTextColor}
        />
      )}
      name="password"
    />
    {errors.password?.type === "required" && <Text>비밀번호를 작성해 주세요.</Text>}
    {/* <AuthButton onPress={handleSubmit(onVaild)} disabled={!(watch("email") && watch("password"))} text="Log in" loading={loading} /> */}
    <AuthButton onPress={handleSubmit(onVaild)} disabled={disabled()} text={logInText} loading={loading} />
  </AuthLayout>;
};

export default LogIn;

import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react"; 
import { Alert, TouchableOpacity, useColorScheme } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons"
import ImagePicker from 'react-native-image-crop-picker';
import { ReactNativeFile } from "apollo-upload-client";
import { MeStackProps } from "../../../../components/type";
import useMe from "../../../../hooks/useMe";
import { editProfile, editProfileVariables } from "../../../../__generated__/editProfile";
import DismissKeyboard from "../../../../components/DismissKeyboard"
import FastImage from 'react-native-fast-image'
import { noUserUriVar } from "../../../../apollo";
import { userNameCheck } from "../../../../logic/userInfoFormCheck";


const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String,
    $lastName: String,
    $userName: String,
    $email: String,
    $password: String,
    $bio: String,
    $avatar: Upload,
  ) {
    editProfile(
      firstName: $firstName,
      lastName: $lastName,
      userName: $userName,
      email: $email,
      password: $password,
      bio: $bio,
      avatar: $avatar,
    ) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  background-color: ${props => props.theme.backgroundColor};
  flex: 1;
`;
const AvatarContainer = styled.View`
  flex:1;
  justify-content: center;
  align-items: center;
`;
const ChangeAvatarBtn = styled.TouchableOpacity`

`;
const ChangeAvatarBtnText = styled.Text`
  color:${props => props.theme.textColor};
`;
const UnderLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: grey;
`;
const UserInfoContainer = styled.View`
  flex:1.5;
  margin: 15px;
`;
const UserName = styled(ChangeAvatarBtnText)``;
const UserNameInput = styled.TextInput`
  padding: 10px 0px;
  color:${props => props.theme.textColor};
`;
const Bio = styled(ChangeAvatarBtnText)`
  margin-top: 8px;
`;
const BioInput = styled(UserNameInput)``;

type Props = NativeStackScreenProps<MeStackProps, 'EditProfile'>;

const EditProfile = ({navigation,route}:Props) => {
  // 기존 유저 데이터
  const { data } = useMe();
  const userId = data.me.id;
  const prevUserName = data.me.userName;
  const prevBio = data.me.bio;
  const prevAvatar = data.me.avatar;
  // TextInput 데이터
  const [userNameValue,setUserNameValue] = useState("");
  const [bioValue,setBioValue] = useState("");
  const [bioAlert,setBioAlert] = useState(false);
  const setBioValueUnder100 = (text:string) => {
    setBioValue(prev=>{
      if(prev && prev.length > 100 && text.length > 100) {
        setBioAlert(true);
        return prev;
      } else {
        setBioAlert(false);
        return text;
      }
    });
  };
  
  // Mutation
  const [editProfile,{error,loading}] = useMutation<editProfile,editProfileVariables>(EDIT_PROFILE_MUTATION);


  ////
  // ImagePicker
  const [avatar, setAvatar] = useState(data?.me?.avatar);

  const pickAvatarImage = () => {
    ImagePicker.openPicker({
      width: 640,
      height: 640,
      cropping: true,
      mediaType: 'photo',
    }).then(image => {
      setAvatar(image.path);
      // sourceURL 이 file:// 인데 얘는 ios 만 된대
      // setAvatar(image.sourceURL);
    });

  };


  const onlyChangedData = {
    // 바뀐 애들만
    ...( userNameValue !== prevUserName && { userName: userNameValue } ),
    ...( bioValue !== prevBio && { bio: bioValue } ),
    // avatar
    ...( avatar !== prevAvatar && {
      avatar: new ReactNativeFile({
        uri:avatar,
        name: "1.jpg",
        type: "image/jpeg",
      })
    }),
  };

  const cacheUpdateMeData:MutationUpdaterFunction<editProfile, editProfileVariables, DefaultContext, ApolloCache<any>> = async (cache,data) => {
    if(data.data?.editProfile.ok) {
      // useMe 에 캐시
      cache.modify({
        id:`User:${userId}`,
        fields:{
          userName(prev){
            return userNameValue !== prevUserName ? userNameValue : prevUserName
          },
          bio(prev){
            return bioValue !== prevBio ? bioValue : prevBio
          },
          avatar(prev){
            return avatar !== prevAvatar ? avatar : prevAvatar
          },
        },
      });
    } else {
      return Alert.alert(data?.data.editProfile.error);
    }
  };


  
  // 프로필 변경 완료 시
  const onPressComplete = async() => {
    
    if(loading) return;
    // 이름 안썼을 때 알림창
    if(!userNameValue) return Alert.alert("이름은 필수 항목입니다. 이름을 작성해 주세요.");
    if(!userNameCheck(userNameValue)) return Alert.alert("닉네임에는 20자 이하의 영어, 한글, 숫자만 사용 가능합니다.");
    // 기존 데이터랑 똑같으면 그냥 돌아감.
    if(userNameValue === prevUserName && bioValue === prevBio && prevAvatar === avatar) return navigation.goBack();

    // Mutation 실행
    const result = await editProfile({
      variables:onlyChangedData,
      // refetch 대신.
      update:cacheUpdateMeData
    });
    // Mutation 자체 에러 시에도 유저한테 보여줘야 하는데 일단은 콘솔 찍음.
    if(error) {
      console.log(error);
    }
    // 백엔드에서 에러 뜰 시 에러메세지 보여줌.
    if(!result.data.editProfile.ok) return Alert.alert(result.data.editProfile.error);
    // 완료시 뒤로 감.
    if(result.data.editProfile.ok) {
      // refetch 대신 위에cache 변경 로직 넣음
      navigation.goBack();
      Alert.alert("정보가 변경되었습니다.");
    };
  };

  const darkModeSubscription = useColorScheme();

  // 헤더에 완료 버튼 넣음
  useEffect(()=>{
    navigation.setOptions({
      headerRight:()=><TouchableOpacity onPress={onPressComplete}><Ionicons name="md-checkmark-sharp" size={30} color={darkModeSubscription === "light" ? "black" : "white"} /></TouchableOpacity>
    })
  },[userNameValue,bioValue,avatar]);

  // 기본으로 기존 유저 데이터 넣음.
  useEffect(()=>{
    setUserNameValue(prevUserName);
    setBioValue(prevBio);
  },[data])

  return (
    <DismissKeyboard>
      <Container>
        <AvatarContainer>
          <FastImage
            style={{
              width: 130,
              height: 130,
              borderRadius: 65,
              marginBottom: 20,
            }}
            source={{ uri: avatar ? avatar : noUserUriVar() }}
          />
          <ChangeAvatarBtn onPress={pickAvatarImage}>
            <ChangeAvatarBtnText>프로필 사진 변경</ChangeAvatarBtnText>
          </ChangeAvatarBtn>
        </AvatarContainer>
        <UserInfoContainer>
          <UserName>이름</UserName>
          {/* 중복 확인? UserName 은 unique 니까. 굳이 unique 할 필요는 없을 듯 */}
          <UserNameInput value={userNameValue} autoCapitalize="none" autoCorrect={false} onChangeText={text=>setUserNameValue(text)} />
          <UnderLine/>
          <Bio>소개</Bio>
          <BioInput value={bioValue} autoCapitalize="none" autoCorrect={false} onChangeText={text=>setBioValueUnder100(text)} />
          <UnderLine/>
          {bioAlert && <Bio>소개는 100자 이하로 작성하셔야 합니다.</Bio>}
        </UserInfoContainer>
      </Container>
    </DismissKeyboard>
  );
};

export default EditProfile;
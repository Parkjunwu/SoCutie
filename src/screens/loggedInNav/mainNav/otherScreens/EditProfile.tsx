import { gql, useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react"; 
import { Alert, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import {Ionicons} from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker';
import { ReactNativeFile } from "apollo-upload-client";
import { MeStackProps } from "../../../../components/type";
import useMe from "../../../../hooks/useMe";
import { editProfile, editProfileVariables } from "../../../../__generated__/editProfile";
import DismissKeyboard from "../../../../components/DismissKeyboard"

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
const Avatar = styled.Image`
  width: 130px;
  height: 130px;
  border-radius: 65px;
  margin-bottom: 20px;
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
  const prevUserName = data.me.userName;
  const prevBio = data.me.bio;
  const prevAvatar = data.me.avatar;
  console.log(prevAvatar);
  // TextInput 데이터
  const [userNameValue,setUserNameValue] = useState("");
  const [bioValue,setBioValue] = useState("");
  // Mutation
  const [editProfile,{error}] = useMutation<editProfile,editProfileVariables>(EDIT_PROFILE_MUTATION);


  ////
  // ImagePicker
  const [image, setImage] = useState(data?.me?.avatar);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    };
  };


  ////
  
  // 프로필 변경 완료 시
  const onPressComplete = async() => {
    // 이름 안썼을 때 알림창
    if(!userNameValue) return Alert.alert("이름은 필수 항목입니다. 이름을 작성해 주세요.");
    // 기존 데이터랑 똑같으면 그냥 돌아감.
    if(userNameValue === prevUserName && bioValue === prevBio && prevAvatar === image) return navigation.goBack();

    // Mutation 실행
    const result = await editProfile({
      variables:{
        // 바뀐 애들만 보냄.
        ...( userNameValue !== prevUserName && { userName: userNameValue } ),
        ...( bioValue === prevBio && { bio: bioValue } ),
        // image
        ...( image !== prevAvatar && {
          avatar: new ReactNativeFile({
            uri:image,
            name: "1.jpg",
            type: "image/jpeg",
          })
        })
      }
    });
    // Mutation 자체 에러 시에도 유저한테 보여줘야 하는데 일단은 콘솔 찍음.
    if(error) {
      console.log(error);
    }
    // 백엔드에서 에러 뜰 시 에러메세지 보여줌.
    if(!result.data.editProfile.ok) return Alert.alert(result.data.editProfile.error);
    // 완료시 뒤로 감.
    if(result.data.editProfile.ok) {
      // me 데이터 refetch 해야되나?
      navigation.goBack();
      Alert.alert("정보가 변경되었습니다.");
    };
  };

  // 헤더에 완료 버튼 넣음
  useEffect(()=>{
    navigation.setOptions({
      headerRight:()=><TouchableOpacity onPress={onPressComplete}><Ionicons name="md-checkmark-sharp" size={30} color="white" /></TouchableOpacity>
    })
  },[]);

  // 기본으로 기존 유저 데이터 넣음.
  useEffect(()=>{
    setUserNameValue(prevUserName);
    setBioValue(prevBio);
  },[data])

  return (
    <DismissKeyboard>
      <Container>
        <AvatarContainer>
          <Avatar source={image?{uri:image}:require("../../../../../assets/no_user.png")}/>
          <ChangeAvatarBtn onPress={pickImage}>
            <ChangeAvatarBtnText>프로필 사진 변경</ChangeAvatarBtnText>
          </ChangeAvatarBtn>
        </AvatarContainer>
        <UserInfoContainer>
          <UserName>이름</UserName>
          {/* 중복 확인? UserName 은 unique 니까. 굳이 unique 할 필요는 없을 듯 */}
          <UserNameInput value={userNameValue} onChangeText={text=>setUserNameValue(text)} />
          <UnderLine/>
          <Bio>소개</Bio>
          <BioInput/>
          <UnderLine/>
        </UserInfoContainer>
      </Container>
    </DismissKeyboard>
  );
};

export default EditProfile;
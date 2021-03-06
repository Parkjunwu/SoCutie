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
  // ?????? ?????? ?????????
  const { data } = useMe();
  const prevUserName = data.me.userName;
  const prevBio = data.me.bio;
  const prevAvatar = data.me.avatar;
  console.log(prevAvatar);
  // TextInput ?????????
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
  
  // ????????? ?????? ?????? ???
  const onPressComplete = async() => {
    // ?????? ????????? ??? ?????????
    if(!userNameValue) return Alert.alert("????????? ?????? ???????????????. ????????? ????????? ?????????.");
    // ?????? ???????????? ???????????? ?????? ?????????.
    if(userNameValue === prevUserName && bioValue === prevBio && prevAvatar === image) return navigation.goBack();

    // Mutation ??????
    const result = await editProfile({
      variables:{
        // ?????? ????????? ??????.
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
    // Mutation ?????? ?????? ????????? ???????????? ???????????? ????????? ????????? ?????? ??????.
    if(error) {
      console.log(error);
    }
    // ??????????????? ?????? ??? ??? ??????????????? ?????????.
    if(!result.data.editProfile.ok) return Alert.alert(result.data.editProfile.error);
    // ????????? ?????? ???.
    if(result.data.editProfile.ok) {
      // me ????????? refetch ?????????????
      navigation.goBack();
      Alert.alert("????????? ?????????????????????.");
    };
  };

  // ????????? ?????? ?????? ??????
  useEffect(()=>{
    navigation.setOptions({
      headerRight:()=><TouchableOpacity onPress={onPressComplete}><Ionicons name="md-checkmark-sharp" size={30} color="white" /></TouchableOpacity>
    })
  },[]);

  // ???????????? ?????? ?????? ????????? ??????.
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
            <ChangeAvatarBtnText>????????? ?????? ??????</ChangeAvatarBtnText>
          </ChangeAvatarBtn>
        </AvatarContainer>
        <UserInfoContainer>
          <UserName>??????</UserName>
          {/* ?????? ??????? UserName ??? unique ??????. ?????? unique ??? ????????? ?????? ??? */}
          <UserNameInput value={userNameValue} onChangeText={text=>setUserNameValue(text)} />
          <UnderLine/>
          <Bio>??????</Bio>
          <BioInput/>
          <UnderLine/>
        </UserInfoContainer>
      </Container>
    </DismissKeyboard>
  );
};

export default EditProfile;
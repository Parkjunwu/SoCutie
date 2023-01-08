import { TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { noUserUriVar } from "../../../apollo";
import { Ionicons } from "@expo/vector-icons";
import useIsDarkMode from "../../../hooks/useIsDarkMode";
import { useNavigation } from "@react-navigation/native";
import useTogglePetLogLike from "../../../hooks/useTogglePetLogLike";
import { PetLogFooterComponentProps } from "../type/petLogFooterComponentProps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MeStackProps } from "../../type";

const UserContainer = styled.View`
  margin-bottom: 3px;
  align-items: center;
`;
const SeeProfileText = styled.Text`
  color: ${props=>props.theme.textColor};
`;
const InfoContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const LikeText = styled.Text`
  color: ${props=>props.theme.textColor};
`;
const TotalComment = styled(LikeText)`

`;

const UserAndInfoContainer = ({id,isLiked,likes,commentNumber,user,isDarkMode}:PetLogFooterComponentProps&{isDarkMode:boolean}) => {

  const navigation = useNavigation<NativeStackScreenProps<MeStackProps,"PetLog">["navigation"]>();
  const onPressProfile = () => navigation.navigate("Profile",{
    ...user,
  });
  const togglePetLogLike = useTogglePetLogLike(id);
  const onPressLike = () => togglePetLogLike();

  return (
    <>
      <UserContainer>
        <TouchableOpacity onPress={onPressProfile}>
          <FastImage
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              marginBottom: 8,
            }}
            source={{
              uri : noUserUriVar()
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressProfile}>
          <SeeProfileText>
            프로필 보기
          </SeeProfileText>
        </TouchableOpacity>
      </UserContainer>

      <InfoContainer>
        <TouchableOpacity onPress={onPressLike}>
          <Ionicons name={isLiked?"heart":"heart-outline"} color={isLiked ? "tomato" : isDarkMode ? "white" : "black"} size={20}/> 
        </TouchableOpacity>
          <LikeText> {likes}</LikeText>
        <TotalComment>     {commentNumber} 개의 댓글</TotalComment>
      </InfoContainer>
    </>
  );
};

export default UserAndInfoContainer;
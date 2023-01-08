import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { noUserUriVar } from "../../apollo";
import { Ionicons } from "@expo/vector-icons"
import useIsDarkMode from "../../hooks/useIsDarkMode";
import useTogglePetLogLike from "../../hooks/useTogglePetLogLike";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View<{isDarkMode:boolean}>`
  border-bottom-color: rgba(100,100,100,0.4);
  border-bottom-width: ${props=>props.isDarkMode ? "0px" : "1px"};
  /* border-color: rgba(100,100,100,0.1);
  border-width: 2px; */
  /* background-color: ${props=>props.isDarkMode ? "rgba(160,160,160,0.2)" : "rgba(255,235,205,0.2)"}; */
  background-color: ${props=>props.isDarkMode ? "rgba(160,160,160,0.2)" : "white" };
  padding: 6px 10px;
  margin-bottom: 10px;
`;
const TitleText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 2px;
`;
const UserContainer = styled.View`
  flex-direction: row;
  margin-bottom: 3px;
  align-items: center;
`;
const UserNameText = styled.Text`
  color: ${props=>props.theme.textColor};
`;
const TimeText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 13px;
  margin-bottom: 5px;
  margin-left: 2px;
`;
const PetLogInfoContainer = styled.View`
  flex-direction: row;
  margin-left: 6px;
`;
const TotalLikes = styled(UserNameText)`

`;
const TotalComments = styled(UserNameText)`

`;

type PetLogHeaderComponentType = {
  id: number;
  title: string;
  createdAt: string;
  user: {
    id: number,
    userName: string,
    avatar: string,
  };
  likes:number;
  commentNumber:number;
  isLiked:boolean;
};

const PetLogHeaderComponent = ({id,title,createdAt,user,likes,commentNumber,isLiked}:PetLogHeaderComponentType) => {

  const isDarkMode = useIsDarkMode();
  const navigation = useNavigation();
  const onPressProfile = () => navigation.navigate("Profile",{
    ...user,
  });
  const togglePetLogLike = useTogglePetLogLike(id);
  const onPressLike = () => togglePetLogLike();
  return (
    <Container isDarkMode={isDarkMode} >
      <TitleText>
        {title}
      </TitleText>
      <UserContainer>
        <TouchableOpacity onPress={onPressProfile}>
          <FastImage
            style={{
              width: 20,
              height: 20,
              borderRadius: 50,
              marginRight: 8,
            }}
            source={{
              uri : user.avatar ?? noUserUriVar()
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressProfile}>
          <UserNameText>
            {user.userName}
          </UserNameText>
        </TouchableOpacity>
      </UserContainer>
      <TimeText>
        {createdAt}
      </TimeText>
      <PetLogInfoContainer>
        <TouchableOpacity onPress={onPressLike}>
          <Ionicons name={isLiked?"heart":"heart-outline"} color={isLiked ? "tomato" : isDarkMode ? "white" : "black"} size={16}/> 
        </TouchableOpacity>
        <TotalLikes> {likes}</TotalLikes>
        <TotalComments>   {commentNumber} 개의 댓글</TotalComments>
      </PetLogInfoContainer>
    </Container>
  );
};

export default PetLogHeaderComponent;
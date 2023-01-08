import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { logoUriVar, noUserUriVar } from "../../apollo";
import getFormatTime from "../../logic/getFormatTime";
import { seeNewPetLogList_seeNewPetLogList_petLogs } from "../../__generated__/seeNewPetLogList";
import { Ionicons } from "@expo/vector-icons";
import useIsDarkMode from "../../hooks/useIsDarkMode";

const Container = styled.View`
  margin-left: 10px;
  margin-right: 10px;
  padding-top: 10px;
  padding-bottom: 7px;
  border-bottom-color: grey;
  border-bottom-width: 1px;
`;
const MarginHorizontalContainer = styled.TouchableOpacity`
  flex-direction: row;
`;
const LeftContainer = styled.View`

`;
const RightContainer = styled.View`
  flex: 1;
`;
const TitleText = styled.Text`
  font-weight: bold;
  color: ${props=>props.theme.textColor};
  margin-bottom: 3px;
  margin-left: 3px;
`;
const UserContainer = styled.View`
  flex-direction: row;
  /* center 가 더 안맞는거 같네 */
  /* align-items: center; */
  /* margin-bottom: 1px; */
`;
const UserNameText = styled.Text`
  color: ${props=>props.theme.textColor};
  margin-bottom: 3px;
  margin-left: 3px;
  font-size: 12px;
`;
const TimeText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 12px;
`;
const PopularityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 1px;
`;
const NumberText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 13px;
  margin-left: 2px;
  margin-right: 5px;
`;

const PetLogSummary = ({id,thumbNail,title,createdAt,user,likes,commentNumber}:seeNewPetLogList_seeNewPetLogList_petLogs) => {

  const navigation = useNavigation();

  const formatTime = getFormatTime(createdAt);

  const onPressSinglePetLog = () => {
    navigation.navigate("PetLog",{
      id,
      title,
      createdAt:formatTime,
      user,
      // likes,
      // commentNumber
    });
  };
  
  const isDarkMode = useIsDarkMode();

  return (
    <Container>
      <MarginHorizontalContainer onPress={onPressSinglePetLog}>
        <LeftContainer>
          <FastImage
            style={{
              width: 60,
              height: 60,
              marginRight: 10,
            }}
            source={{
              uri : thumbNail ?? logoUriVar()
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </LeftContainer>
        <RightContainer>
          <TitleText ellipsizeMode='tail' numberOfLines={1}>
            {title}
          </TitleText>
          <UserContainer>
            <FastImage
              style={{
                width: 15,
                height: 15,
                borderRadius: 20,
                marginRight: 5,
              }}
              source={
                {uri : user.avatar ?? noUserUriVar()}
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            <UserNameText>
              {user.userName}
            </UserNameText>
          </UserContainer>
          <PopularityContainer>
            <Ionicons name="heart" color="tomato" size={13}/>
            <NumberText>{likes}</NumberText>
            <Ionicons name="chatbubble-outline" color={isDarkMode ? "white" : "black"} size={13}/>
            <NumberText>{commentNumber}</NumberText>
          </PopularityContainer>
          <TimeText>
            {formatTime}
          </TimeText>
        </RightContainer>
      </MarginHorizontalContainer>
    </Container>
  );
};

export default PetLogSummary;
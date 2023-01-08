import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { getMePetLogs_getMePetLogs_petLogs } from "../../../../../__generated__/getMePetLogs";
import getFormatTime from "../../../../../logic/getFormatTime";
import { logoUriVar } from "../../../../../apollo";
import { MeStackProps } from "../../../../type";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Me } from "../../../../../__generated__/me";
import { seeProfile_seeProfile_user } from "../../../../../__generated__/seeProfile";

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
const TimeText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 12px;
`;
const PopularityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;
const NumberText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 13px;
  margin-left: 2px;
  margin-right: 5px;
`;

type NavigateProps = NativeStackScreenProps<MeStackProps,"Me">

type SinglePetLogProps = getMePetLogs_getMePetLogs_petLogs & {
  navigation: NavigateProps["navigation"],
  isDarkMode: boolean
  meData?: Me
  user?: seeProfile_seeProfile_user
};

const SinglePetLog = (item:SinglePetLogProps) => {
  
  // const navigation = useNavigation<NavigateProps["navigation"]>();
  // const isDarkMode = useIsDarkMode();
  const navigation = item.navigation;
  const isDarkMode = item.isDarkMode;

  const thumbNail = item.thumbNail;
  const title = item.title;
  const formatTime = getFormatTime(item.createdAt);
  const likes = item.likes;
  const commentNumber = item.commentNumber;
  const {meData,user,...rest} = item;

  const sendingUser = user ?? meData;
  
  return (
    <Container>
      <MarginHorizontalContainer
        onPress={()=>navigation.navigate("PetLog",{user:sendingUser, ...rest})}
      >
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

export default SinglePetLog;
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { seeNewPostFeed_seeNewPostFeed_user } from "../../__generated__/seeNewPostFeed";
import { FeedStackProps } from "../type";

const CaptionUserNamePressable = styled.TouchableOpacity`
  top: 3px;
`;
const UserNameText = styled.Text<{cssTopIfNeed?:number}>`
  color: ${props=>props.theme.textColor};
  right: 16px;
  font-weight: bold;
  top: ${props=>props.cssTopIfNeed ? `${props.cssTopIfNeed}px` : "0px"};
`;

type CaptionUserNameProps = {
  user: seeNewPostFeed_seeNewPostFeed_user;
  cssTopIfNeed?: number,
};

const CaptionUserName = ({user,cssTopIfNeed}:CaptionUserNameProps) => {

  const navigation = useNavigation<NativeStackNavigationProp<FeedStackProps, "Photo">>();

  const onPressUserName = () => navigation.navigate("Profile",{id:user.id,userName:user.userName});

  return (
    <CaptionUserNamePressable onPress={onPressUserName} >
      <UserNameText cssTopIfNeed={cssTopIfNeed}>{user.userName}</UserNameText>
    </CaptionUserNamePressable>
  )
};

export default CaptionUserName;
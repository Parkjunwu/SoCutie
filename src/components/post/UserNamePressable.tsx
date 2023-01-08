import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import styled, { css } from "styled-components/native";
import { seeNewPostFeed_seeNewPostFeed_user } from "../../__generated__/seeNewPostFeed";
import { FeedStackProps } from "../type";

const CaptionUserName = styled.Text<{fontSize?:number}>`
  color: ${props=>props.theme.textColor};
  font-weight: bold;
  ${({fontSize}) => fontSize && css`
      font-size: ${fontSize}px;
    `
  }
`;
  // 걍 ios 도 bold 가 나은듯
  // ${({isAndroidForFontWeight}) => css`
  //     font-weight: ${isAndroidForFontWeight ? "bold" : 600 };
  //   `
  // }

type UserNamePressableProps = {
  user: seeNewPostFeed_seeNewPostFeed_user;
  fontSize?: number;
};

const UserNamePressable = ({user,fontSize}:UserNamePressableProps) => {

  const navigation = useNavigation<NativeStackNavigationProp<FeedStackProps, "Photo">>();

  const goToProfile = () => navigation.navigate("Profile",{id:user.id,userName:user.userName});

  return (
    <TouchableOpacity onPress={goToProfile}>
      <CaptionUserName fontSize={fontSize} >{user.userName}</CaptionUserName>
    </TouchableOpacity>
  );
};

export default UserNamePressable;
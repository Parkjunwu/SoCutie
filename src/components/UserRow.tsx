import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../color";
import { seePhotoLikes_seePhotoLikes } from "../__generated__/seePhotoLikes";
import { FeedStackProps } from "./type";

const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 17px;
`;
const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
`;
const FollowOrUnFollowBtn = styled.TouchableOpacity`
  background-color: ${colors.blue};
  justify-content: center;
  padding: 5px 10px;
  border-radius: 5px;
`;
const FollowOrUnFollowText = styled.Text`
  color:white;
  font-weight: 600;
`;

const UserRow: React.FC<seePhotoLikes_seePhotoLikes> = ({avatar,userName,isFollowing,isMe,id}) => {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackProps,"Likes">>();
  return <Wrapper>
    <Column onPress={()=>navigation.navigate("Profile",{id,userName})}>
      {/* {avatar && <Avatar source={{uri:avatar}}/>} */}
      <Avatar source={{uri:avatar?avatar:"https://images.khan.co.kr/article/2021/12/14/l_2021121402000768000153081.webp"}} />
      <Username>{userName}</Username>
    </Column>
    {!isMe && <FollowOrUnFollowBtn>
      <FollowOrUnFollowText>{isFollowing?"UnFollow":"Follow"}</FollowOrUnFollowText>
    </FollowOrUnFollowBtn>}
  </Wrapper>;
}
export default UserRow;
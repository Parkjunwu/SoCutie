import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import styled from "styled-components/native";
import { FeedStackProps } from "../../type";
import FastImage from 'react-native-fast-image'
import image from "../../../image";
import { noUserUriVar } from "../../../apollo";


const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const Username = styled.Text`
  color: ${props=>props.theme.textColor};
  font-weight: 600;
  font-size: 17px;
`;
const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
`;

interface Props {
  id: number;
  userName: string;
  avatar: string;
}

const UserRow= ({avatar,userName,id}:Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackProps,"PostLikes">>();

  return <Wrapper>
    <Column onPress={()=>navigation.navigate("Profile",{id,userName})}>
      <FastImage
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          marginRight: 10,
        }}
        // source={avatar?{uri:avatar}:require("../../../../assets/no_user.png")}
        // source={ avatar ? { uri: avatar } : image.no_user }
        source={{ uri: avatar ? avatar : noUserUriVar() }}
      />
      <Username>{userName}</Username>
    </Column>
  </Wrapper>;
}
export default UserRow;
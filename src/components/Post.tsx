import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import styled from "styled-components/native";
import { seeFeed_seeFeed_user } from "../__generated__/seeFeed";
import { FeedStackProps } from "./type";
import { Ionicons } from "@expo/vector-icons";
import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";

import PhotoSwiper from "./PhotoSwiper";
import { togglePostLike, togglePostLikeVariables } from "../__generated__/togglePostLike";

const Container = styled.View`

`;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;
const Username = styled.Text`
  color: ${props=>props.theme.textColor};
  font-weight: 600;
`;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 8px;
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  color: ${props=>props.theme.textColor};
  margin-left: 5px;
`;
const Likes = styled.Text`
  color: ${props=>props.theme.textColor};
  margin: 7px 0px;
  font-weight: 600;
`;
const ExtraContainer = styled.View`
  padding: 10px;
`;

const TOGGLE_POST_LIKE_MUTATION = gql`
  mutation togglePostLike ($id:Int!) {
    togglePostLike (id:$id){
      ok
      error
    }
  }
`;

interface IPhotoProps {
  id: number;
  user: seeFeed_seeFeed_user;
  file: string[];
  caption: string | null;
  likes: number;
  isLiked: boolean;
}

// React.FC<seeFeed_seeFeed | undefined>
const Post: React.FC<IPhotoProps> = ({id,user,caption,file,isLiked,likes}) => {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackProps, "Photo">>()

  const updatetogglePostLike: MutationUpdaterFunction<togglePostLike,togglePostLikeVariables, DefaultContext, ApolloCache<any>>= (cache,result) => {
    const ok = result.data?.togglePostLike?.ok;
    if(ok) {
      const postId = `Post:${id}`;
      cache.modify({
        id:postId,
        fields:{
          isLiked(prev) {
            return !prev
          },
          likes(prev) {
            return isLiked ? prev-1 : prev+1
          }
        }
      })
    }
  }

  const [togglePostLikeMutation] = useMutation<togglePostLike,togglePostLikeVariables>(TOGGLE_POST_LIKE_MUTATION,{
    variables:{
      id
    },
    update:updatetogglePostLike
  });
  const updatetogglePostLikes = () => {
    togglePostLikeMutation();
  }
  const goToProfile = () => navigation.navigate("Profile",{id:user.id,userName:user.userName})

  const darkModeSubscription = useColorScheme();
  return (
    <Container>
      <Header onPress={goToProfile}>
        {user.avatar && <UserAvatar source={{uri:user.avatar}} resizeMode="cover"/>}
        <Username>{user.userName}</Username>
      </Header>
      
      <PhotoSwiper fileUriArr={file}/>

      <ExtraContainer>
        <Actions>
          <Action onPress={updatetogglePostLikes}>
            <Ionicons name={isLiked?"heart":"heart-outline"} color={isLiked?"tomato":darkModeSubscription === "light" ? "black" : "white"} size={22}/>
          </Action>
          <Action onPress={() => navigation.navigate("Comments",{postId:id})}>
            <Ionicons name="chatbubble-outline" color={darkModeSubscription === "light" ? "black" : "white"} size={20}/>
          </Action>
        </Actions>
        <TouchableOpacity onPress={() => navigation.navigate("PostLikes",{postId:id})}>
          <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        </TouchableOpacity>
        <Caption>
          <TouchableOpacity onPress={goToProfile}><Username>{user.userName}{file && "a"}</Username></TouchableOpacity>
          <CaptionText>{caption}</CaptionText>
        </Caption>
      </ExtraContainer>
    </Container>
  ); 
}
export default Post;
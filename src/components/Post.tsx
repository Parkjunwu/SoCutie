import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { seeFeed_seeFeed, seeFeed_seeFeed_user } from "../__generated__/seeFeed";
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
  color: white;
  font-weight: 600;
`;
type ImageProp = {
  width:number;
  height:number;
}
const File = styled.Image<ImageProp>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
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
  color: white;
  margin-left: 5px;
`;
const Likes = styled.Text`
  color: white;
  margin: 7px 0px;
  font-weight: 600;
`;
// const PhotoContainer = styled.View`
//   position: relative;
// `;
// const PhotoBtn = styled.TouchableOpacity`
//   position: absolute;
//   z-index: 1;
//   top: 47%;
//   font-size: 70px;
//   font-weight: 900;
//   color: white;
//   /* cursor: pointer;
//   :hover {
//     opacity: 1;
//   } */
//   opacity: 0.5;
// `;
// const NextPhotoBtn = styled(PhotoBtn)`
//   right: 10px;
// `;
// const PrevPhotoBtn = styled(PhotoBtn)`
//   left: 10px;
// `;
// const Photo = styled.Image`
//   /* width: 100%;
//   height: auto; */
//   /* object-fit:cover; */
//   /* border-bottom: 1px solid; */
//   /* border-color: grey; */
//   /* position: absolute; */
// `;
const PhotoIndexContainer = styled.View`
  margin-top: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;
// const PhotoIndex = styled.TouchableOpacity<{isFocused:boolean}>`
const PhotoIndex = styled.TouchableOpacity`
  /* font-size: 10px; */
  /* color: grey; */
  /* cursor: pointer; */
`;
const PhotoIndexText = styled.Text`
  font-size: 30px;
  color: grey;
  /* cursor: pointer; */
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
  const {width:getWidth} = useWindowDimensions();
  const [height,setHeight] = useState(getWidth)
  useEffect(()=>{
    Image.getSize(file[0],(width,height)=>setHeight(getWidth*height/width),(error)=>console.error(error))
  },[file])
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

  // const [photoIndex,setPhotoIndex] = useState(0);
  // const totalPhotoNumber = file.length;

  // const photoIndexArray = [];
  // for(let i=0;i<totalPhotoNumber;i++){
  //   photoIndexArray.push(i)
  // }
  // console.log(photoIndexArray)
  // const onPrevPhotoBtnClick = () => setPhotoIndex(prev=>prev-1);
  // const onNextPhotoBtnClick = () => setPhotoIndex(prev=>prev+1);
  // const onPhotoIndexClick = (index:number) => setPhotoIndex(index);

  return <Container>
    <Header onPress={goToProfile}>
      {user.avatar && <UserAvatar source={{uri:user.avatar}} resizeMode="cover"/>}
      <Username>{user.userName}</Username>
    </Header>

    
    <PhotoSwiper fileUriArr={file}/>


    <ExtraContainer>
      <Actions>
        <Action onPress={updatetogglePostLikes}>
          <Ionicons name={isLiked?"heart":"heart-outline"} color={isLiked?"tomato":"white"} size={22}/>
        </Action>
        <Action onPress={() => navigation.navigate("Comments",{postId:id})}>
          <Ionicons name="chatbubble-outline" color="white" size={20}/>
        </Action>
      </Actions>


      <TouchableOpacity onPress={() => navigation.navigate("Likes",{postId:id})}>
        <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
      </TouchableOpacity>


      <Caption>
        <TouchableOpacity onPress={goToProfile}><Username>{user.userName}{file && "a"}</Username></TouchableOpacity>
        <CaptionText>{caption}</CaptionText>
      </Caption>
    </ExtraContainer>
  </Container>; 
}
export default Post;
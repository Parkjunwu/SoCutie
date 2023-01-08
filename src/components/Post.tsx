import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, Platform, TouchableOpacity, useColorScheme } from "react-native";
import styled from "styled-components/native";
import { FeedStackProps } from "./type";
import { Ionicons } from "@expo/vector-icons";
import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import PhotoSwiper from "./post/PhotoSwiper";
import { togglePostLike, togglePostLikeVariables } from "../__generated__/togglePostLike";
import CaptionComponent from "./post/CaptionComponent";
import { isLoggedInVar, noUserUriVar } from "../apollo";
import FastImage from 'react-native-fast-image'
import PostDropdown from "./post/PostDropdown";
import { seeNewPostFeed_seeNewPostFeed_user } from "../__generated__/seeNewPostFeed";
import UserNamePressable from "./post/UserNamePressable";


const Container = styled.View`
`;
const Header = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const HeaderRightContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 8px;
`;
const LikeContainer = styled.View`
  flex-direction: row;
`;
const Likes = styled.Text<{isAndroid:boolean}>`
  color: ${props=>props.theme.textColor};
  margin: 7px 0px;
  /* margin-top: 7px; */
  font-weight: ${props=>props.isAndroid ? 'bold' : 600};
`;
// const TimeContainer = styled.View`

// `;
// const TimeText = styled.Text`
//   color: ${props=>props.theme.textColor};
//   margin: 4px 0px 3px 3px;
//   font-size: 12px;
// `;
const ExtraContainer = styled.View`
  padding: 10px;
`;

const BestCommentContainerTouchable = styled.TouchableOpacity`
  padding-left: 14px;
  padding-top: 2px;
`;
const BestCommentText = styled.Text`
  width: 96%;
  /* flex-wrap: wrap;
  flex-direction: row; */
`;
const UserName = styled.Text<{isAndroid:boolean}>`
  color: ${props=>props.theme.textColor};
  font-weight: ${props=>props.isAndroid ? 'bold' : 600};
`;
const PayLoad = styled.Text`
  color: ${props=>props.theme.textColor};
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
  user: seeNewPostFeed_seeNewPostFeed_user;
  file: string[];
  caption: string | null;
  likes: number;
  isLiked: boolean;
  isMine: boolean;
  videoPlayingPost?: number | null;
  onPressVideo?: Function | null;
  isFeed: boolean;
  createdAt: string;
  bestComment?: {
    id: number;
    payload: string;
    user: {
      id: number,
      userName: string,
      avatar: string,
    }
  };
}

const Post: React.FC<IPhotoProps> = ({id,user,caption,file,isLiked,likes,isMine,videoPlayingPost,onPressVideo,isFeed,createdAt,bestComment}) => {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackProps, "Photo">>()

  const updateTogglePostLike: MutationUpdaterFunction<togglePostLike,togglePostLikeVariables, DefaultContext, ApolloCache<any>>= (cache,result) => {
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
    update:updateTogglePostLike
  });

  // 로그인 여부 확인
  const isLoggedIn = isLoggedInVar();

  const updateTogglePostLikes = () => {
    if(!isLoggedIn) {
      return Alert.alert("로그인 후 이용 가능합니다.",null,[{text:"확인"}])
    }
    togglePostLikeMutation();
  };

  const goToProfile = () => navigation.navigate("Profile",{id:user.id,userName:user.userName});

  const goToComment = () => navigation.navigate("Comments",{postId:id});

  // const passedTime = getPassedTime(createdAt);

  const darkModeSubscription = useColorScheme();
  const isAndroid = Platform.OS === "android";
  
  return (
    <Container>
      <Header>
        <HeaderRightContainer>
          <TouchableOpacity onPress={goToProfile}>
            <FastImage
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginRight: 10,
              }}
              source={{
                uri : user.avatar ? user.avatar : noUserUriVar()
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <UserNamePressable user={user} fontSize={16} />
        </HeaderRightContainer>
        <PostDropdown postId={id} isMine={isMine} file={file} caption={caption} />
      </Header>
      
      <PhotoSwiper fileUriArr={file} isVideoPlayingPost={videoPlayingPost === id} onPressVideo={onPressVideo} isFeed={isFeed} />

      <ExtraContainer>
        
        <Actions>
          <Action onPress={updateTogglePostLikes}>
            <Ionicons name={isLiked?"heart":"heart-outline"} color={isLiked?"tomato":darkModeSubscription === "light" ? "black" : "white"} size={22}/>
          </Action>
          <Action onPress={goToComment}>
            <Ionicons name="chatbubble-outline" color={darkModeSubscription === "light" ? "black" : "white"} size={20}/>
          </Action>
        </Actions>

        <LikeContainer>
          <TouchableOpacity onPress={() => navigation.navigate("PostLikes",{postId:id})}>
            <Likes isAndroid={isAndroid} >{`${likes} 개의 좋아요`}</Likes>
          </TouchableOpacity>
        </LikeContainer>

        {/* <TimeContainer>
          <TimeText>{passedTime}</TimeText>
        </TimeContainer> */}

        <CaptionComponent user={user} caption={caption} postId={id} />
        
        {bestComment && <BestCommentContainerTouchable onPress={goToComment}>
          <BestCommentText
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            <UserName isAndroid={isAndroid}>{bestComment.user.userName}    </UserName>
            <PayLoad>{bestComment.payload}</PayLoad>
          </BestCommentText>
        </BestCommentContainerTouchable>}

      </ExtraContainer>
    </Container>
  ); 
}
export default Post;
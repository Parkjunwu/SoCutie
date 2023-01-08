import { gql, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ListRenderItem, TouchableOpacity, useWindowDimensions } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import cursorPaginationFetchMore from "../../logic/cursorPaginationFetchMore";
import { getUserPosts, getUserPostsVariables, getUserPosts_getUserPosts_posts } from "../../__generated__/getUserPosts";
import { FeedStackProps } from "../type";
import VideoIconPositionAbsolute from "../video/VideoIconPositionAbsolute";

const GET_USER_POSTS = gql`
  query getUserPosts($userId:Int!,$cursorId:Int) {
    getUserPosts(userId:$userId,cursorId:$cursorId) {
      cursorId
      hasNextPage
      posts {
        id
        # file
        isFirstVideo
        firstPhoto
      }
      error
    }
  }
`;


type NavigateProps = NativeStackScreenProps<FeedStackProps, 'Profile'>;

const PostContainer = styled.FlatList`
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
  /* background-color: tomato; */
`;

const PostFlatList = ({userId}) => {


  // Post 들 역시 가져옴
  const [getUserPosts,{data:userPostData,refetch,fetchMore}] = useLazyQuery<getUserPosts,getUserPostsVariables>(GET_USER_POSTS,{
    variables:{
      userId
    },
  });

  // 처음 들어오면 refetch
  useEffect(()=>{
    refetch();
  },[]);

  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:userPostData.getUserPosts.cursorId,
      },
    });
  };

  const onEndReached = async() => {
    await cursorPaginationFetchMore(userPostData?.getUserPosts,fetchMoreFn);
  };

  const navigation = useNavigation<NavigateProps["navigation"]>();

  const renderItem:ListRenderItem<getUserPosts_getUserPosts_posts> = ({item}) => (
    <TouchableOpacity style={{position:"relative"}} onPress={()=>navigation.navigate("Photo",{photoId:item.id})}>
      <FastImage
        style={{ width:imageWidth, height:imageWidth }}
        // source={{ uri:item.file[0] }}
        source={{ uri:item.firstPhoto }}
      />
      {item.isFirstVideo && <VideoIconPositionAbsolute iconSize={17} top="5%" left="5%" />}
    </TouchableOpacity>
  );

  // 화면 한 줄에 보여줄 사진 갯수
  const numColumns = 3;
  // 유저 화면 넓이
  const {width} = useWindowDimensions();
  // 각각의 사진 높이/넓이
  const imageWidth = width/numColumns;

  return (
    <PostContainer
      data={userPostData?.getUserPosts.posts}
      renderItem={renderItem}
      keyExtractor={(item:getUserPosts_getUserPosts_posts)=>item.id + ""}
      numColumns={numColumns}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

export default PostFlatList;
import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { RefreshControl } from "react-native";
import styled from "styled-components/native";
import Post from "../../../../components/Post";
import NoPostView from "../../../../components/post/NoPostView";
import ScreenLayout from "../../../../components/ScreenLayout";
import { SearchStackProps } from "../../../../components/type";
import { seePost, seePostVariables } from "../../../../__generated__/seePost";

const Container = styled.ScrollView``;

const SEE_POST = gql`
  query seePost($id: Int!){
    seePost(id: $id) {
      id
      user {
        id
        userName
        avatar
      }
      file
      caption
      createdAt
      likes
      commentNumber
      isMine
      isLiked
      bestComment {
        id
        payload
        user {
          # id
          userName
          # avatar
        }
      }
    }
  }

`;

type Props = NativeStackScreenProps<SearchStackProps, 'Photo'>;

const PhotoScreen = ({navigation,route}:Props) => {

  const {data,loading,refetch} = useQuery<seePost,seePostVariables>(SEE_POST,{
    variables:{
      id:route?.params?.photoId,
    },
  });

  const [refreshing,onRefreshing] = useState(false);

  const onRefresh = async() => {
    onRefreshing(true);
    await refetch();
    onRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <Container
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        }
      >
        {data?.seePost && <Post {...data.seePost}/>}
        {(data && data.seePost === null) && <NoPostView/> }
      </Container>
    </ScreenLayout>
  );
}
export default PhotoScreen;
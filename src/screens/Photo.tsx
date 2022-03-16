import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { RefreshControl } from "react-native";
import styled from "styled-components/native";
import Photo from "../components/Post";
import ScreenLayout from "../components/ScreenLayout";
import { SearchStackProps } from "../components/type";
import { seePost, seePostVariables } from "../__generated__/seePost";

const Container = styled.ScrollView`
  /* background-color: black; */
`;

const SEE_PHOTO = gql`
  query seePost($id: Int!){
    seePost(id: $id) {
      id
      user {
        id
        userName
        avatar
      }
      hashTags{
        id
        name
      }
      file
      caption
      createdAt
      likes
      commentNumber
      isMine
      isLiked
    }
  }

`;

type Props = NativeStackScreenProps<SearchStackProps, 'Photo'>;

const PhotoScreen = ({navigation,route}:Props) => {
  const {data,loading,refetch} = useQuery<seePost,seePostVariables>(SEE_PHOTO,{
    variables:{
      id:route?.params?.photoId
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
        // contentContainerStyle={{
        //   alignItems: "center",
        //   justifyContent: "center",
        // }}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        }
      >
        {data?.seePost && <Photo {...data.seePost}/>}
      </Container>
    </ScreenLayout>
  );
}
export default PhotoScreen;
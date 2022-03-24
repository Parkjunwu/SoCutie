import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem } from "react-native";
import { FeedStackProps } from "../../../components/type";
import { seeFeed, seeFeedVariables, seeFeed_seeFeed } from "../../../__generated__/seeFeed";
import Post from "../../../components/Post";
import ScreenLayout from "../../../components/ScreenLayout";
import WhenOpenFeedThenGetNumberOfUnreadMessageAndSetHeaderMessage from "../../../components/feed/WhenOpenFeedThenGetNumberOfUnreadMessage";

type Props = NativeStackScreenProps<FeedStackProps, 'Feed'>;

const SEE_FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset){
      id
      user{
        id
        userName
        avatar
      }
      file
      caption
      createdAt
      likes
      comments{
        id
        user{
          id
          userName
          avatar
        }
        payload
        isMine
        createdAt
      }
      commentNumber
      isMine
      isLiked
    }
  }
`;
const Feed = ({navigation}:Props) => {
  // Feed 들어올 때 안읽은 메세지 갯수 받고 헤더 오른쪽에 메세지 버튼 생성함.
  WhenOpenFeedThenGetNumberOfUnreadMessageAndSetHeaderMessage();

  const {data,loading,error,refetch,fetchMore} = useQuery<seeFeed,seeFeedVariables>(SEE_FEED_QUERY,{
    variables:{
      offset:0
    },
  });

  const renderPost: ListRenderItem<seeFeed_seeFeed | null> | null = ({item:post}) => {
    if(post) return <Post {...post}/>;
    return null;
  }

  const onEndReached = async() => {
    console.log("seeFeed fetchMore")
    await fetchMore({
      variables:{
        offset:data?.seeFeed?.length
      }
    })
  };
  
  const [refreshing,setRefreshing] = useState(false);

  // 처음 들어오면 refetch ?
  useEffect(()=>{
    refetch();
  },[])

  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    
    <ScreenLayout loading={loading}>
      {data?.seeFeed && <FlatList
        data={data.seeFeed}
        renderItem={renderPost}
        keyExtractor={(item)=>item?.id + ""}
        style={{width:"100%"}}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />}
    </ScreenLayout>
  );
}
export default Feed;
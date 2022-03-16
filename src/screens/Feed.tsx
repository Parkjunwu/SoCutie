import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem, TouchableOpacity } from "react-native";
import Post from "../components/Post";
import ScreenLayout from "../components/ScreenLayout";
import { FeedStackProps } from "../components/type";
import { seeFeed, seeFeedVariables, seeFeed_seeFeed } from "../__generated__/seeFeed";
import {Ionicons} from "@expo/vector-icons"

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
  const MessageBtn = ({tintColor}:{tintColor?:string| undefined}) => <TouchableOpacity style={{marginRight:10,marginTop:1}} onPress={()=>navigation.navigate("Messages")}>
        <Ionicons name="paper-plane" size={25} color={tintColor} />
      </TouchableOpacity>
  useEffect(()=>{
    navigation.setOptions({
      headerRight:MessageBtn
    })
  },[])
  // const [offset,setOffset] = useState(0);
  // const [renderData,setRenderData] = useState<(seeFeed_seeFeed | null)[]>([])
  // const onCompleted = (data: seeFeed) => {
  //   const newThing = data.seeFeed
  //   if(newThing) setRenderData((prev) => [...prev,...newThing])
  // }
  const {data,loading,error,refetch,fetchMore} = useQuery<seeFeed,seeFeedVariables>(SEE_FEED_QUERY,{
    variables:{
      offset:0
    },
    // onCompleted
  });
  // console.log(error);
  // console.log(data);
  const renderPost: ListRenderItem<seeFeed_seeFeed | null> | null = ({item:post}) => {
    if(post) return <Post {...post}/>;
    return null;
  }
  const onEndReached = async() => {
    // setOffset(prev=>prev+2);
    await fetchMore({
      variables:{
        offset:data?.seeFeed?.length
      }
    })
  }
  const [refreshing,setRefreshing] = useState(false);

  // 처음 들어오면 refetch ?
  useEffect(()=>{
    console.log("refetch")
    refetch();
  },[])

  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return <ScreenLayout loading={loading}>
    
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
  </ScreenLayout>;
}
export default Feed;
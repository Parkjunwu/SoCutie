import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem } from "react-native";
import styled from "styled-components/native";
import Post from "../../../../components/Post";
import ScreenLayout from "../../../../components/ScreenLayout";
import { FeedStackProps } from "../../../../components/type";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";
import { seeHashTag, seeHashTagVariables, seeHashTag_seeHashTag_posts } from "../../../../__generated__/seeHashTag";

type Props = NativeStackScreenProps<FeedStackProps, 'HashTag'>;

const SEE_HASHTAG = gql`
  query seeHashTag( $name:String!, $cursorId:Int ){
    seeHashTag( name:$name, cursorId:$cursorId ) {
      cursorId
      hasNextPage
      posts {
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
        commentNumber
        isMine
        isLiked
      }
      error
    }
  }
`;

const GET_NUMBER_OF_POST_ON_HASHTAG = gql`
  query getNumberOfPostOnHashTag($name:String!) {
    getNumberOfPostOnHashTag(name:$name)
  }
`;

const NoDataView = styled.View`
  margin-top:100px;
  align-items: center;
  /* background-color:blue; */
`;
const NoDataText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 19px;
  font-weight:700;
`;
const NumberOfPostingView = styled.View`

`;
const NumberOfPostingText = styled.Text`
  color: ${props=>props.theme.textColor};
  padding: 15px 0px 10px 30px;
  font-size: 15px;
`;

const HashTag = ({navigation,route}:Props) => {
  const name = route.params.name;

  useEffect(()=>{
    navigation.setOptions({
      title:`#${name} 포스팅`,
    });
  },[]);
  
  // Likes 쿼리 받음
  const {data,error,loading,refetch,fetchMore} = useQuery<seeHashTag,seeHashTagVariables>(SEE_HASHTAG,{
    variables: {
      name,
    },
  });
  // 들어올 때마다 다시 받음
  useEffect(()=>{
    console.log("re")
    refetch();
  },[]);


  const renderPost: ListRenderItem<seeHashTag_seeHashTag_posts | null> | null = ({item:post}) => {
    if(post) return <Post {...post}/>;
    return null;
  };

  const NoDataComponent = () => <NoDataView><NoDataText>해당 태그의 포스팅이 존재하지 않습니다.</NoDataText></NoDataView>;

  const {data:numberOfPost,refetch:numberOfPostRefetch} = useQuery(GET_NUMBER_OF_POST_ON_HASHTAG,{
    variables:{
      name
    }
  });

  useEffect(()=>{
    numberOfPostRefetch();
  },[]);

  const ListHeaderComponent = () => <NumberOfPostingView>
    <NumberOfPostingText># {numberOfPost?.getNumberOfPostOnHashTag} 개의 포스팅</NumberOfPostingText>
  </NumberOfPostingView>

  const [refreshing,setRefreshing] = useState(false);

  // 처음 들어오면 refetch
  useEffect(()=>{
    refetch();
  },[]);

  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.seeHashTag.cursorId,
      },
    });
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.seeHashTag,fetchMoreFn);
  };

  return (
    <ScreenLayout loading={loading}>
      {data?.seeHashTag && <FlatList
        data={data.seeHashTag.posts}
        renderItem={renderPost}
        keyExtractor={(item)=>item?.id + ""}
        style={{width:"100%"}}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={NoDataComponent}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />}
    </ScreenLayout>
  );
}
export default HashTag;
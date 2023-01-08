import { gql, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { forwardRef, useImperativeHandle } from "react";
import { FlatList, ListRenderItem, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import cursorPaginationFetchMore from "../../logic/cursorPaginationFetchMore";
import { searchPosts, searchPostsVariables, searchPosts_searchPosts_posts } from "../../__generated__/searchPosts";
import { InitialView, LoadingView, NoDataView } from "./CommonView";
import FastImage from 'react-native-fast-image'


const SEARCH_PHOTO_QUERY = gql`
  query searchPosts( $keyword: String!,$cursorId:Int ){
    searchPosts( keyword:$keyword, cursorId:$cursorId ){
      cursorId
      hasNextPage
      posts {
        id
        file
      }
      error
    }
  }
`;

const ImageContainer = styled.TouchableOpacity`
`;
// const Img = styled.Image`
//   width: ${props=>props.width}px;
//   height: ${props=>props.width}px;
// `;

const SearchPost = forwardRef((props, ref) => {

  const [searchPosts, {loading, data, called, fetchMore}] = useLazyQuery<searchPosts,searchPostsVariables>(SEARCH_PHOTO_QUERY,{
    fetchPolicy:"network-only"
  });

  // Search (부모) 에서 검색 (이벤트) 시 searchPosts (자식 함수) 를 호출하기 위함.
  useImperativeHandle(ref, () => ({
    searchPosts:async(keyword:string)=>{
      await searchPosts({
        variables:{
          keyword
        }
      });
    },
  }));

  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  const renderItem:ListRenderItem<searchPosts_searchPosts_posts|null >|null = ({item:photo}) => {
    if(photo?.file && photo.id) {
      return (
        <ImageContainer onPress={()=>navigation.navigate("Photo", {photoId: photo.id})}>
          {/* 첫번째 사진만 */}
          {/* <Img source={{uri:photo.file[0]}} width={width/3}/> */}
          <FastImage
            style={{ width: width/3, height: width/3 }}
            source={{ uri:photo.file[0] }}
          />
        </ImageContainer>
      )
    }
    return null;
  }

  // infinite scroll
  const fetchMoreFn = async() => {
    if(data?.searchPosts.hasNextPage) {
      await fetchMore({
        variables:{
          cursorId:data.searchPosts.cursorId,
        },
      });
    }
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.searchPosts,fetchMoreFn);
  };

  // 초기화면
  if(!called) {
    return <InitialView/>;
  }
  // 로딩중
  if(loading) {
    return <LoadingView/>;
  }

  const posts = data?.searchPosts.posts;
  
  if(posts !== null) {
    // 데이터 없을 때
    if(posts.length === 0) {
      return <NoDataView/>;
    // 포스팅 목록
    } else {
      return (
        <FlatList
          data={posts}
          keyExtractor={(item)=>item?.id + ""}
          renderItem={renderItem}
          numColumns={3}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />
      )
    }
  }
});

export default SearchPost;
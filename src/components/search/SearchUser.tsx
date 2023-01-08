import { gql, useLazyQuery } from "@apollo/client";
import React, { forwardRef, useImperativeHandle } from "react";
import { FlatList, ListRenderItem } from "react-native";
import cursorPaginationFetchMore from "../../logic/cursorPaginationFetchMore";
import { searchUsers, searchUsersVariables, searchUsers_searchUsers_users } from "../../__generated__/searchUsers";
import UserRow from "../userList/UserList/UserRow";
import { InitialView, LoadingView, NoDataView } from "./CommonView";

const SEARCH_USER_QUERY = gql`
  query searchUsers($keyword: String!,$cursorId: Int) {
    searchUsers(keyword: $keyword,cursorId: $cursorId) {
      cursorId
      hasNextPage
      users {
        id
        userName
        avatar
      }
      error
    }
  }
`;

const SearchUser = forwardRef((props, ref) => {

  const [searchUsers, {loading, data, called, fetchMore}] = useLazyQuery<searchUsers,searchUsersVariables>(SEARCH_USER_QUERY);

  // Search (부모) 에서 검색 (이벤트) 시 searchUsers (자식 함수) 를 호출하기 위함.
  useImperativeHandle(ref, () => ({
    searchUsers:async(keyword:string)=>{
      await searchUsers({
        variables:{
          keyword
        }
      });
    },
  }));

  const renderItem:ListRenderItem<searchUsers_searchUsers_users|null >|null = ({item:user}) => {
    return (
      <UserRow {...user}/>
    )
  }

  // infinite scroll
  const fetchMoreFn = async() => {
    if(data?.searchUsers.hasNextPage) {
      await fetchMore({
        variables:{
          cursorId:data.searchUsers.cursorId,
        },
      });
    }
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.searchUsers,fetchMoreFn);
  };


  // 초기화면
  if(!called) {
    return <InitialView/>;
  }
  // 로딩중
  if(loading) {
    return <LoadingView/>;
  }

  const users = data?.searchUsers.users;
  
  if(users !== null) {
    // 데이터 없을 때
    if(users.length === 0) {
      return <NoDataView/>;
    // 유저 목록
    } else {
      return (
        <FlatList
          data={users}
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

export default SearchUser;
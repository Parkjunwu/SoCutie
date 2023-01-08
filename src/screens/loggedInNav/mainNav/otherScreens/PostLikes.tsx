import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { isLoggedInVar } from "../../../../apollo";
import { FeedStackProps } from "../../../../components/type";
import UserList from "../../../../components/userList/UserList";
import UserListCanFollowUnfollow from "../../../../components/userList/UserListCanFollowUnfollow";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";
import { seePostLikes, seePostLikesVariables } from "../../../../__generated__/seePostLikes";

type Props = NativeStackScreenProps<FeedStackProps, 'PostLikes'>;

const SEE_POST_LIKES_QUERY = gql`
  query seePostLikes($id: Int!, $cursorId: Int){
    seePostLikes(id: $id, cursorId: $cursorId) {
      cursorId
      hasNextPage
      likeUsers {
        id
        userName
        avatar
        isFollowing
        isMe 
      }
      error
      isNotFetchMore
    }
  }
`;

const PostLikes = ({route}:Props) => {
  const postId = route.params.postId;
  // Likes 쿼리 받음
  const {data,loading,refetch,fetchMore,updateQuery} = useQuery<seePostLikes,seePostLikesVariables>(SEE_POST_LIKES_QUERY,{
    variables: {
      id:postId,
    },
    skip:!postId,
  });
  // 들어올 때마다 다시 받음
  useEffect(()=>{
    console.log("re")
    refetch();
  },[]);
  
  // refetch 를 이렇게 보내야 함. 안그러면 id 를 못받음.
  const doRefetch = () => {
    refetch();
  };

  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.seePostLikes.cursorId,
      },
    });
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.seePostLikes,fetchMoreFn);
  };

  const isLoggedIn = isLoggedInVar();
  if(!isLoggedIn) {
    return <UserList dataDotQuery={data?.seePostLikes} refetch={doRefetch} loading={loading} onEndReached={onEndReached}/>
  }
  
  return (
    <UserListCanFollowUnfollow dataDotQuery={data?.seePostLikes} refetch={doRefetch} loading={loading} onEndReached={onEndReached} updateQuery={updateQuery} />
  );
}
export default PostLikes;
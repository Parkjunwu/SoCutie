import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FeedStackProps } from "../../../../components/type";
import UserListCanFollowUnfollow from "../../../../components/userList/UserListCanFollowUnfollow";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";
import { seeCommentOfCommentLikes, seeCommentOfCommentLikesVariables } from "../../../../__generated__/seeCommentOfCommentLikes";

// 앱에서 얘랑 연결은 안함. 필요하면 연결

type Props = NativeStackScreenProps<FeedStackProps, 'CommentOfCommentLikes'>;

const SEE_COMMENT_OF_COMMENT_LIKES_QUERY = gql`
  query seeCommentOfCommentLikes($commentOfCommentId:Int!,$cursorId: Int){
    seeCommentOfCommentLikes(commentOfCommentId:$commentOfCommentId,cursorId:$cursorId) {
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
    }
  }
`;

const CommentOfCommentLikes = ({route}:Props) => {
  const commentOfCommentId = route.params.commentOfCommentId;
  // Likes 쿼리 받음
  const {data,error,loading,refetch,fetchMore,updateQuery} = useQuery<seeCommentOfCommentLikes,seeCommentOfCommentLikesVariables>(SEE_COMMENT_OF_COMMENT_LIKES_QUERY,{
    variables: {
      commentOfCommentId,
    },
    skip:!commentOfCommentId,
  });
  // 들어올 때마다 다시 받음
  useEffect(()=>{
    console.log("re")
    refetch();
  },[]);
  console.log(error);
  // refetch 를 이렇게 보내야 함. 안그러면 id 를 못받음.
  const doRefetch = () => {
    refetch();
  };

  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.seeCommentOfCommentLikes.cursorId,
      },
    });
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.seeCommentOfCommentLikes,fetchMoreFn);
  };

  return (
    <UserListCanFollowUnfollow dataDotQuery={data?.seeCommentOfCommentLikes} refetch={doRefetch} loading={loading} onEndReached={onEndReached} updateQuery={updateQuery} />
  );
}
export default CommentOfCommentLikes;
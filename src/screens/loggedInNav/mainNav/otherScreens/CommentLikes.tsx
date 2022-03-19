import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FeedStackProps } from "../../../../components/type";
import UserList from "../../../../components/userList/UserList";
import { seeCommentLikes, seeCommentLikesVariables } from "../../../../__generated__/seeCommentLikes";

type Props = NativeStackScreenProps<FeedStackProps, 'CommentLikes'>;

const SEE_COMMENT_LIKES_QUERY = gql`
  query seeCommentLikes($commentId:Int!,$cursorId: Int){
    seeCommentLikes(commentId:$commentId,cursorId:$cursorId) {
      id
      userName
      avatar
      isFollowing
      isMe  
    }
  }
`;

const CommentLikes = ({route}:Props) => {
  console.log(route?.params?.commentId);
  // Likes 쿼리 받음
  const {data,error,loading,refetch} = useQuery<seeCommentLikes,seeCommentLikesVariables>(SEE_COMMENT_LIKES_QUERY,{
    variables: {
      commentId:route?.params?.commentId,
    },
    skip:!route?.params?.commentId,
  });
  // 들어올 때마다 다시 받음
  useEffect(()=>{
    console.log("re")
    refetch();
  },[]);
  console.log(error);
  // refetch 를 이렇게 보내야 함. 안그러면 id 를 못받음.
  const doRefetch = () => {
    refetch({
      commentId:route.params.commentId
    });
  };
  return (
    <UserList dataDotQuery={data?.seeCommentLikes} refetch={doRefetch} loading={loading} />
  );
}
export default CommentLikes;
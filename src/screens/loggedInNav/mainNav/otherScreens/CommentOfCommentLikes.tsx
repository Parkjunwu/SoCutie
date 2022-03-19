import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FeedStackProps } from "../../../../components/type";
import UserList from "../../../../components/userList/UserList";
import { seeCommentOfCommentLikes, seeCommentOfCommentLikesVariables } from "../../../../__generated__/seeCommentOfCommentLikes";

type Props = NativeStackScreenProps<FeedStackProps, 'CommentOfCommentLikes'>;

const SEE_COMMENT_OF_COMMENT_LIKES_QUERY = gql`
  query seeCommentOfCommentLikes($commentOfCommentId:Int!,$cursorId: Int){
    seeCommentOfCommentLikes(commentOfCommentId:$commentOfCommentId,cursorId:$cursorId) {
      id
      userName
      avatar
      isFollowing
      isMe  
    }
  }
`;

const CommentOfCommentLikes = ({route}:Props) => {
  console.log(route?.params?.commentOfCommentId);
  // Likes 쿼리 받음
  const {data,error,loading,refetch} = useQuery<seeCommentOfCommentLikes,seeCommentOfCommentLikesVariables>(SEE_COMMENT_OF_COMMENT_LIKES_QUERY,{
    variables: {
      commentOfCommentId:route?.params?.commentOfCommentId,
    },
    skip:!route?.params?.commentOfCommentId,
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
      commentOfCommentId:route.params.commentOfCommentId
    });
  };
  return (
    <UserList dataDotQuery={data?.seeCommentOfCommentLikes} refetch={doRefetch} loading={loading} />
  );
}
export default CommentOfCommentLikes;
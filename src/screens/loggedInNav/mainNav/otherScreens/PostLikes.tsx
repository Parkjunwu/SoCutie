import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FeedStackProps } from "../../../../components/type";
import UserList from "../../../../components/userList/UserList";
import { seePostLikes, seePostLikesVariables } from "../../../../__generated__/seePostLikes";

type Props = NativeStackScreenProps<FeedStackProps, 'PostLikes'>;

const SEE_POST_LIKES_QUERY = gql`
  query seePostLikes($id: Int!,$cursorId: Int){
    seePostLikes(id: $id,cursorId:$cursorId) {
      id
      userName
      avatar
      isFollowing
      isMe  
    }
  }
`;

const PostLikes = ({route}:Props) => {
  console.log(route?.params?.postId);
  // Likes 쿼리 받음
  const {data,error,loading,refetch} = useQuery<seePostLikes,seePostLikesVariables>(SEE_POST_LIKES_QUERY,{
    variables: {
      id:route?.params?.postId,
    },
    skip:!route?.params?.postId,
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
      id:route.params.postId
    });
  };
  return (
    <UserList dataDotQuery={data?.seePostLikes} refetch={doRefetch} loading={loading} />
  );
}
export default PostLikes;
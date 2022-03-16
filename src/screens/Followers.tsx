import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FeedStackProps } from "../components/type";
import UserList from "../components/userList/UserList";
import { seeFollowers, seeFollowersVariables } from "../__generated__/seeFollowers";

type Props = NativeStackScreenProps<FeedStackProps, 'Followers'>;

const SEE_FOLLOWERS = gql`
  query seeFollowers($id: Int!, $lastId: Int){
    seeFollowers(id: $id, lastId: $lastId) {
      ok
      error
      followers{
        id
        userName
        avatar
      }
      lastId
    }
  }
`;

const Followers = ({route}:Props) => {
  console.log(route?.params?.userId);
  // Followers 쿼리 받음
  const {data,error,loading,refetch} = useQuery<seeFollowers,seeFollowersVariables>(SEE_FOLLOWERS,{
    variables: {
      id:route?.params?.userId,
    },
    skip:!route?.params?.userId,
  });
  // 들어올 때마다 다시 받음
  useEffect(()=>{
    console.log("re")
    refetch();
  },[]);
  // console.log(data?.seePostLikes);
  console.log(error);
  // refetch 를 이렇게 보내야 함. 안그러면 id 를 못받음.
  const doRefetch = () => {
    refetch({
      id:route.params.userId
    });
  };
  return (
    <UserList dataDotQuery={data?.seeFollowers?.followers} refetch={doRefetch} loading={loading} />
  );
}
export default Followers;
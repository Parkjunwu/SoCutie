import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FeedStackProps } from "../../../../components/type";
import UserList from "../../../../components/userList/UserList";
import { seeFollowing, seeFollowingVariables } from "../../../../__generated__/seeFollowing";

type Props = NativeStackScreenProps<FeedStackProps, 'Following'>;

const SEE_FOLLOWING = gql`
  query seeFollowing($id: Int!, $lastId: Int){
    seeFollowing(id: $id, lastId: $lastId) {
      ok
      error
      following{
        id
        userName
        avatar
      }
      lastId
    }
  }
`;

const Following = ({route}:Props) => {
  console.log(route?.params?.userId);
  // Following 쿼리 받음
  const {data,error,loading,refetch} = useQuery<seeFollowing,seeFollowingVariables>(SEE_FOLLOWING,{
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
  // refetch 를 이렇게 보내야 함. 안그러면 id 를 못받음.
  const doRefetch = () => {
    refetch({
      id:route.params.userId
    });
  };
  console.log(error);
  return (
    <UserList dataDotQuery={data?.seeFollowing?.following} refetch={doRefetch} loading={loading} />
  );
}
export default Following;
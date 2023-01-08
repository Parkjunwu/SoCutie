import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { isLoggedInVar } from "../../../../apollo";
import { FeedStackProps } from "../../../../components/type";
import UserList from "../../../../components/userList/UserList";
import UserListCanFollowUnfollow from "../../../../components/userList/UserListCanFollowUnfollow";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";
import { seeFollowers, seeFollowersVariables } from "../../../../__generated__/seeFollowers";

type Props = NativeStackScreenProps<FeedStackProps, 'Followers'>;

const SEE_FOLLOWERS = gql`
  query seeFollowers($id: Int!, $cursorId: Int){
    seeFollowers(id: $id, cursorId: $cursorId) {
      cursorId
      hasNextPage
      followers {
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

const Followers = ({route}:Props) => {
  const userId = route.params.userId;
  // Followers 쿼리 받음
  const [seeFollowers,{data,loading,refetch,fetchMore,updateQuery}] = useLazyQuery<seeFollowers,seeFollowersVariables>(SEE_FOLLOWERS,{
    variables: {
      id:userId,
    },
  });

  useEffect(()=>{
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
        cursorId:data.seeFollowers.cursorId,
      },
    });
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.seeFollowers,fetchMoreFn);
  };

  const isLoggedIn = isLoggedInVar();
  if(!isLoggedIn) {
    return <UserList dataDotQuery={data?.seeFollowers} refetch={doRefetch} loading={loading} onEndReached={onEndReached}/>
  }

  return (
    <UserListCanFollowUnfollow dataDotQuery={data?.seeFollowers} refetch={doRefetch} loading={loading} onEndReached={onEndReached} updateQuery={updateQuery} />
  );
}
export default Followers;
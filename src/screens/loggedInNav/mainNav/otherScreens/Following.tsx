import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { isLoggedInVar } from "../../../../apollo";
import { FeedStackProps } from "../../../../components/type";
import UserList from "../../../../components/userList/UserList";
import UserListCanFollowUnfollow from "../../../../components/userList/UserListCanFollowUnfollow";
import UserListCanSendMessage from "../../../../components/userList/UserListCanSendMessage";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";
import { seeFollowing, seeFollowingVariables } from "../../../../__generated__/seeFollowing";

type Props = NativeStackScreenProps<FeedStackProps, 'Following'>;

const SEE_FOLLOWING = gql`
  query seeFollowing($id: Int!, $cursorId: Int){
    seeFollowing(id: $id, cursorId: $cursorId) {
      cursorId
      hasNextPage
      following {
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

const Following = ({route}:Props) => {
  const userId = route.params.userId;
  
  // message 에서 왔을 경우
  const isMessage = route.params.isMessage;

  // Following 쿼리 받음
  const {data,error,loading,refetch,fetchMore,updateQuery} = useQuery<seeFollowing,seeFollowingVariables>(SEE_FOLLOWING,{
    variables: {
      id:userId,
    },
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
        cursorId:data.seeFollowing.cursorId,
      },
    });
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.seeFollowing,fetchMoreFn);
  };

  const isLoggedIn = isLoggedInVar();
  if(!isLoggedIn) {
    return <UserList dataDotQuery={data?.seeFollowing} refetch={doRefetch} loading={loading} onEndReached={onEndReached}/>
  }

  return (
    isMessage ?
      <UserListCanSendMessage dataDotQuery={data?.seeFollowing?.following} refetch={doRefetch} loading={loading} />
    :
      <UserListCanFollowUnfollow dataDotQuery={data?.seeFollowing} refetch={doRefetch} loading={loading} onEndReached={onEndReached} updateQuery={updateQuery} />
  );
}
export default Following;
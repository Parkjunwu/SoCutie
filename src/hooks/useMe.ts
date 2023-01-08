import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar } from "../apollo";
import { ME_FRAGMENT } from "../fragment";
import { Me } from "../__generated__/me";
import useLogOut from "./useLogOut";

const ME_QUERY = gql`
  query me {
    me {
      ...MeFragment
    }
  }
  ${ME_FRAGMENT}
`;

export const USER_AVATAR = "userAvatar";

const useMe:()=>{data:{me:Me}|undefined,refetch:() => Promise<ApolloQueryResult<{me:Me}>>} = () => {
  
  const {data,refetch} = useQuery<{me:Me}>(ME_QUERY,{
    skip: !isLoggedInVar(),
    onCompleted:()=>{
      console.log("me get")
    }
  });
  
  const logOut = useLogOut();

  const logUserOut = async () => {
    await logOut();
  };

  useEffect(()=>{
    if(data?.me?.id === null ) {
      logUserOut();
      console.log("useMe logUserOut")
    }
  },[data]);
  
  return { data, refetch };
};

export default useMe;
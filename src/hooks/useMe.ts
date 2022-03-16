import { ApolloQueryResult, gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";
import { me, meVariables } from "../__generated__/me";

const ME_QUERY = gql`
    query me ($cursorId:Int) {
      me {
        id
        userName
        avatar
        
        # 프로필에 들어갈 애들
        bio
        totalFollowing
        totalFollowers
        posts(
          cursorId:$cursorId
        ){
          post{
            id
            file
          }
          cursorId
        }
      }
    }
`;

// const useMe:()=>{data:me|undefined,refetch:(variables?: Partial<meVariables>) => Promise<ApolloQueryResult<me>>,fetchMore:any} = () => {
  const useMe:()=>{data:me|undefined,fetchMore:any} = () => {
  const hasToken = useReactiveVar(isLoggedInVar);
  // const {data,refetch,fetchMore} = useQuery<me,meVariables>(ME_QUERY,{
    const {data,fetchMore} = useQuery<me,meVariables>(ME_QUERY,{
    skip: !hasToken
  });
  useEffect(()=>{
    if(data?.me === null) {
      logUserOut();
    }
  },[data])
  // return {data,refetch,fetchMore};
  return {data,fetchMore};
}
export default useMe;
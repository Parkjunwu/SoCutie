import { ApolloCache, DefaultContext, MutationUpdaterFunction, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { ListRenderItemInfo, View } from "react-native";
import styled from "styled-components/native";
import { SEE_BLOCK_USERS } from "../../../../gql/forCodeGen";
import UN_BLOCK_USER from "../../../../gql/unblockUser";
import useIsDarkMode from "../../../../hooks/useIsDarkMode";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";
import { seeBlockUsers, seeBlockUsersVariables, seeBlockUsers_seeBlockUsers_users } from "../../../../__generated__/seeBlockUsers";
import { unblockUser, unblockUserVariables } from "../../../../__generated__/unblockUser";
import ScreenLayout from "../../../ScreenLayout";
import BlockUserRow from "./component/BlockUserRow";
import NoDataComponent from "./component/NoDataComponent";

// forCodeGen 에 있음
// const SEE_BLOCK_USERS 

const BlockUsersFlatList = styled.FlatList`
  background-color:${props=>props.theme.backgroundColor} ;
`;

const SeeBlockUsers = ({navigation}) => {
  
  const [seeBlockUsers,{data,refetch,loading,fetchMore,updateQuery}] = useLazyQuery<seeBlockUsers,seeBlockUsersVariables>(SEE_BLOCK_USERS);

  useEffect(()=>{
    refetch();
  },[]);
  
  const updateUnblockUser: MutationUpdaterFunction<unblockUser,unblockUserVariables, DefaultContext, ApolloCache<any>>= (cache,result,{variables}) => {
    const ok = result.data?.unblockUser.ok;
    const userId = variables.id;
    if(ok) {
      // updateQuery 로 해야함. cache.modify 말고.
      updateQuery((prev)=>{
        const {seeBlockUsers:{ users:prevUsers, isNotFetchMore, ...prevRest }} = prev;
        // isNotFetchMore 없어도 잘 됨. 안되면 확인
        const filteredUsers = prevUsers.filter(user => user.id !== userId);
        const result = {
          seeBlockUsers:{
            users:filteredUsers,
            isNotFetchMore:true,
            ...prevRest,
          },
        };
        return result;
      });
    }
  };

  const [unblockUserNeedVariable] = useMutation<unblockUser,unblockUserVariables>(UN_BLOCK_USER,{
    // variables 을 BlockUserRow 에서 받음.
    update:updateUnblockUser,
  });


  // const darkModeSubscription = useColorScheme();
  // const isDarkMode = darkModeSubscription === "dark";
  const isDarkMode = useIsDarkMode();

  // 각 항목 렌더링
  const renderUser = ({item:user}:ListRenderItemInfo<seeBlockUsers_seeBlockUsers_users>) => {
    return <BlockUserRow user={user} unblockUserNeedVariable={unblockUserNeedVariable} />;
  };

  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.seeBlockUsers.cursorId,
      },
    });
  };

  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.seeBlockUsers,fetchMoreFn);
  };

  return (
    <ScreenLayout loading={loading}>
      <BlockUsersFlatList
        data={data?.seeBlockUsers.users}
        renderItem={renderUser}
        keyExtractor={(item:seeBlockUsers_seeBlockUsers_users)=>item?.id + ""}
        ListEmptyComponent={NoDataComponent}
        ItemSeparatorComponent={()=><View style={{width:"100%",height:2,backgroundColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </ScreenLayout>
  );
};

export default SeeBlockUsers;
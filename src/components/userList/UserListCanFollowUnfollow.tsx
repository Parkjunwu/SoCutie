import { WatchQueryOptions } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, useColorScheme, View } from "react-native";
import styled from "styled-components/native";
import { seeFollowing_seeFollowing } from "../../__generated__/seeFollowing";
import ScreenLayout from "../ScreenLayout";
import UserRowCanFollowUnfollow from "./UserList/UserRowCanFollowUnfollow";


type Props = {
  dataDotQuery: seeFollowing_seeFollowing,
  refetch: any,
  loading: any
  onEndReached: (info: { distanceFromEnd: number; }) => void,
  updateQuery: <TVars =any>(mapFn: (previousQueryResult:any, options: Pick<WatchQueryOptions<TVars,any>, "variables">) =>any) => void,
} ;

const NoDataView = styled.View`
  margin-top:100px;
  align-items: center;
  /* background-color:blue; */
`;
const NoDataText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 19px;
  font-weight:700;
`;

// Likes, Followers, Following Layout 형식
// data 를 data 로 바로 받지 말고 data?.seePostLikes 형식으로 받아야 함.
const UserListCanFollowUnfollow = ({dataDotQuery,refetch,loading,onEndReached,updateQuery}:Props) => {


  // 당겨서 새로고침
  const [refreshing,setRefreshing] = useState(false);

  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const refreshControl = <RefreshControl
    refreshing={refreshing}
    onRefresh={onRefresh} />;

  

  // 들어올 때 다시 받음.
  useEffect(()=>{
    console.log("re")
    refetch();
  },[])

  // 각 항목 렌더링
  const renderUser = ({item:user}) => {
    if(user && updateQuery) {
      return <UserRowCanFollowUnfollow {...user} updateQuery={updateQuery} />;
    }
    return null;
  }
  
  const darkModeSubscription = useColorScheme();

  let userFieldName:string;
  for(let i in dataDotQuery) {
    if(i !== "isNotFetchMore" && i !== "hasNextPage" && i !== "cursorId" && i !== "error" && i !== "__typename") {
      userFieldName = i;
      break;
    }
  };

  const noDataMessage = () => {
    if(userFieldName === "followers"){
      return "팔로우한 유저가 없습니다."
    } else if(userFieldName === "following"){
      return "팔로잉한 유저가 없습니다."
    } else if(userFieldName === "likeUsers"){
      return "아직 좋아요한 유저가 없습니다."
    } else {
      return "아직 해당 유저가 없습니다."
    }
  }

  const NoDataComponent = <NoDataView><NoDataText>{noDataMessage()}</NoDataText></NoDataView>;
  
  // dataDotQuery null 체크
  const userData = dataDotQuery && dataDotQuery[userFieldName];

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        // data={dataDotQuery}
        data={userData}
        renderItem={renderUser}
        keyExtractor={(item)=>item?.id + ""}
        refreshControl={refreshControl}
        ListEmptyComponent={NoDataComponent}
        ItemSeparatorComponent={()=><View style={{width:"100%",height:2,backgroundColor: darkModeSubscription === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)"}} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </ScreenLayout>
  );
}
export default UserListCanFollowUnfollow;
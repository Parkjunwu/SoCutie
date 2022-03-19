import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, useColorScheme, View } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../ScreenLayout";
import UserRow from "../UserRow";

// type Props = NativeStackScreenProps<FeedStackProps, 'Likes'> & {
type Props = {
  dataDotQuery: any,
  refetch: any,
  loading: any
} ;

const NoDataView = styled.View`
  margin-top:100px;
  align-items: center;
  /* background-color:blue; */
`;
const NoDataText = styled.Text`
  color: white;
  font-size: 19px;
  font-weight:700;
`;

// Likes, Followers, Following Layout 형식
// data 를 data 로 바로 받지 말고 data?.seePostLikes 형식으로 받아야 함.
const UserList = ({dataDotQuery,refetch,loading}:Props) => {
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
  const NoDataComponent = <NoDataView><NoDataText>아래로 당겨서 새로고침</NoDataText></NoDataView>;

  // 들어올 때 다시 받음.
  useEffect(()=>{
    console.log("re")
    refetch();
  },[])

  // 각 항목 렌더링
  const renderUser = ({item:user}) => {
    if(user) return <UserRow {...user}/>;
    return null;
  }
  
  const darkModeSubscription = useColorScheme();

  return (
    <ScreenLayout loading={loading}>
       <FlatList
        data={dataDotQuery}
        // 아래 애 처럼 들어와야 하니 애초에 받을 때 주의. <UserList dataDotQuery={data?.seePostLikes} ~~ 이런 식으로
        // data={data?.seePostLikes}
        renderItem={renderUser}
        keyExtractor={(item)=>item?.id + ""}
        refreshControl={refreshControl}
        ListEmptyComponent={NoDataComponent}
        ItemSeparatorComponent={()=><View style={{width:"100%",height:2,backgroundColor: darkModeSubscription === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)"}} />}
      />
    </ScreenLayout>
  );
}
export default UserList;
import { gql, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ListRenderItem } from "react-native";
import styled from "styled-components/native";
import useIsDarkMode from "../../hooks/useIsDarkMode";
import cursorPaginationFetchMore from "../../logic/cursorPaginationFetchMore";
import { getUserPetLogs, getUserPetLogsVariables, getUserPetLogs_getUserPetLogs_petLogs } from "../../__generated__/getUserPetLogs";
import { seeProfile_seeProfile_user } from "../../__generated__/seeProfile";
import SinglePetLog from "../me/loggedInUserView/aboutAccountNav/component/SinglePetLog";
import { FeedStackProps } from "../type";

const GET_USER_POSTS = gql`
  query getUserPetLogs($userId:Int!,$cursorId:Int) {
    getUserPetLogs(userId:$userId,cursorId:$cursorId) {
      cursorId
      hasNextPage
      petLogs {
        id
        title
        thumbNail
        createdAt
        # 필요하면 받아
        likes
        commentNumber
        # isLiked
      }
      error
    }
  }
`;


type NavigateProps = NativeStackScreenProps<FeedStackProps, 'Profile'>;

const PetLogContainer = styled.FlatList`
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
`;

const PetLogFlatList = ({user}:{user:seeProfile_seeProfile_user}) => {

  const navigation = useNavigation<NavigateProps["navigation"]>();
  
  useEffect(()=>{
    navigation.jumpTo('Profile');
  },[])

  // PetLog 들 역시 가져옴
  const [getUserPetLogs,{data:userPetLogData,refetch,fetchMore}] = useLazyQuery<getUserPetLogs,getUserPetLogsVariables>(GET_USER_POSTS,{
    variables:{
      userId:user?.id,
    },
  });

  // user 가 아직 안들어온 경우가 있어서 의존성줌 refetch
  useEffect(()=>{
    if(user){
      refetch();
    }
  },[user]);

  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:userPetLogData.getUserPetLogs.cursorId,
      },
    });
  };

  const onEndReached = async() => {
    await cursorPaginationFetchMore(userPetLogData?.getUserPetLogs,fetchMoreFn);
  };

  
  const isDarkMode = useIsDarkMode();

  const renderItem:ListRenderItem<getUserPetLogs_getUserPetLogs_petLogs> = ({item}) => <SinglePetLog
    {...item}
    user={user}
    navigation={navigation}
    isDarkMode={isDarkMode}
  />

  return (
    <PetLogContainer
      data={userPetLogData?.getUserPetLogs.petLogs}
      renderItem={renderItem}
      keyExtractor={(item:getUserPetLogs_getUserPetLogs_petLogs)=>item.id + ""}
      // numColumns={numColumns}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

export default PetLogFlatList;
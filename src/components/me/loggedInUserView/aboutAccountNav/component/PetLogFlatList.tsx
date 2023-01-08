import { gql, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ListRenderItem } from "react-native";
import styled from "styled-components/native";
import cursorPaginationFetchMore from "../../../../../logic/cursorPaginationFetchMore";
import { getMePetLogs, getMePetLogsVariables, getMePetLogs_getMePetLogs_petLogs } from "../../../../../__generated__/getMePetLogs";
import { MeStackProps } from "../../../../type";
import useIsDarkMode from "../../../../../hooks/useIsDarkMode";
import SinglePetLog from "./SinglePetLog";
import useMe from "../../../../../hooks/useMe";

const GET_ME_PETLOGS = gql`
  query getMePetLogs($cursorId:Int) {
    getMePetLogs(cursorId:$cursorId) {
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
      }
      error
      # isNotFetchMore
    }
  }
`;

const PetLogContainer = styled.FlatList`
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
`;

type NavigateProps = NativeStackScreenProps<MeStackProps,"Me">

const PetLogFlatList = () => {

  // PetLog 들 역시 가져옴
  const [getMePetLogs,{data:userPetLogData,refetch,fetchMore}] = useLazyQuery<getMePetLogs,getMePetLogsVariables>(GET_ME_PETLOGS);

  // 처음 들어오면 refetch
  useEffect(()=>{
    refetch();
  },[]);

  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:userPetLogData.getMePetLogs.cursorId,
      },
    });
  };

  const onEndReached = async() => {
    await cursorPaginationFetchMore(userPetLogData?.getMePetLogs,fetchMoreFn);
  };

  const navigation = useNavigation<NavigateProps["navigation"]>();
  const isDarkMode = useIsDarkMode();
  const {data:meData} = useMe();

  const renderItem:ListRenderItem<getMePetLogs_getMePetLogs_petLogs> = ({item}) => <SinglePetLog
    {...item}
    navigation={navigation}
    isDarkMode={isDarkMode}
    meData={meData?.me}
  />

  return (
    <PetLogContainer
      data={userPetLogData?.getMePetLogs.petLogs}
      renderItem={renderItem}
      keyExtractor={(item:getMePetLogs_getMePetLogs_petLogs)=>item.id + ""}
      // numColumns={numColumns}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

export default PetLogFlatList;
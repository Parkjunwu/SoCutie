import { ListRenderItem } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../../../color";
import PetLogSummary from "../../../../components/petLog/PetLogSummary";
import randomGoodWord from "../../../../quotesAboutAnimal";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { seeNewPetLogList, seeNewPetLogListVariables, seeNewPetLogList_seeNewPetLogList_petLogs } from "../../../../__generated__/seeNewPetLogList";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";
import GoToSearchPetLogBtn from "../../../../components/petLogList/GoToSearchPetLogBtn";

const SEE_NEW_PETLOG_LIST = gql`
  query seeNewPetLogList($cursorId: Int) {
    seeNewPetLogList(cursorId: $cursorId) {
      cursorId
      hasNextPage
      petLogs {
        id
        user {
          id
          userName
          # avatar 까지 넣긴 너무 좁을듯 ? 근데 없으니까 밋밋해. avatar thumbnail 을 같이 저장할까?
          avatar
        }
        title
        thumbNail
        createdAt
        likes
        commentNumber
      }
      error
    }
  }
`;

const Container = styled.View`
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
`;
const FlatListPetLog = styled.FlatList`
  flex: 9;
`;
const QuoteContainer = styled.View`
  padding: 10px 10px;
`;
const Quote = styled.View`
  padding: 10px 20px;
  border-width: 3px;
  border-color: ${colors.darkYellow};
  border-radius: 10px;
`;
const QuoteWordText = styled.Text`
  color: ${props=>props.theme.textColor};
`;
const QuotePersonNameText = styled.Text`
  text-align: right;
  color: ${props=>props.theme.textColor};
`;

const NewPetLogList = ({navigation}) => {

  useEffect(()=>{
    navigation.setOptions({
    // SearchTab 말고 Search 따로 빼서 거기로 가게
      headerLeft:({tintColor})=><GoToSearchPetLogBtn
        tintColor={tintColor}
        navigation={navigation}
      />
    })
  },[]);

  const { loading, error, data, refetch, fetchMore } = useQuery<seeNewPetLogList,seeNewPetLogListVariables>(SEE_NEW_PETLOG_LIST, {
    // fetchPolicy: 'network-only', 이 pagination 에 걸릴 수 있음. 만약 그러면 걍 refetch.
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(()=>{
    refetch();
  },[])
  
  const quoteWord = randomGoodWord.quote;
  const quotePersonName = randomGoodWord.name;

  const [refreshing,setRefreshing] = useState(false);
  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.seeNewPetLogList.cursorId,
      },
    });
  };
  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.seeNewPetLogList,fetchMoreFn);
  };

  const renderItem:ListRenderItem<seeNewPetLogList_seeNewPetLogList_petLogs> = ({item}) => {
    return <PetLogSummary {...item} />
  };
  
  return (
    <Container>
      <FlatListPetLog
        data={data?.seeNewPetLogList.petLogs}
        renderItem={renderItem}
        keyExtractor={(item:seeNewPetLogList_seeNewPetLogList_petLogs)=>item.id+""}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
      <QuoteContainer>
        <Quote>
          <QuoteWordText>
            {quoteWord}
          </QuoteWordText>
          <QuotePersonNameText>
            - {quotePersonName}
          </QuotePersonNameText>
        </Quote>
      </QuoteContainer>
    </Container>
  );
};

export default NewPetLogList;
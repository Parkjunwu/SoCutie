import React, { useState } from "react";
import { FlatList, ListRenderItem, Platform, StatusBar, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import DismissKeyboard from "../../../../components/DismissKeyboard";
import { SafeAreaView } from 'react-native-safe-area-context';
import useIsDarkMode from "../../../../hooks/useIsDarkMode";
import { gql, useLazyQuery } from "@apollo/client";
import { searchPetLogs, searchPetLogsVariables, searchPetLogs_searchPetLogs_petLogs } from "../../../../__generated__/searchPetLogs";
import cursorPaginationFetchMore from "../../../../logic/cursorPaginationFetchMore";
import PetLogSummary from "../../../../components/petLog/PetLogSummary";

const SEARCH_PETLOGS = gql`
  query searchPetLogs($keyword:String!,$cursorId:Int) {
    searchPetLogs(keyword:$keyword,cursorId:$cursorId) {
      cursorId
      hasNextPage
      petLogs{
        id
        user{
          id
          userName
          avatar
        }
        title
        createdAt
        thumbNail
        likes
        commentNumber
      }
      error
    }
  }
`;

const WholeContainer = styled.View`
  flex:1;
  background-color: ${props => props.theme.backgroundColor};
`;
// const SafeAreaView = styled.SafeAreaView`
//   flex:1;
// `;
const AndroidAvoidStatusBar = styled.View<{height:number}>`
  height: ${props=>props.height}px;
`;
const HeaderContainer = styled.View`
  background-color: ${props => props.theme.backgroundColor};
  align-items: center;
  margin-bottom: 10px;
`;

const OptionContainer = styled.View`
  flex-direction: row;
`;
const GoBackBtn = styled.TouchableOpacity`
  flex: 1;
  /* margin-left: 10px; */
`;
const HeaderSearch = styled.View<{width:number}>`
  background-color: ${props => props.theme.textInputBackgroundColor};
  padding: 10px 10px;
  border-radius: 25px;
  flex-direction: row;
  align-items: center;
  width: ${props=>props.width-30}px;
`;
const HeaderInput = styled.TextInput`
  font-size: 20px;
  width: 80%;
  color: ${props=>props.theme.textColor};
  margin-left: 4px;
`;

const SearchPetLog = ({navigation}) => {
  const {width} = useWindowDimensions();
  const isDarkMode = useIsDarkMode();
  const [value,setValue] = useState("");

  const [searchPetLogs,{data,fetchMore}] = useLazyQuery<searchPetLogs,searchPetLogsVariables>(SEARCH_PETLOGS,{
    fetchPolicy:"network-only"
  });

  const onVaild = async() => {
    await searchPetLogs({
      variables:{
        keyword:value,
      },
    });
  };


  // 안드로이드는 StatusBar 에 겹쳐. 그래서 얘보다 아래에 렌더링되게
  // 얘가 왔다갔다하네. 언제는 StatusBar 보다 밑에 그려지고 언제는 무시하고 그려짐.
  const statusBarHeight = StatusBar.currentHeight + 15;

  const renderItem:ListRenderItem<searchPetLogs_searchPetLogs_petLogs> = ({item}) => {
    return <PetLogSummary {...item} />
  };

  // infinite scroll
  const fetchMoreFn = async() => {
    if(data?.searchPetLogs.hasNextPage) {
      await fetchMore({
        variables:{
          cursorId:data.searchPetLogs.cursorId,
        },
      });
    }
  };

  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.searchPetLogs,fetchMoreFn);
  };

  return (
  <WholeContainer>
    <DismissKeyboard>
      <SafeAreaView style={{flex:1}}>
        {Platform.OS === "android" && <AndroidAvoidStatusBar height={statusBarHeight} />}

        <OptionContainer>
          <GoBackBtn onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={28} color={isDarkMode ? "white" : "black" } />
          </GoBackBtn>
        </OptionContainer>

        <HeaderContainer>
          <HeaderSearch width={width}>
            <TouchableOpacity onPress={onVaild}>
              <Ionicons name="search" size={30} color={isDarkMode ? "white" : "black" } />
            </TouchableOpacity>
            <HeaderInput
              placeholder={"펫로그 찾기"}
              placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
              autoCapitalize="none"
              returnKeyType="search"
              onChangeText={text => setValue(text)}
              autoCorrect={false}
              onSubmitEditing={onVaild}
            />
          </HeaderSearch>
        </HeaderContainer>

        <FlatList
          data={data?.searchPetLogs.petLogs}
          keyExtractor={(item)=>item?.id + ""}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />

      </SafeAreaView>
    </DismissKeyboard>
  </WholeContainer>
  );
}
export default SearchPetLog;
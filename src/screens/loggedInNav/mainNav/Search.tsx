import React, { useEffect, useRef, useState } from "react";
import { Platform, StatusBar, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import DismissKeyboard from "../../../components/DismissKeyboard";
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import { Entypo } from '@expo/vector-icons';
import SearchPost from "../../../components/search/SearchPost";
import SearchUser from "../../../components/search/SearchUser";
import { SafeAreaView } from 'react-native-safe-area-context';
import useIsDarkMode from "../../../hooks/useIsDarkMode";


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
const OptionView = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px;
  border-radius: 5px;
  border-color: ${props=>props.theme.textColor};
`;
const OptionText = styled.Text`
  color: ${props=>props.theme.textColor};
  padding-left: 8px;
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

const dropdown = [
  {
    value: '게시물',
  },
  {
    value: '유저명',
  }
];


type FormType = {
  keyword: string;
}

const Search = ({navigation}) => {
  const {width} = useWindowDimensions();
  const isDarkMode = useIsDarkMode();
  const {setValue,register,handleSubmit} = useForm<FormType>();
  
  // searchOption 으로 쿼리 바꾸기 구현해야함
  const [searchOption,setSearchOption] = useState("게시물")
  const onChangeText = ( value, index, data ) => {
    setSearchOption(value);
  };
  const isSearchPosting = searchOption === "게시물";
  
  // 자식 함수 호출하기 위함.
  const parentRef = useRef();

  const onVaild:SubmitHandler<FormType> = async({keyword}) => {
    if(isSearchPosting) {
      await parentRef.current.searchPosts(keyword);
    } else {
      await parentRef.current.searchUsers(keyword);
    }
  };

  useEffect(()=>{
    register("keyword",{
      required:true,
    });
  },[]);

  // 안드로이드는 StatusBar 에 겹쳐. 그래서 얘보다 아래에 렌더링되게
  // 얘가 왔다갔다하네. 언제는 StatusBar 보다 밑에 그려지고 언제는 무시하고 그려짐.
  const statusBarHeight = StatusBar.currentHeight + 15;

  return (
  <WholeContainer>
    <DismissKeyboard>
      <SafeAreaView style={{flex:1}}>
        {Platform.OS === "android" && <AndroidAvoidStatusBar height={statusBarHeight} />}
        <OptionContainer>
          <GoBackBtn onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={28} color={isDarkMode ? "white" : "black" } />
          </GoBackBtn>
          <Dropdown
            data={dropdown}
            pickerStyle={{borderRadius:10,width:60}}
            renderBase={()=><OptionView>
              <OptionText>{searchOption}</OptionText>
              <Entypo name="chevron-down" size={24} color={isDarkMode ? "white" : "black"} /></OptionView>}
            pickerStyle={{width:77,borderRadius:10}}
            dropdownOffset={{left:10,top:50}}
            onChangeText={onChangeText}
          />
        </OptionContainer>
        <HeaderContainer>
          <HeaderSearch width={width}>
            <TouchableOpacity onPress={handleSubmit(onVaild)}>
              <Ionicons name="search" size={30} color={isDarkMode ? "white" : "black" } />
            </TouchableOpacity>
            <HeaderInput
              placeholder={isSearchPosting ? "게시물 찾기" : "유저 찾기"}
              placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
              autoCapitalize="none"
              returnKeyType="search"
              onChangeText={text => setValue("keyword",text)}
              autoCorrect={false}
              onSubmitEditing={handleSubmit(onVaild)}
            />
          </HeaderSearch>
        </HeaderContainer>

        {/* <OptionContainer>
          <GoBackBtn onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={28} color={isDarkMode ? "white" : "black" } />
          </GoBackBtn>
          <Dropdown
            data={dropdown}
            pickerStyle={{borderRadius:10,width:60}}
            renderBase={()=><OptionView>
              <OptionText>{searchOption}</OptionText>
              <Entypo name="chevron-down" size={24} color={isDarkMode ? "white" : "black"} /></OptionView>}
            pickerStyle={{width:77,borderRadius:10}}
            dropdownOffset={{left:10,top:50}}
            onChangeText={onChangeText}
          />
        </OptionContainer> */}

        {isSearchPosting ?
          <SearchPost ref={parentRef}/>
        :
          <SearchUser ref={parentRef}/>
        }

      </SafeAreaView>
    </DismissKeyboard>
  </WholeContainer>
  );
}
export default Search;
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, ListRenderItem, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { SearchStackProps } from "../../../components/type";
import { Ionicons } from "@expo/vector-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import DismissKeyboard from "../../../components/DismissKeyboard";
import { gql, useLazyQuery } from "@apollo/client";
import { searchPosts, searchPostsVariables, searchPosts_searchPosts } from "../../../__generated__/searchPosts";

const Container = styled.View`
  background-color: ${props => props.theme.backgroundColor};
  flex:1;
`;
const HeaderSearch = styled.View<{width:number}>`
  /* background-color: rgba(255,255,255,0.8); */
  background-color: ${props => props.theme.textInputBackgroundColor};
  padding: 10px 10px;
  border-radius: 25px;
  /* width: 200px; */
  flex-direction: row;
  align-items: center;
  width: ${props=>props.width-30}px;
`;
const HeaderInput = styled.TextInput`
  font-size: 20px;
  width: 80%;
`;
const MessageContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  /* background-color: red; */
`;
const MessageText = styled.Text`
  color: ${props => props.theme.textColor};
  font-weight: 600;
  margin-top: 10px;
`;
const ImageContainer = styled.TouchableOpacity`
  /* background-color: red; */
`;
const Img = styled.Image`
  width: ${props=>props.width}px;
  height: ${props=>props.width}px;
`;

const SEARCH_PHOTO_QUERY = gql`
  query searchPosts( $keyword: String! ){
    searchPosts( keyword:$keyword ){
      id
      file
    }
  }
`;

const SEARCH_USER_QUERY = gql`
  query searchUsers($keyword: String!,$lastId: Int) {
    searchUsers(keyword: $keyword,lastId: $lastId) {
      users {
        userName
        avatar
      }
    }
  }

`;

type Props = NativeStackScreenProps<SearchStackProps, 'Search'>;
type FormType = {
  keyword: string;
}

const Search = ({navigation:{navigate,setOptions},route}:Props) => {
  const {setValue,register,handleSubmit} = useForm<FormType>();
  const [startQueryFn, {loading, data, called}] = useLazyQuery<searchPosts,searchPostsVariables>(SEARCH_PHOTO_QUERY);
  const {width} = useWindowDimensions();
  const onVaild:SubmitHandler<FormType> = ({keyword}) => {
    startQueryFn({
      variables:{
        keyword
      }
    })
  }
  console.log(data)
  // const onSubmit = () => {
  //   if(loading) return;
  //   const keyword = getValues().keyword
  //   if (!keyword) return;
  //   startQueryFn({
  //     variables:{
  //       keyword
  //     }
  //   })
  // }
  useEffect(()=>{
    setOptions({
      headerShadowVisible:false,
      headerTitle:() => <HeaderSearch width={width}>
        <TouchableOpacity onPress={handleSubmit(onVaild)}>
          <Ionicons name="search" size={30} />
        </TouchableOpacity>
        <HeaderInput
          placeholder="Search User"
          placeholderTextColor="rgba(0,0,0,0.3)"
          autoCapitalize="none"
          returnKeyType="search"
          onChangeText={text => setValue("keyword",text)}
          autoCorrect={false}
          onSubmitEditing={handleSubmit(onVaild)}
        />
      </HeaderSearch>
    });
    register("keyword",{
      required:true,
      // minLength:3,
    });
  },[])
  // console.log(data);
  const renderItem:ListRenderItem<searchPosts_searchPosts|null >|null = ({item:photo}) => {
    if(photo?.file && photo.id) {
    return (
      <ImageContainer onPress={()=>navigate("Photo", {photoId: photo.id})}>
        {/* 첫번째 사진만 */}
        <Img source={{uri:photo?.file[0]}} width={width/3}/>
        {/* <Image source={{uri:photo.file}} style={{width:width/3}} height={width/3} /> */}
      </ImageContainer>
    )}
    return null;
  }
  return <DismissKeyboard>
    <Container>
    {loading? <MessageContainer>
        <ActivityIndicator size="large"/>
        <MessageText>Searching...</MessageText>
      </MessageContainer> : null
    }
    {!called?<MessageContainer>
      <MessageText>Search by keyword</MessageText>
    </MessageContainer>:null}
    {data?.searchPosts !== undefined ? (
      data?.searchPosts?.length === 0 ? (
        <MessageContainer>
          <MessageText>해당 키워드의 검색 결과가 없습니다.</MessageText>
        </MessageContainer>
        ) : (
        <FlatList
          data={data?.searchPosts}
          keyExtractor={(item)=>item?.id + ""}
          renderItem={renderItem}
          numColumns={3}
        /> )
      ) : null}
    </Container>
  </DismissKeyboard>;
}
export default Search;
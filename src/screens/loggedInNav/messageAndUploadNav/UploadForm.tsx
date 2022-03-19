import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import {Ionicons} from "@expo/vector-icons"
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import { colors } from "../../../color";
import { uploadPost, uploadPostVariables } from "../../../__generated__/uploadPost";
import useMe from "../../../hooks/useMe";
import DismissKeyboard from "../../../components/DismissKeyboard";

// const PHOTO_FRAGMENT = gql`
//   fragment PhotoFragment on Photo {
//     id
//     file
//     likes
//     commentNumber
//     isLiked
//   }
// `;
// const FEED_PHOTO = gql`
//    fragment FeedPhoto on Photo {
//      ...PhotoFragment
//      user {
//        id
//        userName
//        avatar
//      }
//      caption
//      createdAt
//      isMine
//    }
//    ${PHOTO_FRAGMENT}
//  `;

// const UPLOAD_PHOTO_MUTATION = gql`
//   mutation uploadPost($file: Upload!, $caption: String) {
//     uploadPost(file: $file, caption: $caption){
//       ...FeedPhoto
//     }
//   }
//   ${FEED_PHOTO}
// `;

const UPLOAD_POST_MUTATION = gql`
  mutation uploadPost ($photoArr:[Upload]!, $caption:String) {
    uploadPost (photoArr:$photoArr, caption:$caption) {
      ok
      error
      uploadedPost {
        # 얘네 두개만 받고 나머지는 어차피 유저 정보로 캐시 만들면 되니까. 근데 캐시 귀찮으면 위에처럼 데이터 다 받아서 걔를 그냥 넣어<div className=""></div>
        id
        createdAt
      }
    }
  }
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
  /* padding: 0px 40px; */
`;
const FullImageContainer = styled.View`
  /* background-color: tomato; */
  position: relative;
`;
const FullImageDeleteBtn = styled.TouchableOpacity`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 10px;
  /* background-color: tomato; */
  opacity: 0.5;
`;
const FullImageDeleteBtnText = styled.Text`
`;
const Photo = styled.Image`
  height: 350px;
`;
const ImageContainer = styled.View`
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;
const IconContainer = styled.View`
  position: absolute;
  bottom: 10%;
  right: 10%;
`;
const SelectedPhotoComponent = styled.View`
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background-color: yellow;
`;
const SelectedPhotoComponentText = styled.Text`
  font-size: 12px;
  text-align: center;
`;
const CaptionContainer = styled.View`
  margin-top: 30px;
`;
const AnnounceText = styled.Text`
  font-size: 15px;
  text-align: center;
  color: white;
  margin-top: 3px;
`;
const Caption = styled.TextInput`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 100px;
`;
const HeaderRightText = styled.Text`
  color:${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

type TabParamList = {
  FeedTab:undefined;
  SearchTab:undefined;
  CameraTab:undefined;
  NotificationTab:undefined;
  MeTab:undefined;
};
type NativeStackParamList = {
  Tabs:NavigatorScreenParams<TabParamList>;
  Upload:undefined;
  UploadForm:{file:string[]};
  ////
  FeedTab:undefined;
  ////
};
type Props = NativeStackScreenProps<NativeStackParamList,"UploadForm">
interface IForm {
  caption: string;
}

// 큰 이미지의 index
let fullImageIndex;

const UploadForm = ({navigation,route}:Props) => {
  // TextInput 을 위한 useForm
  const {register,handleSubmit,setValue,getValues} = useForm<IForm>();
  useEffect(() => {
    register("caption"
      // 굳이 필수까진
      // ,{required:true,}
    );
  },[register]);

  // 캐시를 위해 현재 로그인한 유저 정보를 가져옴.
  const {data} = useMe();

  // navigation 으로 받은 파일 uri 목록
  const [photoUriArr,setPhotoUriArr] = useState(route.params.file);

  // 업로드 이후 캐시 변경
  const updateUploadPost:MutationUpdaterFunction<any, uploadPostVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    const {data:{uploadPost:{ok,error,uploadedPost}}} = result;
    
    // 파일 업로드 오류시 에러메세지 보여줌
    if(!ok) {
      Alert.alert(error,"같은 문제가 지속적으로 발생한다면 문의 주시면 감사드리겠습니다.")
    }

    // 캐시에 넣을 거
    const uploadPostCache = {
      // post 의 id 랑 createdAt
      ...uploadedPost,
      // __typeName 도 받는데 괜찮나?
      user:data.me,
      likes:0,
      caption:getValues("caption"),
      file:photoUriArr,
      commentNumber:0,
      isLiked:false,
      isMine:true,
    }
    // 캐시 변경
    cache.modify({
      id:"ROOT_QUERY",
      fields:{
        seeFeed(prev){
          return [uploadPostCache,...prev]
        }
      }
    })
    // 홈 화면으로 이동
    navigation.navigate("FeedTab")
  }
  
  // 업로드 mutation
  const [uploadPostMutation,{loading}] = useMutation<uploadPost,uploadPostVariables>(UPLOAD_POST_MUTATION,{
    update:updateUploadPost
  })

  
  // 큰 사진 이미지
  const [bigImage,setBigImage] = useState(photoUriArr[0]);

  // 업로드 submit 시에 백엔드로 mutation 실행
  const onValid = ({caption}:IForm) => {
    // 업로드할 파일을 ReactNativeFile 로 만들어줌.
    const photoArr = photoUriArr.map(uri => (
      new ReactNativeFile({
        uri,
        name: "1.jpg",
        type: "image/jpeg",
      })
    ))
    // const file = new ReactNativeFile({
    //   uri,
    //   name: "1.jpg",
    //   type: "image/jpeg",
    // });
    // 업로드 Mutation
    uploadPostMutation({
      variables:{
        caption,
        photoArr,
      }
    })
  }

  // 네비게이션 헤더 설정
  const HeaderRight = () => <TouchableOpacity onPress={handleSubmit(onValid)}>
    <HeaderRightText>Next</HeaderRightText>
  </TouchableOpacity>
  const HeaderRightLoading = () => <ActivityIndicator size="small" color="white" style={{marginRight:10}}/>

  useEffect(() => {
    navigation.setOptions({
      title:"Upload",
      headerStyle:{
        backgroundColor:"black"
      },
      headerTintColor:"white",
      // headerBackImageSource:{uri:"https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Gtk-go-back-ltr.svg/120px-Gtk-go-back-ltr.svg.png"}

      headerLeft:({tintColor}) => loading ? null : <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="close" color={tintColor} size={30} />
      </TouchableOpacity>,
      headerRight:loading ? HeaderRightLoading : HeaderRight,
    });
  },[loading])

  // 현재 화면 넓이
  const {width} = useWindowDimensions();
  // 각각의 사진 높이/넓이
  const imageWidth = width/4;

  // 올릴 사진 목록 보여줌.
  const renderItem = ({ item:uri, index, drag, isActive }: RenderItemParams<string>) => {
    fullImageIndex=index;
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          onPressIn={() => setBigImage(uri)}
          // disabled={isActive} // 얜 뭐지
          // style={{ backgroundColor: isActive ? "red" : "yellow" }}
        >
          <Image source={{uri}} style={{width:imageWidth,height:imageWidth}}/>
          <IconContainer>
            <SelectedPhotoComponent>
              <SelectedPhotoComponentText>{index}</SelectedPhotoComponentText>
            </SelectedPhotoComponent>
          </IconContainer>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };



  // 큰 사진에서 사진 삭제 버튼 눌렀을 떄
  const onFullPhotoDeleteBtnClick = () => {
    const onPressDeleteOk = () => {
      setPhotoUriArr(prev => {
        const newArr = [...prev];
        newArr.splice(fullImageIndex,1);
        return newArr;
      })
      setBigImage(photoUriArr[0])
    }

    Alert.alert("해당 사진을 업로드 목록에서 제외하시겠습니까?",null,[
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: onPressDeleteOk }
    ])
  }



  // 화면
  return (
    <DismissKeyboard>
      <Container>


        {/* 이미지 업로드 안해도 되면 얘랑 밑에 수정 */}
        <FullImageContainer>
          {/* 큰 이미지 위에 삭제 버튼 만듦. 1개 이상일때. */}
          {photoUriArr.length !== 1 && <FullImageDeleteBtn onPress={onFullPhotoDeleteBtnClick}>
            <FullImageDeleteBtnText>❌</FullImageDeleteBtnText>
          </FullImageDeleteBtn>}
          <Photo source={{uri:bigImage}} resizeMode="contain" />
        </FullImageContainer>




        <ImageContainer>
          <DraggableFlatList
            data={photoUriArr}
            onDragEnd={({ data }) => setPhotoUriArr(data)}
            // 근데 옮기면 키가 index 라 바뀌는데 괜찮을라나? 되는데 깜빡거림. index 쓰지마
            keyExtractor={(item) => item}
            renderItem={renderItem}
            horizontal={true}
            contentContainerStyle={{
              // 얘를 해야지 세로로 사진이 움직임.
              flexDirection: 'row',
            }}
            bounces={false}
          />
        </ImageContainer>
        <AnnounceText>길게 눌러서 순서를 변경하실 수 있습니다.</AnnounceText>
        <CaptionContainer>
          <Caption
            placeholder="Write a caption..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            onChangeText={(text)=>setValue("caption",text)}
            onSubmitEditing={handleSubmit(onValid)}
            returnKeyType="done"
          />
        </CaptionContainer>
      </Container>
    </DismissKeyboard>
  );
}
export default UploadForm;
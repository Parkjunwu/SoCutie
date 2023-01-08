import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import { colors } from "../../../color";
import { uploadPost, uploadPostVariables } from "../../../__generated__/uploadPost";
import useMe from "../../../hooks/useMe";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isAndroid } from "../../../utils";
import VideoIconPositionAbsolute from "../../../components/video/VideoIconPositionAbsolute";
import compressImageVideoFile from "../../../logic/compressImageVideoFile";
import androidGetThumbNail from "../../../logic/androidGetThumbNail";

const UPLOAD_POST_MUTATION = gql`
  mutation uploadPost ($photoArr:[Upload]!, $caption:String, $isFirstVideo:Boolean!, $firstVideoPhoto:Upload) {
    uploadPost (photoArr:$photoArr, caption:$caption, isFirstVideo:$isFirstVideo, firstVideoPhoto:$firstVideoPhoto) {
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
  background-color: ${props=>props.theme.backgroundColor};
`;
const FullImageContainer = styled.View`
  position: relative;
  align-items: center;
  margin: 0px auto;
`;
const FullImageDeleteBtn = styled.TouchableOpacity`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 10px;
`;
const FullImageCropBtn = styled.TouchableOpacity`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 40px;
`;
const FullImageFullScreenBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;
const ImageContainer = styled.View`
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;
const SelectedIconContainer = styled.View`
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
  color: ${props=>props.theme.textColor};
  margin-top: 3px;
`;
const Caption = styled.TextInput`
  background-color: ${props=>props.theme.textInputBackgroundColor};
  color: ${props=>props.theme.textColor};
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
type FileInfo = {
  uri: string,
  isVideo: boolean,
  forIOSThumbNailUri?: string,
}
type NativeStackParamList = {
  Tabs:NavigatorScreenParams<TabParamList>;
  Upload:undefined;
  UploadFormIOS:{
    file:FileInfo[],
    newVideoFile?:string,
    pureVideoFile?:string,
    forIOSThumbNailUri?:string,
  };
  ////
  FeedTab:undefined;
  ////
  EditVideo:{
    file:string,
  };
  FullScreenVideo:{uri:string};
};
type Props = NativeStackScreenProps<NativeStackParamList,"UploadFormIOS">
interface IForm {
  caption: string;
}

// EditPost 랑 거의 비슷

const UploadFormIOS = gestureHandlerRootHOC(({navigation,route}:Props) => {
  // TextInput 을 위한 useForm
  const {register,handleSubmit,setValue,getValues} = useForm<IForm>();

  useEffect(() => {
    register("caption");
  },[register]);

  // 캐시를 위해 현재 로그인한 유저 정보를 가져옴.
  const {data:meData} = useMe();

  const files = route.params.file;

  console.log(route.params)

  const [purePhotoArr,setPurePhotoArr] = useState(files);
  const [croppedPhotoArr,setCroppedPhotoArr] = useState(files);
  
  useEffect(()=>{
    const beforeEditVideo = route.params.pureVideoFile;
    const editedVideo = route.params.newVideoFile;
    const editedVideoThumbNail = route.params.forIOSThumbNailUri;
    
    const editedFileObj = {
      uri:editedVideo,
      isVideo:true,
      forIOSThumbNailUri:editedVideoThumbNail,
    };
    
    const changePhotoArrayWithEdittedVideo = (prev:FileInfo[]) => {
      const newArray = prev.map(file=>{
        if(file.uri === beforeEditVideo) {
          return editedFileObj;
        } else {
          return file;
        }
      });
      return newArray;
    };

    if(editedVideo) {
      setPurePhotoArr(prev=>changePhotoArrayWithEdittedVideo(prev));
      setCroppedPhotoArr(prev=>changePhotoArrayWithEdittedVideo(prev));
      setBigImage(editedFileObj);
    }
  },[route]);

  // 업로드에 쓰고 캐시 변경도 해야 되서 여기 선언. 근데 getMePosts 캐시 변경을 안해서 안쓰는중.
  let firstVideoPhoto;
  let isFirstVideo = false;

  // 업로드 이후 캐시 변경
  const updateUploadPost:MutationUpdaterFunction<uploadPost, uploadPostVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    const {data:{uploadPost:{ok,error,uploadedPost}}} = result;
    
    // 파일 업로드 오류시 에러메세지 보여줌
    if(!ok) {
      return Alert.alert(error,"같은 문제가 지속적으로 발생한다면 문의 주시면 감사드리겠습니다.")
    }

    const newFileUriArr = croppedPhotoArr.map(fileObj => fileObj.uri);

    // 캐시에 넣을 거
    const uploadPostCache = {
      // post 의 id 랑 createdAt
      ...uploadedPost,
      user: meData.me,
      likes: 0,
      caption: getValues("caption") ?? "",
      file: newFileUriArr,
      commentNumber: 0,
      isLiked: false,
      isMine: true,
      firstPhoto: firstVideoPhoto ?? newFileUriArr[0],
      isFirstVideo,
    };

    const postRef = cache.writeFragment({
      id: `Post:${uploadedPost.id}`,
      fragment: gql`
        fragment MyPost on Post {
          id
          createdAt
          user {
            id
            userName
            avatar
          }
          likes
          caption
          file
          commentNumber
          isLiked
          isMine
          firstPhoto
          isFirstVideo
        }
      `,
      data: uploadPostCache,
    });

    // 캐시 변경
    cache.modify({
      id: "ROOT_QUERY",
      fields: {
        seeFollowersFeed(){
          // return [uploadPostCache,...prev]
          // return [postRef,...prev]
          return [ postRef ];
        },
        seeNewPostFeed(){
          // return [uploadPostCache,...prev]
          // return [postRef,...prev]
          return [ postRef ];
        },
        getMePosts(prev){
          const { posts, ...rest } = prev;
          // rest 가 없는 경우도 만들어야 함
          // pagination 이라 얘만 보내줘
          // const newPostArr = [{"__ref":`Post:${uploadedPost.id}`,...uploadPostCache}];
          // return {posts:newPostArr,...rest};
          // return { posts: [ postRef ], ...rest };

          // 얜 또 갑자기 pagination 안먹힘. 걍 통으로 보내
          return { posts: [ postRef, ...posts ], ...rest };
        },
      },
    });
    // 홈 화면으로 이동
    navigation.navigate("FeedTab");
  }
  
  // 업로드 mutation
  const [uploadPostMutation,{loading,data:uploadPostData}] = useMutation<uploadPost,uploadPostVariables>(UPLOAD_POST_MUTATION,{
    update:updateUploadPost
  })

  
  // 큰 사진 이미지
  // const [bigImage,setBigImage] = useState<string>(croppedPhotoArr[0].forIOSThumbNailUri ?? croppedPhotoArr[0].uri);
  const [bigImage,setBigImage] = useState<FileInfo>(croppedPhotoArr[0]);
  

  // 업로드 submit 시에 백엔드로 mutation 실행
  const onValid = async({caption}:IForm) => {

    // 캐시에도 변경해야 되서 바깥에 선언
    // let firstVideoPhoto;
    // let isFirstVideo = false;
    // 이름이 PhotoArr 이런 식인데 비디오도 있음. 이름 변경하거나 해야함.
    const resizedPhotoArr = [];
    // 업로드할 파일을 ReactNativeFile 로 만들어줌.
    const photoArr = croppedPhotoArr.map(async(file,index) => {

      if(index === 0){
        isFirstVideo = file.isVideo ? true : false;
      }

      const uploadFileUri = await compressImageVideoFile(file);

      const convertedFile = new ReactNativeFile({
        uri: uploadFileUri,
        // 이거 이름 다르게 해줘야 함. 안그럼 덮어쓸 수 있음.
        name: `${index}.${file.isVideo ? "mp4" : "jpg"}`,
        //   name: "1.jpg",
        type: file.isVideo ? "video/mp4" : "image/jpeg",
      });

      resizedPhotoArr[index] = convertedFile;

    });

    if(isFirstVideo) {
      firstVideoPhoto = croppedPhotoArr[0].forIOSThumbNailUri
        ??
        await androidGetThumbNail(croppedPhotoArr[0].uri);
    }

    const convertedFirstVideoPhoto = firstVideoPhoto ? new ReactNativeFile({
      uri: firstVideoPhoto,
      name: "videoThumbNail.jpg",
      type: "image/jpeg",
    }) : null;

    await Promise.all(photoArr);
    // 업로드 Mutation

    // const result = {
    //     caption,
    //     photoArr:resizedPhotoArr,
    //     isFirstVideo,
    //     ...(firstVideoPhoto && {firstVideoPhoto:convertedFirstVideoPhoto}),
    //   }

    // console.log("result")
    // console.log(result)

    await uploadPostMutation({
      variables:{
        caption,
        photoArr:resizedPhotoArr,
        isFirstVideo,
        ...(firstVideoPhoto && {firstVideoPhoto:convertedFirstVideoPhoto}),
      },
    });
  }

  // 네비게이션 헤더 설정
  const HeaderRight = () => <TouchableOpacity onPress={handleSubmit(onValid)}>
    <HeaderRightText>완료</HeaderRightText>
  </TouchableOpacity>
  const HeaderRightLoading = () => <ActivityIndicator size="small" color="white" style={{marginRight:10}}/>

  useEffect(() => {
    navigation.setOptions({
      headerLeft:({tintColor}) => (loading || uploadPostData?.uploadPost.ok) ? null : <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="chevron-back-sharp" color={tintColor} size={30} />
      </TouchableOpacity>,
      headerRight:loading ? HeaderRightLoading : HeaderRight,
    });
    // croppedPhotoArr 의존성 받아야 하네.
  },[loading,croppedPhotoArr])

  const [fullImageIndex,setFullImageIndex] = useState(0);
  // 현재 화면 넓이
  const {width} = useWindowDimensions();
  // 각각의 사진 높이/넓이
  const arrayImageWidth = width/4;

  // 올릴 사진 목록 보여줌.
  const renderItem = ({ item:photo, index, drag, isActive }: RenderItemParams<FileInfo>) => {
    const onPressIn = () => {
      // setBigImage(photo.uri)
      setBigImage(photo)
      setFullImageIndex(index);
    }
    // fullImageIndex = index;
    const displayIndex = index + 1;

    const photoUri = () => {
      // 사진은 체크 안해도 되나? 왜 그냥 넘어갔지?
      const thumbNail = photo.forIOSThumbNailUri;
       console.log("thumbNail")
    console.log(thumbNail)
      if(isAndroid){
        return thumbNail ? `data:image/jpeg;base64,${thumbNail}` : photo.uri;
      } else {
        return thumbNail ?? photo.uri;
      }
    };
   
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          onPressIn={onPressIn}
        >
          <FastImage
            style={{ width:arrayImageWidth, height:arrayImageWidth }}
            source={{ uri: photoUri() }}
            // source={{ uri: `data:image/jpeg;base64,${photo.forIOSThumbNailUri}` ?? photo.uri }}
          />
          <SelectedIconContainer>
            <SelectedPhotoComponent>
              <SelectedPhotoComponentText>{displayIndex}</SelectedPhotoComponentText>
            </SelectedPhotoComponent>
          </SelectedIconContainer>
          {/* {photo.isVideo && <IsVideoIconContainer>
            <Entypo name="video-camera" size={14} color="white" />
          </IsVideoIconContainer>} */}
          {photo.isVideo && <VideoIconPositionAbsolute top="7%" left="7%" iconSize={14} />}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };



  // 큰 사진에서 사진 삭제 버튼 눌렀을 떄
  const onFullPhotoDeleteBtnClick = () => {
    const onPressDeleteOk = () => {

      const setNewPhotoArray = prev => {
        const newArr = [...prev];
        newArr.splice(fullImageIndex,1);
        return newArr;
      };

      // 두개 다 해줌.
      setCroppedPhotoArr(prev => setNewPhotoArray(prev));
      setPurePhotoArr(prev => setNewPhotoArray(prev));

      // setBigImage(croppedPhotoArr[0].uri)
      setBigImage(croppedPhotoArr[0])
    };

    Alert.alert("해당 사진을 업로드 목록에서 제외하시겠습니까?",null,[
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: onPressDeleteOk }
    ]);
  };

  // 큰 사진에서 사진 자르기 버튼 눌렀을 떄
  const onFullPhotoCropBtnClick = () => {
    const selectedImage = purePhotoArr[fullImageIndex];
    if(selectedImage.isVideo) {

      navigation.navigate("EditVideo",{
        file:selectedImage.uri
      });

    } else {
      ImagePicker.openCropper({
        // 짜른거 말고 원래 사진을 가져옴.
        path: selectedImage.uri,
        width: 640,
        height: 640,
        mediaType: 'photo',
      }).then(image => {
        const newFileInfo = {
          uri: image.path,
          isVideo: false,
        };
        setCroppedPhotoArr(prev => {
          const newPhotoArray = [...prev];
          newPhotoArray[fullImageIndex] = newFileInfo;
          return newPhotoArray;
        });

        setBigImage(newFileInfo);
      });
    }
  };

  const bigImageWidth = width * 0.9;

  const onDragEnd = ({ data, to }) => {
    setPurePhotoArr(data);
    setCroppedPhotoArr(data);
    setFullImageIndex(to);
  };

  const onPressFullScreen = async() => {
    navigation.navigate("FullScreenVideo",{
      uri: bigImage.uri,
    });
  };

  const bigImageUri = () => {
    const thumbNail = bigImage.forIOSThumbNailUri;
    if(isAndroid){
      // base64 image 는 uri 를 밑에 형식으로 받아야 함.
      return thumbNail ? `data:image/jpeg;base64,${thumbNail}` : bigImage.uri;
    } else {
      return thumbNail ?? bigImage.uri;
    }
  };
  // 화면
  return (
    <Container>
      <KeyboardAwareScrollView>
        {/* 이미지 업로드 안해도 되면 얘랑 밑에 수정 */}
        <FullImageContainer>
          {/* 큰 이미지 위에 삭제 버튼 만듦. 1개 이상일때. */}
          {purePhotoArr.length !== 1 && <FullImageDeleteBtn onPress={onFullPhotoDeleteBtnClick}>
            <Ionicons name="trash" size={24} color="white" />
          </FullImageDeleteBtn>}
          <FullImageCropBtn onPress={onFullPhotoCropBtnClick}>
            <Ionicons name={bigImage.isVideo ? "ios-cut-sharp" : "ios-crop-sharp"} size={24} color="white" />
          </FullImageCropBtn>
          {/* <Photo source={{uri:bigImage}} resizeMode="contain" /> */}
          <FastImage
            style={{ height:bigImageWidth, width:bigImageWidth }}
            source={{ uri:bigImageUri() }}
            resizeMode={FastImage.resizeMode.cover}
          />
          {bigImage.isVideo && <VideoIconPositionAbsolute top="10px" left="10px" iconSize={26} />}
          {bigImage.isVideo && <FullImageFullScreenBtn onPress={onPressFullScreen} >
            <MaterialIcons name="fullscreen" size={28} color="white" />
          </FullImageFullScreenBtn>}
        </FullImageContainer>

        <ImageContainer>
          <DraggableFlatList
            data={croppedPhotoArr}
            onDragEnd={onDragEnd}
            // 근데 옮기면 키가 index 라 바뀌는데 괜찮을라나? 되는데 깜빡거림. index 쓰지마
            keyExtractor={(item) => item.uri}
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
            placeholder="내용을 입력해 주세요."
            placeholderTextColor="rgba(0,0,0,0.5)"
            autoCapitalize="none"
            autoCorrect={false} 
            onChangeText={(text)=>setValue("caption",text)}
            onSubmitEditing={handleSubmit(onValid)}
            returnKeyType="done"
          />
        </CaptionContainer>
      </KeyboardAwareScrollView>
    </Container>
  );
})
export default UploadFormIOS;
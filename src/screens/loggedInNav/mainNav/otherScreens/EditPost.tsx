import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, useWindowDimensions } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { editPost, editPostVariables } from "../../../../__generated__/editPost";
import { ReactNativeFile } from "apollo-upload-client";
import styled from "styled-components/native";
import { colors } from "../../../../color";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import FastImage from "react-native-fast-image";
import { Entypo ,Ionicons, MaterialIcons } from "@expo/vector-icons";
import ImagePicker from 'react-native-image-crop-picker';
import { Controller, useForm } from "react-hook-form";
import useIsDarkMode from "../../../../hooks/useIsDarkMode";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import compressImageVideoFile from "../../../../logic/compressImageVideoFile";
import androidGetThumbNail from "../../../../logic/androidGetThumbNail";
import { isAndroid } from "../../../../utils";
import VideoIconPositionAbsolute from "../../../../components/video/VideoIconPositionAbsolute";

const EDIT_POST = gql`
  mutation editPost(
    $id:Int!
    $caption:String
    # addPhotoArr:[addPhotoObj],
    # 그래서 그냥 파일과 인덱스를 따로 받음. 안헷갈리게 주의. 순서가 같아야 하는거 중요.
    $addPhotoArr:[Upload],
    $addPhotoIndexArr:[Int],
    $deletePhotoArr:[String],
    # wholePhotoArr 는 addPhotoIndex 자리를 "" 로 해줘야함. 꼭 확인
    $wholePhotoArr:[String],
    $isFirstVideo:Boolean,
    $firstVideoPhoto:Upload,
  ){
    editPost(
      id:$id,
      caption:$caption,
      addPhotoArr:$addPhotoArr,
      addPhotoIndexArr:$addPhotoIndexArr,
      deletePhotoArr:$deletePhotoArr,
      wholePhotoArr:$wholePhotoArr,
      isFirstVideo:$isFirstVideo,
      firstVideoPhoto:$firstVideoPhoto
    ){
      ok
      error
    }
  }
`;

const Container = styled.View`
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
`;
const FullImageContainer = styled.View`
  position: relative;
  /* justify-content: center; */
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
  /* color: white; */
  color: ${props=>props.theme.textColor};
  margin-top: 3px;
`;
const Caption = styled.TextInput`
  /* background-color: white; */
  background-color: ${props=>props.theme.textInputBackgroundColor};
  /* color: black; */
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

const PlusPhotoContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 3px;
`;
const PlusPhotoBtn = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
`;
const PlusPhotoText = styled.Text<{isAndroid:boolean}>`
  color: ${props=>props.theme.textColor};
  font-weight: ${props=>props.isAndroid ? 'bold' : 700};;
  font-size: 15px;
`;

type FormData = {
  caption: string;
};

type FileInfo = {
  uri:string
  isVideo:boolean
  thumbNail?:string
}

type EditPostPropsType = {
  postId?:number,
  // file?:string[],
  fileInfoArr?:FileInfo[]
  caption?:string
  plusPhoto?:FileInfo[]
  newVideoFile?:string
  pureVideoFile?:string
  thumbNail?:string
}

type NativeStackParamList = {
  EditPost:EditPostPropsType
  PlusPhoto:{
    maxPhotoNumber:number,
  }
  EditNetworkVideo:{
    file:string,
  }
  FullScreenVideo:{
    uri:string,
  }
}

type NavigationProps = NativeStackScreenProps<NativeStackParamList,"EditPost">

// UploadFormIOS 랑 거의 비슷

const EditPost = gestureHandlerRootHOC(({navigation,route}:NavigationProps) => {

  const prevFileInfoArr = route.params.fileInfoArr;

  // state 로 지정. PlusPhoto 갔다오면 route.params.file 이 없어지니까
  const [postId,setPostId] = useState(route.params.postId);
  // const [prevFiles,setPrevFiles] = useState(route.params.file);
  const [prevFiles,setPrevFiles] = useState(prevFileInfoArr);
  const [prevCaption,setPrevCaption] = useState(route.params.caption);

  const plusPhoto = route.params.plusPhoto;

  const [editPost,{loading}] = useMutation<editPost,editPostVariables>(EDIT_POST);

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      caption: prevCaption,
    }
  });

  // 사진 수정할때 원본 필요해서
  const [purePhotoUriArr,setPurePhotoUriArr] = useState(prevFileInfoArr);
  // 수정된 사진 목록
  const [croppedPhotoUriArr,setCroppedPhotoUriArr] = useState(prevFileInfoArr);
  
  console.log("route.params")
  console.log(route.params)
  useEffect(()=>{
    const beforeEditVideo = route.params.pureVideoFile;
    const editedVideo = route.params.newVideoFile;
    const editedVideoThumbNail = route.params.thumbNail;
    
    const editedFileObj = {
      uri:editedVideo,
      isVideo:true,
      thumbNail:editedVideoThumbNail,
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
      setPurePhotoUriArr(prev=>changePhotoArrayWithEdittedVideo(prev));
      setCroppedPhotoUriArr(prev=>changePhotoArrayWithEdittedVideo(prev));
      setBigImage(editedFileObj);
    }
  },[route]);

  useEffect(()=>{
    if(plusPhoto){
      setPurePhotoUriArr(prev=>[...plusPhoto,...prev]);
      setCroppedPhotoUriArr(prev=>[...plusPhoto,...prev]);
    }
  },[plusPhoto])

  const [deletePhotoArr,setDeletePhotoArr] = useState<string[]>([]);

  // 캐시, mutation 둘 다 쓰임
  let isFirstVideo;
  let firstVideoPhoto;

  // 업로드 이후 캐시 변경
  const updateEditPost:MutationUpdaterFunction<editPost,editPostVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    const {data:{editPost:{ok,error}}} = result;
    
    // 파일 업로드 오류시 에러메세지 보여줌
    if(!ok) {
      return Alert.alert(error,"같은 문제가 지속적으로 발생한다면 문의 주시면 감사드리겠습니다.")
    }

    const getOnlyUriFromArr = croppedPhotoUriArr.map(file=>file.uri);
    console.log("getOnlyUriFromArr");
    console.log(getOnlyUriFromArr);
    // 캐시 변경
    cache.modify({
      id:`Post:${postId}`,
      fields:{
        caption(){
          return getValues("caption");
        },
        file(){
          return getOnlyUriFromArr;
        },
        firstVideoPhoto(prev){
          return firstVideoPhoto ?? prev;
        },
        isFirstVideo(prev){
          return isFirstVideo ?? prev;
        },
      }
    })


    //확인메세지
    Alert.alert("게시물이 수정되었습니다.");
    // 홈 화면으로 이동
    navigation.goBack();
  };
  

  
  // 큰 사진 이미지
  const [bigImage,setBigImage] = useState(croppedPhotoUriArr[0]);

  // 업로드 submit 시에 백엔드로 mutation 실행
  const onValid = async({caption}:FormData) => {

    // 순서 바뀐것도 반영. 사진 부분에 뭐든 변경사항 있는지 확인.
    const isPhotoChanged = JSON.stringify(croppedPhotoUriArr) !== JSON.stringify(prevFiles);
    const isCaptionChanged = caption !== prevCaption;
    
    const nothingChanged = !isPhotoChanged && !isCaptionChanged;

    // 변경사항 없을 시 돌아감.
    if(nothingChanged) {
      return navigation.goBack();
    };
    
    const addFileBeforeConvertedArr = [];
    const addPhotoArr = [];
    const addPhotoIndexArr = [];
    const wholePhotoArr = [];
    // 얘는 캐시에서도 쓰여서 외부에 선언
    // let isFirstVideo;
    // let firstVideoPhoto;

    // addFunctionArr 는 쓸 애는 아니고 그냥 로직 실행을 위한 애. foreach 는 안됨.
    const addFunctionArr = croppedPhotoUriArr.map((file,index)=>{
      const isNewPhoto = !prevFiles.some(prevFile => prevFile.uri === file.uri);
      if(isNewPhoto){
        if(index === 0){
          isFirstVideo = file.isVideo ? true : false;
        }
        addFileBeforeConvertedArr.push({
          uri: file.uri,
          isVideo: file.isVideo,
        });
        addPhotoIndexArr.push(index);
        wholePhotoArr.push("");
      } else {
        wholePhotoArr.push(file.uri);
      }
    });
    
    // 얘만 await 들어가서 addFunctionArr 밖으로 뺌.
    if(isFirstVideo) {
      firstVideoPhoto = croppedPhotoUriArr[0].thumbNail
        ??
        await androidGetThumbNail(croppedPhotoUriArr[0].uri);
    }

    // 업로드할 파일을 ReactNativeFile 로 만들어 주고 addPhotoArr 에 순서 맞게 넣음.
    const photoArr = addFileBeforeConvertedArr.map(async(file,index) => {
      const uploadFileUri = await compressImageVideoFile(file);
      
      const convertedPhoto = new ReactNativeFile({
        uri: uploadFileUri,
        name: `${index}.${file.isVideo ? "mp4" : "jpg"}`,
        type: file.isVideo ? "video/mp4" : "image/jpeg",
      });
      
      addPhotoArr[index] = convertedPhoto;
    });

    let convertedFirstVideoPhoto;
    if(firstVideoPhoto) {
      convertedFirstVideoPhoto = new ReactNativeFile({
        uri: firstVideoPhoto,
        name: "videoThumbNail.jpg",
        type: "image/jpeg",
      });
    }

    await Promise.all(photoArr);
    
    const isAddPhoto = addPhotoArr.length !== 0;
    const isDeletePhoto = deletePhotoArr.length !== 0;
    // const deleteFileUriArr = deletePhotoArr.map(file=>file.uri);
    const isFirstVideoIsBoolean = typeof isFirstVideo == "boolean";

    // 업로드 Mutation. 완료시 Alert 랑 navigation 은 update 에 작성
    // const EditPostVariable = {
    //   id:postId,
    //   ...(isAddPhoto && {
    //     // 얘는 쌍으로 가야해서 그냥 쌍으로 넣음
    //     addPhotoArr,
    //     addPhotoIndexArr
    //   }),
    //   ...(firstVideoPhoto && {firstVideoPhoto:convertedFirstVideoPhoto}),
    //   ...(isFirstVideoIsBoolean && {isFirstVideo}),
    //   ...(isDeletePhoto && {deletePhotoArr}),
    //   ...(isPhotoChanged && {wholePhotoArr}),
    //   ...(isCaptionChanged && {caption}),
    // };
    // console.log("EditPostVariable")
    // console.log(EditPostVariable)

    await editPost({
      variables:{
        id:postId,
        ...(isAddPhoto && {
          // 얘는 쌍으로 가야해서 그냥 쌍으로 넣음
          addPhotoArr,
          addPhotoIndexArr
        }),
        ...(firstVideoPhoto && {firstVideoPhoto:convertedFirstVideoPhoto}),
        ...(isFirstVideoIsBoolean && {isFirstVideo}),
        ...(isDeletePhoto && {deletePhotoArr}),
        ...(isPhotoChanged && {wholePhotoArr}),
        ...(isCaptionChanged && {caption}),
      },
      update:updateEditPost,
    });

  };

  // 네비게이션 헤더 설정
  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit(onValid)}>
      <HeaderRightText>완료</HeaderRightText>
    </TouchableOpacity>
  );

  const HeaderRightLoading = () => <ActivityIndicator size="small" color="white" style={{marginRight:10}}/>;

  useEffect(() => {
    navigation.setOptions({
      headerLeft:({tintColor}) => loading ? null : <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="chevron-back-sharp" color={tintColor} size={30} />
      </TouchableOpacity>,
      headerRight:loading ? HeaderRightLoading : HeaderRight,
    });
  // 얘는 croppedPhotoUriArr 을 의존성에 넣어줘야해. 왠진 몰라. UploadForm 에선 안넣어도 되는데. 흠..
  },[loading,croppedPhotoUriArr]);

  const [fullImageIndex,setFullImageIndex] = useState(0);
  // 현재 화면 넓이
  const {width} = useWindowDimensions();
  // 각각의 사진 높이/넓이
  const arrayImageWidth = width/4;

  // 올릴 사진 목록 보여줌.
  const renderItem = ({ item, index, drag, isActive }: RenderItemParams<FileInfo>) => {
    const onPressIn = () => {
      setBigImage(item)
      setFullImageIndex(index);
    }
    // fullImageIndex = index;
    const displayIndex = index + 1;

    const photoUri = () => {
      const thumbNail = item.thumbNail;
      if(isAndroid){
        return thumbNail ? `data:image/jpeg;base64,${thumbNail}` : item.uri;
      } else {
        return thumbNail ?? item.uri;
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
            source={{ uri:photoUri() }}
          />
          <IconContainer>
            <SelectedPhotoComponent>
              <SelectedPhotoComponentText>{displayIndex}</SelectedPhotoComponentText>
            </SelectedPhotoComponent>
          </IconContainer>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };



  // 큰 사진에서 사진 삭제 버튼 눌렀을 떄
  const onFullPhotoDeleteBtnClick = () => {
    const onPressDeleteOk = () => {

      setDeletePhotoArr(prev=>{
        const newDeletePhotoArr = [...prev];
        // purePhotoUriArr 에서 넣음. prev 는 index 가 안맞을 수 있고 crop 은 uri 가 다를 수 있어.
        const isPrevFile = prevFiles.some(file=>file.uri === purePhotoUriArr[fullImageIndex].uri);
        if(isPrevFile){
          newDeletePhotoArr.push(purePhotoUriArr[fullImageIndex].uri);
        }
        return newDeletePhotoArr;
      });

      const setNewPhotoArray = prev => {
        const newArr = [...prev];
        newArr.splice(fullImageIndex,1);
        return newArr;
      };

      // 두개 다 해줌.
      setCroppedPhotoUriArr(prev => setNewPhotoArray(prev));
      setPurePhotoUriArr(prev => setNewPhotoArray(prev));

      setBigImage(croppedPhotoUriArr[0])
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

    const selectedImage = purePhotoUriArr[fullImageIndex];
    if(selectedImage.isVideo) {
      
      navigation.navigate("EditNetworkVideo",{
        file:selectedImage.uri
      });
      // 캐시를 받거나.. 저장 하고 하거나.. 어떻게 할까나..
      // 일단은 아예 안보이게 만들어

    } else{
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
        setCroppedPhotoUriArr(prev => {
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
    setPurePhotoUriArr(data);
    setCroppedPhotoUriArr(data);
    setFullImageIndex(to);
  };

  const isDarkMode = useIsDarkMode();

  const onPressPlusPhoto = () => {
    navigation.navigate("PlusPhoto",{
      maxPhotoNumber: 10 - croppedPhotoUriArr.length,
    });
  };

  const onPressFullScreen = async() => {
    navigation.navigate("FullScreenVideo",{
      uri: bigImage.uri,
    });
  };

  const bigImageUri = () => {
    const thumbNail = bigImage.thumbNail;
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
          {purePhotoUriArr.length !== 1 && <FullImageDeleteBtn onPress={onFullPhotoDeleteBtnClick}>
            <Ionicons name="trash" size={24} color="white" />
          </FullImageDeleteBtn>}
          {/* 안드로이드는 Trimmer 가 원격 동영상 못받음. 캐시 받던가 해야함. */}
          {!(bigImage.isVideo && isAndroid) && <FullImageCropBtn onPress={onFullPhotoCropBtnClick}>
            <Ionicons name={bigImage.isVideo ? "ios-cut-sharp" : "ios-crop-sharp"} size={24} color="white" />
          </FullImageCropBtn>}
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

        <PlusPhotoContainer>
          <PlusPhotoBtn onPress={onPressPlusPhoto}>
            <Entypo name="plus" size={24} color={isDarkMode ? "white" : "black"} />
            <PlusPhotoText isAndroid={isAndroid} >사진 추가</PlusPhotoText>
          </PlusPhotoBtn>
        </PlusPhotoContainer>

        <ImageContainer>
          <DraggableFlatList
            data={croppedPhotoUriArr}
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
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Caption
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="내용을 입력해 주세요."
                placeholderTextColor="rgba(0,0,0,0.5)"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={handleSubmit(onValid)}
                returnKeyType="done"
              />
            )}
            name="caption"
          />
        </CaptionContainer>
      </KeyboardAwareScrollView>
    </Container>
  );
});

export default EditPost;
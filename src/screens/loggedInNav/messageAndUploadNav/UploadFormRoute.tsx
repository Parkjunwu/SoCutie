// import { NavigatorScreenParams } from "@react-navigation/native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, Alert, TouchableOpacity, useWindowDimensions } from "react-native";
// import {Ionicons} from "@expo/vector-icons"
// import styled from "styled-components/native";
// import { useForm } from "react-hook-form";
// import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
// import { ReactNativeFile } from "apollo-upload-client";
// import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
// import { colors } from "../../../color";
// import { uploadPost, uploadPostVariables } from "../../../__generated__/uploadPost";
// import useMe from "../../../hooks/useMe";
// import { gestureHandlerRootHOC } from "react-native-gesture-handler";
// import FastImage from 'react-native-fast-image'
// import ImagePicker from 'react-native-image-crop-picker';
// import ImageResizer from 'react-native-image-resizer';
// import ImageSize from 'react-native-image-size';
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// // import ImageEditor from "@react-native-community/image-editor";

import PlusFileFormPetLog from "./PlusFileFormPetLog";
import UploadFormIOS from "./UploadFormIOS";

// const UPLOAD_POST_MUTATION = gql`
// # 만들다 말아서 걍 주석처리함
//   # mutation uploadPost ($photoArr:[Upload]!, $caption:String, $isFirstVideo:Boolean) {
//   #   uploadPost (photoArr:$photoArr, caption:$caption, isFirstVideo:$isFirstVideo) {
//   mutation uploadPost ($photoArr:[Upload]!, $caption:String) {
//     uploadPost (photoArr:$photoArr, caption:$caption) {
//       ok
//       error
//       uploadedPost {
//         # 얘네 두개만 받고 나머지는 어차피 유저 정보로 캐시 만들면 되니까. 근데 캐시 귀찮으면 위에처럼 데이터 다 받아서 걔를 그냥 넣어<div className=""></div>
//         id
//         createdAt
//       }
//     }
//   }
// `;

// const Container = styled.View`
//   flex: 1;
//   background-color: ${props=>props.theme.backgroundColor};
// `;
// const FullImageContainer = styled.View`
//   position: relative;
//   /* justify-content: center; */
//   align-items: center;
// `;
// const FullImageDeleteBtn = styled.TouchableOpacity`
//   z-index: 1;
//   position: absolute;
//   top: 10px;
//   right: 7%;
// `;
// const FullImageCropBtn = styled.TouchableOpacity`
//   z-index: 1;
//   position: absolute;
//   top: 10px;
//   right: 14%;
// `;
// // const Photo = styled.Image`
// //   height: 350px;
// // `;
// const ImageContainer = styled.View`
//   margin-top: 20px;
//   margin-left: auto;
//   margin-right: auto;
// `;
// const IconContainer = styled.View`
//   position: absolute;
//   bottom: 10%;
//   right: 10%;
// `;
// const SelectedPhotoComponent = styled.View`
//   width: 15px;
//   height: 15px;
//   border-radius: 10px;
//   background-color: yellow;
// `;
// const SelectedPhotoComponentText = styled.Text`
//   font-size: 12px;
//   text-align: center;
// `;
// const CaptionContainer = styled.View`
//   margin-top: 30px;
// `;
// const AnnounceText = styled.Text`
//   font-size: 15px;
//   text-align: center;
//   /* color: white; */
//   color: ${props=>props.theme.textColor};
//   margin-top: 3px;
// `;
// const Caption = styled.TextInput`
//   /* background-color: white; */
//   background-color: ${props=>props.theme.textInputBackgroundColor};
//   /* color: black; */
//   color: ${props=>props.theme.textColor};
//   padding: 10px 20px;
//   border-radius: 100px;
// `;
// const HeaderRightText = styled.Text`
//   color:${colors.blue};
//   font-size: 16px;
//   font-weight: 600;
//   margin-right: 7px;
// `;

// type TabParamList = {
//   FeedTab:undefined;
//   SearchTab:undefined;
//   CameraTab:undefined;
//   NotificationTab:undefined;
//   MeTab:undefined;
// };
// type FileInfo = {
//   uri: string,
//   isVideo: boolean,
// }
// type NativeStackParamList = {
//   Tabs:NavigatorScreenParams<TabParamList>;
//   Upload:undefined;
//   UploadForm:{
//     file:FileInfo[],
//     newVideoFile?:string,
//     pureVideoFile?:string,
//   };
//   ////
//   FeedTab:undefined;
//   ////
//   EditVideo:{
//     file:string,
//   };
// };
// type Props = NativeStackScreenProps<NativeStackParamList,"UploadForm">
// interface IForm {
//   caption: string;
// }

// // 이렇게 쓰면 사진 여러번 올려도 안바뀜.
// // let fullImageIndex = 0;

// const UploadForm = gestureHandlerRootHOC(({navigation,route}:Props) => {
//   // TextInput 을 위한 useForm
//   const {register,handleSubmit,setValue,getValues} = useForm<IForm>();

//   useEffect(() => {
//     register("caption");
//   },[register]);

//   // 캐시를 위해 현재 로그인한 유저 정보를 가져옴.
//   const {data} = useMe();

//   const files = route.params.file;

//   // navigation 으로 받은 파일 uri 목록
//   // const [photoUriArr,setPhotoUriArr] = useState(files);
//   // const [purePhotoArr,setPurePhotoArr] = useState(files);
//   // const [croppedPhotoArr,setCroppedPhotoArr] = useState(files);
//   const [purePhotoArr,setPurePhotoArr] = useState(files);
//   const [croppedPhotoArr,setCroppedPhotoArr] = useState(files);
  
//   useEffect(()=>{
//     const beforeEditVideo = route.params.pureVideoFile;
//     const edittedVideo = route.params.newVideoFile;
//     const changePhotoArrayWithEdittedVideo = (prev:FileInfo[]) => {
//       const newArray = prev.map(file=>{
//         if(file.uri === beforeEditVideo) {
//           return {
//             uri:edittedVideo,
//             isVideo:true,
//           };
//         } else {
//           return file;
//         }
//       });
//       return newArray;
//     }
//     if(edittedVideo) {
//       setPurePhotoArr(prev=>changePhotoArrayWithEdittedVideo(prev));
//       setCroppedPhotoArr(prev=>changePhotoArrayWithEdittedVideo(prev));
//     }
//     // dependency 를 route 로 넣어도 작동하나?
//   },[route]);


//   /////
//   // useEffect(()=>{
//   //   const sendArray = croppedPhotoArr.map(photo=>{
//   //     const length = photo.length;
//   //     return photo.slice(-7,length-5);
//   //   })
//   //   console.log("가는 애들")
//   //   console.log(sendArray)
//   // },croppedPhotoArr)
//   //////
  
//   // 업로드 이후 캐시 변경
//   const updateUploadPost:MutationUpdaterFunction<uploadPost, uploadPostVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
//     const {data:{uploadPost:{ok,error,uploadedPost}}} = result;
    
//     // 파일 업로드 오류시 에러메세지 보여줌
//     if(!ok) {
//       Alert.alert(error,"같은 문제가 지속적으로 발생한다면 문의 주시면 감사드리겠습니다.")
//     }

//     // 캐시에 넣을 거
//     const uploadPostCache = {
//       // post 의 id 랑 createdAt
//       ...uploadedPost,
//       // __typeName 도 받는데 괜찮나?
//       user:data.me,
//       likes:0,
//       caption:getValues("caption"),
//       file:croppedPhotoArr,
//       commentNumber:0,
//       isLiked:false,
//       isMine:true,
//     };
//     // 캐시 변경
//     cache.modify({
//       id:"ROOT_QUERY",
//       fields:{
//         seeFollowersFeed(prev){
//           return [uploadPostCache,...prev]
//         },
//         seeNewPostFeed(prev){
//           return [uploadPostCache,...prev]
//         },
//         getMePosts(prev){
//           const {posts,...rest} = prev;
//           const newPostArr = [{"__ref":`Post:${uploadedPost.id}`},...posts];
//           return {posts:newPostArr,...rest};
//         }
//       }
//     });
//     // 홈 화면으로 이동
//     navigation.navigate("FeedTab");
//   }
  
//   // 업로드 mutation
//   const [uploadPostMutation,{loading,data:uploadPostData}] = useMutation<uploadPost,uploadPostVariables>(UPLOAD_POST_MUTATION,{
//     update:updateUploadPost
//   })

  
//   // 큰 사진 이미지
//   const [bigImage,setBigImage] = useState<string>(croppedPhotoArr[0].uri);

//   // 업로드 submit 시에 백엔드로 mutation 실행
//   const onValid = async({caption}:IForm) => {

//     // let isFirstVideo;
//     const resizedPhotoArr = [];
//     // 업로드할 파일을 ReactNativeFile 로 만들어줌.
//     const photoArr = croppedPhotoArr.map(async(photo,index) => {
//       const { width, height } = await ImageSize.getSize(photo.uri);

//       ////////
//         // const cropData = {
//         //   offset: {x: number, y: number},
//         //   size: {width: number, height: number},
//         //   displaySize: {width: number, height: number},
//         //   resizeMode: 'contain' | 'cover' | 'stretch',
//         // };

//         // ImageEditor.cropImage(uri, cropData).then(url => {
//         //   console.log("Cropped image uri", url);
//         // })

//         ///// 여기서 이미지 사이즈, 용량 조절 /////
//         // 안자른 애는.. 그냥 올려야겠군.

//         ///////////
      
//       let uploadImageUri;
//       if(width>1080 || height>1080) {

//         const resizedImage = await ImageResizer.createResizedImage(photo.uri, 1080, 1080, "JPEG", 90, 0, null, false, {onlyScaleDown:true});
//         console.log(resizedImage.size)
//         uploadImageUri = resizedImage.uri;
//       } else {
//         uploadImageUri = photo.uri;
//       }
      
//       // return new ReactNativeFile({
//       //   uri:uploadImageUri,
//       //   name: "1.jpg",
//       //   type: "image/jpeg",
//       // });
//       const convertedFile = new ReactNativeFile({
//         uri:uploadImageUri,
//         // 이거 이름 다르게 해줘야 함. 안그럼 덮어쓸 수 있음.
//         name: `${index}.jpg`,
//         type: "image/jpeg",
//       });

//       resizedPhotoArr[index] = convertedFile;
//     });

//     // const resizedPhotoArr = await Promise.all(photoArr);
//     await Promise.all(photoArr);
//     console.log(resizedPhotoArr);
//     // 업로드 Mutation
//     await uploadPostMutation({
//       variables:{
//         caption,
//         photoArr:resizedPhotoArr,
//       },
//     });
//   }

//   // 네비게이션 헤더 설정
//   const HeaderRight = () => <TouchableOpacity onPress={handleSubmit(onValid)}>
//     <HeaderRightText>완료</HeaderRightText>
//   </TouchableOpacity>
//   const HeaderRightLoading = () => <ActivityIndicator size="small" color="white" style={{marginRight:10}}/>

//   useEffect(() => {
//     navigation.setOptions({
//       headerLeft:({tintColor}) => (loading || uploadPostData?.uploadPost.ok) ? null : <TouchableOpacity onPress={()=>navigation.goBack()}>
//         <Ionicons name="chevron-back-sharp" color={tintColor} size={30} />
//       </TouchableOpacity>,
//       headerRight:loading ? HeaderRightLoading : HeaderRight,
//     });
//     // croppedPhotoArr 의존성 받아야 하네.
//   },[loading,croppedPhotoArr])

//   const [fullImageIndex,setFullImageIndex] = useState(0);
//   // 현재 화면 넓이
//   const {width} = useWindowDimensions();
//   // 각각의 사진 높이/넓이
//   const arrayImageWidth = width/4;

//   // 올릴 사진 목록 보여줌.
//   const renderItem = ({ item:photo, index, drag, isActive }: RenderItemParams<FileInfo>) => {
//     const onPressIn = () => {
//       setBigImage(photo.uri)
//       setFullImageIndex(index);
//     }
//     // fullImageIndex = index;
//     const displayIndex = index + 1;
//     return (
//       <ScaleDecorator>
//         <TouchableOpacity
//           onLongPress={drag}
//           onPressIn={onPressIn}
//         >
//           <FastImage
//             style={{ width:arrayImageWidth, height:arrayImageWidth }}
//             source={{ uri: photo.uri }}
//           />
//           <IconContainer>
//             <SelectedPhotoComponent>
//               <SelectedPhotoComponentText>{displayIndex}</SelectedPhotoComponentText>
//             </SelectedPhotoComponent>
//           </IconContainer>
//         </TouchableOpacity>
//       </ScaleDecorator>
//     );
//   };



//   // 큰 사진에서 사진 삭제 버튼 눌렀을 떄
//   const onFullPhotoDeleteBtnClick = () => {
//     const onPressDeleteOk = () => {

//       const setNewPhotoArray = prev => {
//         const newArr = [...prev];
//         newArr.splice(fullImageIndex,1);
//         return newArr;
//       };

//       // 두개 다 해줌.
//       setCroppedPhotoArr(prev => setNewPhotoArray(prev));
//       setPurePhotoArr(prev => setNewPhotoArray(prev));

//       setBigImage(croppedPhotoArr[0].uri)
//     };

//     Alert.alert("해당 사진을 업로드 목록에서 제외하시겠습니까?",null,[
//       {
//         text: "Cancel",
//         style: "cancel"
//       },
//       { text: "OK", onPress: onPressDeleteOk }
//     ]);
//   };

//   // 큰 사진에서 사진 자르기 버튼 눌렀을 떄
//   const onFullPhotoCropBtnClick = () => {
//     console.log("purePhotoArr")
//     console.log(purePhotoArr)
//     console.log("fullImageIndex")
//     console.log(fullImageIndex)
//     console.log("path")
//     console.log(purePhotoArr[fullImageIndex])
//     const selectedImage = purePhotoArr[fullImageIndex];
//     if(selectedImage.isVideo) {

//       navigation.navigate("EditVideo",{
//         file:selectedImage.uri
//       });

//     } else {
//       ImagePicker.openCropper({
//         // 짜른거 말고 원래 사진을 가져옴.
//         path: selectedImage.uri,
//         width: 640,
//         height: 640,
//         mediaType: 'photo',
//       }).then(image => {
//         setCroppedPhotoArr(prev => {
//           const newPhotoArray = [...prev];
//           newPhotoArray[fullImageIndex] = {
//             uri: image.path,
//             isVideo: false,
//           };
//           return newPhotoArray;
//         });

//         // 얘로 확인해봐. 만약 얘랑 setBigImage(image.path); 가 다르면 setCroppedPhotoArr 수정. 아니면 fullImageIndex 확인.
//         // setBigImage(croppedPhotoArr[fullImageIndex]);
//         setBigImage(image.path);
//       });
//     }
//   };

//   const bigImageWidth = width * 0.9;

//   const onDragEnd = ({ data, to }) => {
//     setPurePhotoArr(data);
//     setCroppedPhotoArr(data);
//     setFullImageIndex(to);
//   };

//   // 화면
//   return (
//     // 얜 왜 이래해도 되는거지
//     // <KeyboardAvoidingView
//     //   // behavior={Platform.OS === "ios" ? "padding" : "height"}
//     //   // android 는 좀 위까지 안눌려짐. 근데 다른거는 아예 KeyboardAvoidingView 자체가 안되서 일단 이걸로 함.
//     //   behavior="position"
//     //   style={{flex:1,backgroundColor:"white"}}
//     //   contentContainerStyle={{flex:1}}
//     //   keyboardVerticalOffset={-50}
//     // >
//     // DismissKeyboard 없어도 잘 되네
//     // <DismissKeyboard>
//       <Container>
//       <KeyboardAwareScrollView>
//         {/* 이미지 업로드 안해도 되면 얘랑 밑에 수정 */}
//         <FullImageContainer>
//           {/* 큰 이미지 위에 삭제 버튼 만듦. 1개 이상일때. */}
//           {purePhotoArr.length !== 1 && <FullImageDeleteBtn onPress={onFullPhotoDeleteBtnClick}>
//             <Ionicons name="trash" size={24} color="grey" />
//           </FullImageDeleteBtn>}
//           <FullImageCropBtn onPress={onFullPhotoCropBtnClick}>
//             <Ionicons name="ios-crop-sharp" size={24} color="grey" />
//           </FullImageCropBtn>
//           {/* <Photo source={{uri:bigImage}} resizeMode="contain" /> */}
//           <FastImage
//             style={{ height:bigImageWidth, width:bigImageWidth }}
//             source={{ uri:bigImage }}
//             resizeMode={FastImage.resizeMode.cover}
//             // FastImage.resizeMode.contain
//           />
//         </FullImageContainer>

//         <ImageContainer>
//           <DraggableFlatList
//             data={croppedPhotoArr}
//             onDragEnd={onDragEnd}
//             // 근데 옮기면 키가 index 라 바뀌는데 괜찮을라나? 되는데 깜빡거림. index 쓰지마
//             keyExtractor={(item) => item.uri}
//             renderItem={renderItem}
//             horizontal={true}
//             contentContainerStyle={{
//               // 얘를 해야지 세로로 사진이 움직임.
//               flexDirection: 'row',
//             }}
//             bounces={false}
//           />
//         </ImageContainer>
//         <AnnounceText>길게 눌러서 순서를 변경하실 수 있습니다.</AnnounceText>
//         <CaptionContainer>
//           <Caption
//             placeholder="내용을 입력해 주세요."
//             placeholderTextColor="rgba(0,0,0,0.5)"
//             autoCapitalize="none"
//             autoCorrect={false} 
//             onChangeText={(text)=>setValue("caption",text)}
//             onSubmitEditing={handleSubmit(onValid)}
//             returnKeyType="done"
//           />
//         </CaptionContainer>
//     </KeyboardAwareScrollView>
//       </Container>
//     // </DismissKeyboard>
//     // </KeyboardAvoidingView> 
//   );
// })
// export default UploadForm;

const UploadFormRoute = ({navigation,route}) => {
  // const isPetLog = route.params?.whichComponent === "PetLog";
  const whichComponent = route.params?.whichComponent;
  const isPetLog = whichComponent === "UploadPetLog" || whichComponent === "EditPetLog";
  return (
    // isPetLog ?
    isPetLog ?
      <PlusFileFormPetLog navigation={navigation} route={route} />
    :
      <UploadFormIOS navigation={navigation} route={route} />
  );
};

export default UploadFormRoute;
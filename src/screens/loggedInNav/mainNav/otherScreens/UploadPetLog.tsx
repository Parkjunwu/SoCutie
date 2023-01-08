import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../../../color";
import BodyInput from "../../../../components/petLog/BodyInput";
import TitleInput from "../../../../components/petLog/TitleInput";
import { uploadPetLog, uploadPetLogVariables } from "../../../../__generated__/uploadPetLog";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useIsDarkMode from "../../../../hooks/useIsDarkMode";
import { useNavigation, useRoute } from "@react-navigation/native";
import CanChangePositionFile from "../../../../components/petLog/CanChangePositionFile";
import PetLogImageWithRealHeight from "../../../../components/petLog/PetLogImageWithRealHeight";
import UploadGoBackBtn from "../../../../components/upload/UploadGoBackBtn";
import { ReactNativeFile } from "apollo-upload-client";
import compressImageVideoFileByWidth from "../../../../logic/compressImageVideoFileByWidth";
import getOrResizeThumbNail from "../../../../logic/getOrResizeThumbNail";
import resizeImageNeedUriWidthHeight from "../../../../logic/resizeImage";
import useMe from "../../../../hooks/useMe";
import ifMoveEndOfScreenThenAutoScroll from "../../../../components/petLog/logic/ifMoveEndOfScreenThenAutoScroll";
import useRefInterval from "../../../../hooks/useRefInterval";
import useMaterialTabGetInnerLayoutHeight from "../../../../hooks/useMaterialTabGetInnerLayoutHeight";

const UPLOAD_PETLOG = gql`
  mutation uploadPetLog(
    $title: String!,
    $fileArr: [Upload]!,
    $body: [String]!,
    $thumbNail: Upload
  ) {
    uploadPetLog(
      title: $title, 
      fileArr: $fileArr,
      body: $body,
      thumbNail: $thumbNail
    ) {
      ok
      error
      uploadedPetLog {
        id
        createdAt
      }
    }
  }
`;

// 영상도 넣을거면 이거 변경
// type FileInfo = string;
type FileInfo = {
  uri: string,
  isVideo: boolean,
  thumbNail?: string,
};
type CopiedFileInfo = {
  animatedIndex:boolean,
  isEditingFile?:boolean
} & FileInfo;

const UploadBtnText = styled.Text`
  color:${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;
const Input = styled.TextInput`
  padding: 20px 5px;
  line-height: 18px;
  color: ${props=>props.theme.textColor};
`;
// isPhotoTranslateActive,setIsPhotoTranslateActive 이 UploadNav > UploadStackNavGeneratorNeedWhichComponent > UploadPetLog 로 들어와서 AddedImageWithTextInput 까지 감. 헷갈리면 걍 전역으로 빼자
const UploadPetLog = ({isPhotoTranslateActive,setIsPhotoTranslateActive}) => {

  const route = useRoute();
  const navigation = useNavigation();

  const [title,setTitle] = useState("");

  
  const [body,setBody] = useState([""]);

  // 지금은 TextInput 의 bottom 값 + 변화값 을 배열로 받음.
  //   [ [5241,], [5668, 5685,],] 머 이런 식
  const [componentPositionY,setComponentPositionY] = useState([]);
  // console.log("componentPositionY")
  // console.log(componentPositionY)
  // 지금은 라인 바뀌었을 때에 이전 줄의 텍스트 길이들만 받음.
  const [eachLineTextLength,setEachLineTextLength] = useState([]);

  const [nowChangingInputIndex,setNowChangingInputIndex] = useState(0);
  
  const [nowChangingFileIndex,setNowChangingFileIndex] = useState(0);
  
  const [opacityForAnimation,setOpacityForAnimation] = useState(false);

  // const [files,setFiles] = useState<FileInfo[]>(PetLogMockData.map(data=>({uri:data.titleImage,isVideo:false})));
  const [files,setFiles] = useState<FileInfo[]>([]);

  // const [copiedFiles,setCopiedFiles] = useState<CopiedFileInfo[]>(PetLogMockData.map(data=>({ uri:data.titleImage, animatedIndex:false ,isVideo:false })));
  const [copiedFiles,setCopiedFiles] = useState<CopiedFileInfo[]>([]);

  // console.log("files")
  // console.log(files)
  // console.log("copiedFiles")
  // console.log(copiedFiles)

  const [fileAddingPosition,setFileAddingPosition] = useState<{fileIndex:number,insertFront:boolean}>({
    fileIndex:0,
    insertFront:true,
  });

  useEffect(()=>{
    const addedFiles:FileInfo[] = route.params?.files;
    console.log("route.params.files");
    console.log(addedFiles);
    if(addedFiles) {
      const fileIndex = fileAddingPosition.fileIndex;
      const insertFront = fileAddingPosition.insertFront;
      // console.log("fileIndex")
      // console.log(fileIndex)
      // console.log("insertFront")
      // console.log(insertFront)
      setFiles(prev=>{
        if(prev.length === 0) return [...addedFiles];
        // 맞나?
        const inputFilesIndex = insertFront ? fileIndex : fileIndex + 1;
        const frontFileArr = prev.slice(0,inputFilesIndex);
        const endFileArr = prev.slice(inputFilesIndex,prev.length);
        return [...frontFileArr,...addedFiles,...endFileArr];
      });
      setCopiedFiles(prev=>{
        const withPropertyAddedFiles = addedFiles.map(fileInfo=>({
          ...fileInfo,
          animatedIndex:false,
        }));
        if(prev.length === 0) return [...withPropertyAddedFiles];
        // 맞나?
        const inputFilesIndex = insertFront ? fileIndex : fileIndex + 1;
        const frontFileArr = prev.slice(0,inputFilesIndex);
        const endFileArr = prev.slice(inputFilesIndex,prev.length);
        return [...frontFileArr,...withPropertyAddedFiles,...endFileArr];
      });
      setFileAddingPosition(prev=>({
        fileIndex: prev.fileIndex + addedFiles.length,
        insertFront: prev.insertFront,
      }));
      // TextInput 들도 다 바꿔
      setBody(prev=>{
        const inputEmptyStringIndex = fileIndex + 1;
        const frontFileArr = prev.slice(0,inputEmptyStringIndex);
        const endFileArr = prev.slice(inputEmptyStringIndex,prev.length);
        const emptyStringArr = new Array(addedFiles.length).fill("");
        return [...frontFileArr,...emptyStringArr,...endFileArr];
        // 이건 텍스트 어딨는지 받아서 넣는거. 근데 못쓸듯
        // const indexString = prev[inputIndex];
        // const prevStringLength = indexString.length;
        // const frontString = indexString.substring(0,prevStringLength);
        // const behindString = indexString.substring(prevStringLength,prevStringLength);
        // const newArr = [];
        // for(let i=0;i<inputIndex;i++){
        //   newArr[i] = prev[i];
        // }
        // newArr[inputIndex] = frontString;
        // newArr[inputIndex+1] = behindString;
        // const prevStringArrLength = prev.length;
        // for(let i=inputIndex+2;i<prevStringArrLength;i++){
        //   newArr[i] = prev[i-1];
        // }
        // return newArr;
      });
    }
  },[route]);

  // 캐시를 위해 현재 로그인한 유저 정보를 가져옴.
  const {data:meData} = useMe();

  // 업로드, 캐시 에서 쓰임
  // useRef 써야 할라나 얘를 받았다 못받았다 그럼
  // let thumbNail;
  const thumbNail = useRef(null);
  // let convertedBody;
  // thumbNail 도 확인해봐야할듯. convertedBody 가 안됬었어
  // const [thumbNail,setThumbNail] = useState(null);
  // const [convertedBody,setConvertedBody] = useState([""]);

  const updateUploadPetLog: MutationUpdaterFunction<uploadPetLog, uploadPetLogVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    // const {data:{uploadPetLog:{ok,error,uploadedPetLog:{id:uploadedPetLogId,createdAt:uploadedPetLogCreatedAt}}}} = result;
    const {data:{uploadPetLog:{ok,error,uploadedPetLog}}} = result;
    
    // 파일 업로드 오류시 에러메세지 보여줌
    if(!ok) {
      return Alert.alert(error,"같은 문제가 지속적으로 발생한다면 문의 주시면 감사드리겠습니다.")
    };
    
    // 캐시 변경 작성
    const newFileUriArr = files.map(fileObj => fileObj.uri);

    // // 캐시에 넣을 거
    // const uploadPetLogCache = {
    //   // post 의 id 랑 createdAt
    //   // ...uploadedPetLog,
    //   id: uploadedPetLogId,
    //   createdAt: uploadedPetLogCreatedAt,
    //   // __typeName 도 받는데 괜찮나?
    //   // 아님 유저의 ref 를 받거나
    //   user: meData.me,
    //   title,
    //   // 변수 넣으니까 이상해져서 걍 각각 따로 받음
    //   // body: convertedBody,
    //   body: body.map(value=>value ?? ""),
    //   file: newFileUriArr,
    //   // thumbNail: thumbNail ?? null,
    //   thumbNail: thumbNail.current,
    //   likes: 0,
    //   commentNumber: 0,
    //   isLiked: false,
    //   isMine: true,
    // };

    // console.log("uploadPetLogCache")
    // console.log(uploadPetLogCache)

    // > 됬다 안됬다 함. 걍 데이터로 넣음
    // const petLogRef = cache.writeFragment({
    //   id: `PetLog:${uploadedPetLogId}`,
    //   fragment: gql`
    //     fragment MyPetLog on PetLog {
    //       id
    //       createdAt
    //       user {
    //         id
    //         userName
    //         avatar
    //       }
    //       title
    //       body
    //       file
    //       thumbNail
    //       likes
    //       commentNumber
    //       isLiked
    //       isMine
    //     }
    //   `,
    //   data: uploadPetLogCache,
    // });

    // console.log("petLogRef")
    // console.log(petLogRef)

    // 캐시에 넣을 거. ref 말고 그냥 데이터
    // 이러면 잘 되기는 하는데 PetLog 라는걸 인식 못하고 걍 데이터 통으로 들어감. 흠..
    const uploadPetLogCache = {
      // post 의 id, createdAt, __typename
      ...uploadedPetLog,
      user: meData.me,
      title,
      // 변수 넣으니까 이상해져서 걍 각각 따로 받음
      // body: convertedBody,
      body: body.map(value=>value ?? ""),
      file: newFileUriArr,
      // thumbNail: thumbNail ?? null,
      thumbNail: thumbNail.current,
      likes: 0,
      commentNumber: 0,
      isLiked: false,
      isMine: true,
    };

    // seeNewPetLogList, seeFollowersPetLogList, getMePetLogList, getUserPetLogList
    // 캐시 변경
    cache.modify({
      id:"ROOT_QUERY",
      fields:{
        seeNewPetLogList(prev){
          const { petLogs, ...rest } = prev;
          // 뭐지? 위에가 됬다가 밑에가 됬다가 그럼
          // return { petLogs: [ petLogRef, ...petLogs ], ...rest };
          // return { petLogs: [ petLogRef ], ...rest };
          // 걍 데이터로 넣음. 얘는 잘 되는데 PetLog 로 안빠짐.
          return { petLogs: [ uploadPetLogCache, ...petLogs ], ...rest };
        },
        // seeFollowersPetLogList(prev){
        //   return [petLogRef,...prev]
        // },
        getMePetLogs(prev){
          const { petLogs, ...rest } = prev;
          // return { petLogs: [ petLogRef, ...petLogs ], ...rest };
          // return { petLogs: [ petLogRef ], ...rest };
          return { petLogs: [ uploadPetLogCache, ...petLogs ], ...rest };
        },
        // Me 가 아닌 다른데서 프로필 들어왔을 때 얘도 변경해줘야 하는데... 이거보단 Profile 에서 나인 경우에 getUserPetLogs 대신 getMePetLogs 를 받게 하는게 더 나을라나? 넘 복잡해질라나? 글고 이거 쓸라면 pagination 도 바꿔야 할듯 getUserPosts 도.
        // [`getUserPetLogs({userId:${meData.me.id}})`](prev) {
        //   const { petLogs, ...rest } = prev;
        //   return { petLogs: [ petLogRef, ...petLogs ], ...rest };
        // },
      },
    });
    //확인메세지
    Alert.alert("게시물이 업로드 되었습니다.");
    // 홈 화면으로 이동
    navigation.navigate("FeedTab");

  };

  const [uploadPetLog,{loading}] = useMutation<uploadPetLog,uploadPetLogVariables>(UPLOAD_PETLOG,{
    update:updateUploadPetLog,
  });

  const onPressUpload = async() => {
    if(title === "") {
      return Alert.alert("제목을 입력해 주세요.");
    }
    if(files.length === 0 && body.length === 1 && body[0] === "") {
      return Alert.alert("내용을 입력해 주세요.");
    }

    let isFirstVideo = false;


    const resizedFileArr = [];
    
    const photoArr = files.map(async(file,index) => {

      if(index === 0){
        isFirstVideo = file.isVideo ? true : false;
      }

      const uploadFileUri = await compressImageVideoFileByWidth(file);
      
      const convertedFile = new ReactNativeFile({
        uri: uploadFileUri,
        // 이거 이름 다르게 해줘야 함. 안그럼 덮어쓸 수 있음.
        name: `${index}.${file.isVideo ? "mp4" : "jpg"}`,
        //   name: "1.jpg",
        type: file.isVideo ? "video/mp4" : "image/jpeg",
      });

      resizedFileArr[index] = convertedFile;

    });

    // 썸넬을 사진으로 일단 씀. 걍 동영상으로 넣어도 되고
    // 이유는 모르겠으나 thumbNail getThumbNail 변수 따로 해놔야 잘됨.
    let getThumbNail;

    if(files.length !== 0) {
      getThumbNail = isFirstVideo ?
        await getOrResizeThumbNail(files[0])
      :
        await resizeImageNeedUriWidthHeight(files[0].uri,200,200);
        
      // thumbNail = getThumbNail;
      thumbNail.current = getThumbNail;
    }

    const convertedThumbNail = new ReactNativeFile({
      uri: getThumbNail,
      name: "videoThumbNail.jpg",
      type: "image/jpeg",
    });

    await Promise.all(photoArr);

    // 바깥에 선언. 캐시에도 쓰임
    // const convertedBody = body.map(value=>value ?? "");
    // convertedBody = body.map(value=>value ?? "");

    // 이렇게 쓰니까 안받아짐.
    // setConvertedBody(body.map(value=>value ?? ""));
    // const newBody = body.map(value=>value ?? "");

    // setConvertedBody(newBody);

    await uploadPetLog({
      variables:{
        title,
        fileArr: resizedFileArr,
        // 변수에 넣으니까 안받아져 걍 통으로 넣어
        // body: convertedBody,
        body: body.map(value=>value ?? ""),
        // ...(thumbNail && { thumbNail: convertedThumbNail }),
        ...(getThumbNail && { thumbNail: convertedThumbNail }),
      },
    });
  };

  useEffect(()=>{
    const isSomethingWrite = files.length !== 0 || !(body.length === 1 && body[0] === "") || title !== "";
    navigation.setOptions({
      headerRight:({tintColor})=>(
        loading ?
          <UploadBtnText>업로드중..</UploadBtnText>
        :
          <TouchableOpacity onPress={onPressUpload}>
            <UploadBtnText>업로드</UploadBtnText>
          </TouchableOpacity>
      ),
      headerLeft:({tintColor}) => <UploadGoBackBtn tintColor={tintColor} whichComponent="UploadPetLog" alertCheck={isSomethingWrite} />
    });
  },[body,files,title,loading]);

  const { width:windowWidth } = useWindowDimensions();

  const imageWidth = windowWidth - 20;



  // useRef 안됨
  const [scrollViewMoveState,setScrollViewMoveState] = useState("");

  const { height:deviceHeight } = useWindowDimensions();

  // useRef 안됨
  const [nowScrollViewPosition,setNowScrollViewPosition] = useState(0);

  const scrollRef = useRef<ScrollView>();
  const keyboardAwareScrollRef = useRef<KeyboardAwareScrollView>();

  const scrollPositionSetFn = ({nativeEvent:{contentOffset:{y}}}) => {
    setNowScrollViewPosition(y);
    scrollRef.current.scrollTo({y,animated:false});
  };

  // useRef 로
  // const [canScrollDownHeight,setCanScrollDownHeight] = useState(0);
  const canScrollDownHeight = useRef(0);
  
  const innerLayoutHeight = useMaterialTabGetInnerLayoutHeight();

  const paddingTopAndBottom = 20;

  const onContentSizeChange = (w,h) => {
    // ScrollView padding 위아래 10씩 있어서 20 더함
    if(h) {
      // return setCanScrollDownHeight(h + paddingTopAndBottom - innerLayoutHeight);
      return canScrollDownHeight.current = h + paddingTopAndBottom - innerLayoutHeight;
    }
  };

  // useRef 안됨
  const [autoScrollMoveLength,setAutoScrollMoveLength] = useState(0);

  // useRef 로
  // const [dy,setDy] = useState(0);
  const nowDy = useRef(0);

  const delay = scrollViewMoveState === "" ? null : 50;

  const ifMoveEndOfScreenThenAutoScrollFn = () => ifMoveEndOfScreenThenAutoScroll(
    setScrollViewMoveState,
    setNowScrollViewPosition,
    canScrollDownHeight,
    scrollRef,
    setAutoScrollMoveLength,
    setNowChangingFileIndex,
    setComponentPositionY,
    nowDy,
    // files,
    setFiles,
    setCopiedFiles,
    setBody
  );
  
  useRefInterval(ifMoveEndOfScreenThenAutoScrollFn,delay);


  const bodyInputPropsArr = {
    value:body,
    setValue:setBody,
    setFileAddingPosition,
    setEachLineTextLength,
    nowChangingInputIndex,
    setNowChangingInputIndex,
    setComponentPositionY,
    opacityForAnimation,
  };
  
  const canChangePositionFilePropsArr = {
    setBody,
    imageWidth,
    setFiles,
    setIsPhotoTranslateActive,
    setComponentPositionY,
    setOpacityForAnimation,
    setCopiedFiles,
    setNowChangingFileIndex,
    setFileAddingPosition,
    setScrollViewMoveState,
    deviceHeight,
    setAutoScrollMoveLength,
    setNowScrollViewPosition,
    // setDy,
    nowDy,
    keyboardAwareScrollRef,
    scrollRef,
  };

  const isDarkMode = useIsDarkMode();


  return (
    <View 
      style={{
        position: "relative",
        backgroundColor: isDarkMode ? "black" : "white",
        flex: 1,
      }}
    >
      {/* {keyboardAwareScrollRef.current &&  */}
      <ScrollView
        style={{
          padding: 10,
          // backgroundColor: "rgba(200,200,0,0.3)",
          position: "absolute",
          // absolute 일때 top bottom 을 넣어야 스크롤이 됨. 왠진 모름
          top: 0,
          bottom: 0,
        }}
        scrollEnabled={false}
        ref={scrollRef}
        // scrollView 움직이게 할라고 넣음. 이게 문제 생길수도 있다하니 문제 있으면 얘 확인
        disableScrollViewPanResponder={true}
      >
        <View
          style={{
            // 
            opacity: opacityForAnimation ? 1 : 0,
            // 
          }}
        >
          <TitleInput
            value={title}
            setValue={setTitle}
          />
          <BodyInput
            inputIndex={0}
            {...bodyInputPropsArr}
          />
          {copiedFiles.length > 0 && copiedFiles.map((file,index) => {
            const uri = file.uri;
            const animatedIndex = file.animatedIndex;
            const isEditingFile = file.isEditingFile;
            const thumbNail = file.thumbNail;
            return (
              <React.Fragment
                key={uri}
              >
                {isEditingFile ?
                  <PetLogImageWithRealHeight
                    uri={thumbNail ?? uri}
                    fileWidth={imageWidth}
                    imageStyle={{
                      borderColor : animatedIndex ? "orange" : "grey",
                      borderWidth: 5,
                      opacity: animatedIndex ? 1 : 0.4,
                    }}
                  />
                :
                  animatedIndex ?
                    <View
                      style={{
                        height: 4,
                        width: "100%",
                        backgroundColor: "orange",
                      }}
                    />
                  :
                    <PetLogImageWithRealHeight
                      uri={uri}
                      fileWidth={imageWidth}
                      thumbNail={thumbNail}
                    />
                }
                
                <Input
                  value={body[(index+1)]}
                  placeholder="본문"
                  // autoCapitalize="none"
                  // autoCorrect={false}
                  // placeholderTextColor={placeholderTextColor}
                  multiline={true}
                />
              </React.Fragment>
            )}
          )}
        </View>
      </ScrollView>
      {/* } */}
      <KeyboardAwareScrollView
        style={{
          padding: 10,

          // opacity: 0.5,

        }}
        // onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        scrollEnabled={!isPhotoTranslateActive}
        onScrollBeginDrag={scrollPositionSetFn}
        onScrollEndDrag={scrollPositionSetFn}
        onMomentumScrollBegin={scrollPositionSetFn}
        onMomentumScrollEnd={scrollPositionSetFn}
        ref={keyboardAwareScrollRef}
        // disableScrollViewPanResponder={true}
      >
        <TitleInput
          value={title}
          setValue={setTitle}
          opacityForAnimation={opacityForAnimation}
        />
        <BodyInput
          inputIndex={0}
          {...bodyInputPropsArr}
        />
        {files.length > 0 && files.map((file,index) =>
          <React.Fragment
            key={file.uri}
          >
            <CanChangePositionFile
              file={file}
              fileIndex={index}
              fileOpacityForAnimation={opacityForAnimation && nowChangingFileIndex !== index}
              {...canChangePositionFilePropsArr}
            />
            <BodyInput
              inputIndex={index+1}
              {...bodyInputPropsArr}
            />
          </React.Fragment>
        )}
      </KeyboardAwareScrollView>
      
    </View>
  );
};
  
export default UploadPetLog;


  
  //   const bodyInputPropsArr = {
  //     value:body,
  //     setValue:setBody,
  //     setFileAddingPosition,
  //     setEachLineTextLength,
  //     nowChangingInputIndex,
  //     setNowChangingInputIndex,
  //     setComponentPositionY,
  //     opacityForAnimation,
  //   };
    
  //   const canChangePositionFilePropsArr = {
  //     setBody,
  //     imageWidth,
  //     setFiles,
  //     setIsPhotoTranslateActive,
  //     setComponentPositionY,
  //     setOpacityForAnimation,
  //     setCopiedFiles,
  //     setNowChangingFileIndex,
  //     setFileAddingPosition,
  //   };
  
  //   const isDarkMode = useIsDarkMode();
  
  
  //   return (
  //     <KeyboardAwareScrollView
  //       style={{
  //         padding: 10,
  //         backgroundColor: isDarkMode ? "black" : "white",
  //         position: "relative",
  //       }}
  //       scrollEnabled={!isPhotoTranslateActive}
  //     >
  //       <TitleInput
  //         value={title}
  //         setValue={setTitle}
  //         opacityForAnimation={opacityForAnimation}
  //       />
  //       <BodyInput
  //         inputIndex={0}
  //         {...bodyInputPropsArr}
  //       />
  //       {files.length > 0 && files.map((file,index) =>
  //         <React.Fragment
  //           key={file.uri}
  //         >
  //           <CanChangePositionFile
  //             file={file}
  //             fileIndex={index}
  //             fileOpacityForAnimation={opacityForAnimation && nowChangingFileIndex !== index}
  //             {...canChangePositionFilePropsArr}
  //           />
  //           <BodyInput
  //             inputIndex={index+1}
  //             {...bodyInputPropsArr}
  //           />
  //         </React.Fragment>
  //       )}
  
  //       {/* 애니메이션을 위해 겹쳐놓음. 이걸 상황따라 불러오니까 버퍼링있음. 걍 opacity 주는게 나을듯 */}
  //       {<View
  //         style={{
  //           position: "absolute",
  //           opacity: opacityForAnimation ? 1 : 0,
  //         }}
  //       >
  //         <TitleInput
  //           value={title}
  //           setValue={setTitle}
  //         />
  //         <BodyInput
  //           inputIndex={0}
  //           {...bodyInputPropsArr}
  //         />
  //         {copiedFiles.length > 0 && copiedFiles.map((file,index) => {
  //           const uri = file.uri;
  //           const animatedIndex = file.animatedIndex;
  //           const isEditingFile = file.isEditingFile;
  //           const thumbNail = file.thumbNail;
  //           return (
  //             <React.Fragment
  //               key={uri}
  //             >
  //               {isEditingFile ?
  //                 <PetLogImageWithRealHeight
  //                   uri={thumbNail ?? uri}
  //                   fileWidth={imageWidth}
  //                   imageStyle={{
  //                     borderColor : animatedIndex ? "orange" : "grey",
  //                     borderWidth: 5,
  //                     opacity: animatedIndex ? 1 : 0.4,
  //                   }}
  //                 />
  //               :
  //                 animatedIndex ?
  //                   <View
  //                     style={{
  //                       height: 4,
  //                       width: "100%",
  //                       backgroundColor: "orange",
  //                     }}
  //                   />
  //                 :
  //                   <PetLogImageWithRealHeight
  //                     uri={uri}
  //                     fileWidth={imageWidth}
  //                     thumbNail={thumbNail}
  //                   />
  //               }
                
  //               <Input
  //                 value={body[(index+1)]}
  //                 placeholder="본문"
  //                 // autoCapitalize="none"
  //                 // autoCorrect={false}
  //                 // placeholderTextColor={placeholderTextColor}
  //                 multiline={true}
  //               />
  //             </React.Fragment>
  //           )}
  //         )}
  //       </View>}
  //     </KeyboardAwareScrollView>
  //   );
  // };
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as MediaLibrary from 'expo-media-library';
import { Alert, FlatList, Image, ListRenderItem, TouchableOpacity, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../../../../color";
import PermissionRequestView from "../../../../components/upload/PermissionRequestView";
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { ProcessingManager } from 'react-native-video-processing';
import { isIOS } from "../../../../utils";

const Container = styled.View`
  flex:1;
  background-color: ${props=>props.theme.backgroundColor};
`;
const Top = styled.View`
  flex: 1;
`;
const TopVideoIconContainer = styled.View`
  position: absolute;
  top: 5%;
  left: 5%;
`;
const TopFullScreenIconContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 5%;
`;
const Bottom = styled.View`
  flex: 1;
`;
const ImageContainer = styled.TouchableOpacity``;

const VideoIconContainer = styled.View`
  position: absolute;
  top: 10%;
  right: 10%;
`;
const IndexIconContainer = styled.View`
  position: absolute;
  bottom: 10%;
  right: 10%;
`;
const IconContainer = styled.View`
  position: absolute;
  bottom: 10%;
  right: 10%;
`;
const HeaderRightText = styled.Text`
  color:${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

const NotSelectedPhotoComponent = styled.View`
  width: 20px;
  height: 20px;
  border: 2px;
  border-color: grey;
  border-radius: 10px;
`;
const SelectedPhotoComponent = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 12px;
  background-color: yellow;
  justify-content: center;
  align-items: center;
`;
const SelectedPhotoComponentText = styled.Text`
  font-size: 14px;
`;

type FileInfo = {
  uri: string,
  isVideo: boolean,
  thumbNail?: string,
}

type INavProps = {
  PlusPhoto:{
    maxPhotoNumber:number,
    setPurePhotoUriArr:React.Dispatch<React.SetStateAction<string[]>>,
    setCroppedPhotoUriArr:React.Dispatch<React.SetStateAction<string[]>>
  },
  FullScreenVideo: {uri: string},
  // EditPost:{plusPhoto:string[]},
  EditPost:{plusPhoto:FileInfo[]},
};

type Props = NativeStackScreenProps<INavProps, 'PlusPhoto'>;



const PlusPhoto = ({navigation,route}:Props) => {
  
  const maxPhotoNumber = route.params.maxPhotoNumber;
  // const setPurePhotoUriArr = route.params.setPurePhotoUriArr;
  // const setCroppedPhotoUriArr = route.params.setCroppedPhotoUriArr;

  // 카메라 설정.. 어디다 쓰는거지?
  const [permissionOk,setPermissionOk] = useState<boolean|null>(null);
  // 선택한 사진들의 목록
  const [photos,setPhotos] = useState<MediaLibrary.Asset[]>([]);
  // 현재 선택 사진
  const [chosenPhoto,setChosenPhoto] = useState<MediaLibrary.Asset>();
  // const [chosenPhoto,setChosenPhoto] = useState("");
  // 얘는 선택한애 index 써야해서 state 로 씀. id 만 받고 업로드로 넘길 때 얘로 localUri 받음.
  const [chosenPhotoIdArr,setChosenPhotoIdArr] = useState<string[]>([]);
  // const [chosenPhotoAsset,setChosenPhotoAsset] = useState<MediaLibrary.Asset|null>(null);

  const [endCursorName,setEndCursorName] = useState<string>();
  const [isHaveNextPage,setIsHaveNextPage] = useState<boolean>(true);

  // 사진들 가져옴
  const getPhotos = async() => {
    if(!isHaveNextPage) return;
    const {assets:photos,endCursor,hasNextPage} = await MediaLibrary.getAssetsAsync({
      ...(endCursorName && { after: endCursorName }),
      sortBy:"creationTime",
      mediaType:["photo","video"],
    });



    // // 각각의 localUri 로 받는. 근데 그닥 이미지 로딩이 빨라지진 않네
    // const photoLocalUriArr = [];
    //   await Promise.all(
    //     photos.map(
    //       async(file) => {
    //         // filename 은 필요하면 쓰고 굳이 필요는 없을듯.
    //         const {localUri,id,...rest} = await MediaLibrary.getAssetInfoAsync(file);
    //         // 얘는 uri 만 넘길때
    //         photoLocalUriArr.push({id,uri:localUri});
    //         // uri 랑 파일명 같이 넘길 때
    //         // uploadFileUriArr.push({uri:localUri,name:filename});
    //       }
    //     )
    //   )




    // 맨처음 가져왔을 땐 큰 화면을 제일 처음 사진으로 지정
    if(!endCursorName){
      // setChosenPhoto(photos[0]?.uri);
      setChosenPhoto(photos[0]);
      // setChosenPhoto(photoLocalUriArr[0]?.uri);
    }
    setEndCursorName(endCursor);
    setIsHaveNextPage(hasNextPage);
    setPhotos(prev=>[...prev,...photos]);
    // setPhotos(prev=>[...prev,...photoLocalUriArr]);

    // 지금은 여러개 올릴거라 처음거 선택 x
    // setChosenPhotoAsset(photos[0]);
  };
  
  // 권한 확인 & 요청
  const getPermissions = async () => {
    // const {status,canAskAgain} = await MediaLibrary.getPermissionsAsync();
    const permissionss = await MediaLibrary.getPermissionsAsync();
    const {status,canAskAgain} = permissionss;
    if (status === "undetermined" && canAskAgain === true ) {
      const {status} = await MediaLibrary.requestPermissionsAsync();
      if(status === "granted") {
        setPermissionOk(true);
        getPhotos();
      }
    } else if (status === "granted") {
      setPermissionOk(true);
      getPhotos();
    }
  };

  // 처음 시작하자마자 권한 확인
  useEffect(()=>{
    getPermissions();
  },[]);
  

  // 다음 화면으로 넘어가기. 파일 받아서 넘어감.
  const HeaderRight = () => <TouchableOpacity onPress={async() => {
    // 사진을 하나도 선택 안했을 경우.
    if(chosenPhotoIdArr.length === 0){
      navigation.goBack();
    } else {
      // 업로드할 사진 localUri 목록
      const uploadFileUriArr:FileInfo[] = [];
      // 각각의 localUri 들을 받음.
      await Promise.all(
        chosenPhotoIdArr.map(
          async(file,index) => {
            // filename 은 필요하면 쓰고 굳이 필요는 없을듯.
            const {localUri,mediaType} = await MediaLibrary.getAssetInfoAsync(file);
            // 얘는 uri 만 넘길때
            // uploadFileUriArr[index] = localUri;
            // uri 랑 파일명 같이 넘길 때
            // uploadFileUriArr.push({uri:localUri,name:filename});
            const isVideo = mediaType === "video";
            // 비디오 이미지 UploadForm 에서 나오게. 안드로이드도 확인.
            let thumbNail;
            if(isVideo) {
              const maximumSize = { width: 500, height: 500 };
              thumbNail = isIOS ? (await ProcessingManager.getPreviewForSecond(localUri, 0, maximumSize, "JPEG")).uri : undefined;
            }
            uploadFileUriArr[index] = {
              uri: localUri,
              isVideo,
              thumbNail,
            };
          }
        )
      );

      // setPurePhotoUriArr(prev=>{
      //   return [...uploadFileUriArr,...prev];
      // });
      // setCroppedPhotoUriArr(prev=>{
      //   return [...uploadFileUriArr,...prev];
      // });

      // localUri 목록을 들고 다음 화면으로 넘어감
      // goBack 으로 해야 하나? navigate 로 해야하나? 만약에 그럴거면 animation 없애든가 해야할듯. 아니면 set 함수 말고 params 로 넘기던지
      // navigation.goBack();
      navigation.navigate("EditPost",{plusPhoto:uploadFileUriArr});
    };
  }}>
    <HeaderRightText>추가</HeaderRightText>
  </TouchableOpacity>

  // 헤더 설정. 다음 화면 넘어가는 버튼
  useEffect(()=>{
    if(permissionOk){
      navigation.setOptions({
        headerRight:HeaderRight,
      });
    }
  // 의존성이 있어야 함. 안그러면 처음에만 실행되서 chosenPhotoIdArr 바뀐걸 안받음.
  },[permissionOk,chosenPhotoIdArr])

  // FlatList 설정
  const numColumns = 3;
  const {width} = useWindowDimensions();
  // 각각의 사진 높이/넓이
  const imageWidth = width/numColumns;


  // 사진 클릭 시
  const selectPhoto = (file:MediaLibrary.Asset) => {
    const index = chosenPhotoIdArr.indexOf(file.id);
    if(index === -1) {
      // 처음 선택하는 사진일 때
      // 10장 이상은 선택 안됨.
      if(chosenPhotoIdArr.length === maxPhotoNumber) {
        return Alert.alert(`한번에 업로드할 수 있는 최대 사진 갯수는 10장 이기 때문에 ${maxPhotoNumber}장 이상 선택하실 수 없습니다.`)
      }
      // 큰 이미지에 넣음
      setChosenPhoto(file);
      // setChosenPhoto(file.uri);

      // 여기는 화면 변경이 위에 setChosenPhoto 로 되서 setChosenPhotoIdArr 말고 그냥 chosenPhotoIdArr 를 바꿨는데 잘 동작함.. 근데 음 문제가 있을라나?? 있네, 같은걸 계속 클릭하면 안나옴
      // chosenPhotoIdArr.push(file.id);
      setChosenPhotoIdArr(prev => {
        const newArr = [...prev]
        newArr.push(file.id);
        return newArr;
      })

    } else {
      // 이미 선택했던 사진일 때
      setChosenPhotoIdArr(prev=>{
        const newArr = [...prev]
        newArr.splice(index,1);
        return newArr;
      })
      // chosenPhotoIdArr.splice(index,1);
    }
  };

  
  // 각각의 사진 렌더링
  const renderItem: ListRenderItem<MediaLibrary.Asset> = ({item:photo}) => {
    // 선택한 사진이 있는지, 있다면 걔의 인덱스를 넣음.
    const index = chosenPhotoIdArr.indexOf(photo.id);
    return (
      <ImageContainer onPress={()=>selectPhoto(photo)} >
        {/* {photo.uri !== "" && process.env.NODE_ENV === "development" ?  */}
        <Image source={{uri:photo.uri}} style={{width:imageWidth,height:imageWidth}}/>
         {/* :
         <FastImage
          style={{ width:imageWidth,height:imageWidth }}
          source={{ uri:photo.uri }}
        />
        } */}
        <IndexIconContainer>
          {/* 선택한 사진이면 걔의 index 나오게. 아니면 그냥 비어있는 걸로 */}
          {index === -1 ? <NotSelectedPhotoComponent /> : <SelectedPhotoComponent>
            <SelectedPhotoComponentText>{index+1}</SelectedPhotoComponentText>
          </SelectedPhotoComponent>}
          {/* 얘는 사진 한장만 업로드 할 수 있을 때
          <Ionicons name={chosenPhoto === photo.uri? "checkmark-circle":"checkmark-circle-outline"} color={chosenPhoto === photo.uri? colors.blue : "white"} size={20}/> */}
        </IndexIconContainer>
        {photo.mediaType === "video" && <VideoIconContainer>
          <Entypo name="video-camera" size={20} color="white" />
        </VideoIconContainer>}
      </ImageContainer>
    )
  };

  const onEndReached = async() => {
    await getPhotos();
  };

  if(permissionOk === null) {
    return <Container />;
  }
  if(permissionOk === false) {
    return <PermissionRequestView permissionKind="사진 파일" />;
  }

  const isVideo = chosenPhoto && chosenPhoto.mediaType === "video";

  const onPressFullScreen = async() => {
    const {localUri} = await MediaLibrary.getAssetInfoAsync(chosenPhoto);
    navigation.navigate("FullScreenVideo",{
      uri: localUri,
    });
    // console.log("localUri for navigate")
    // console.log(localUri)
    // navigation.navigate("UploadFormNav",{
    //   screen: 'FullScreenVideo',
    //   params: {uri: localUri}
    // })
  };

  return (
    <Container>
      <Top>
        {/* {chosenPhoto !== "" && <Image
          style={{ width:"100%",height:"100%" }}
          source={{ uri:chosenPhoto }}
        />
        } */}
        {(chosenPhoto && chosenPhoto.uri !== "") && <Image
          style={{ width:"100%",height:"100%" }}
          source={{ uri:chosenPhoto.uri }}
        />
        }
        {isVideo && <TopVideoIconContainer>
          <Entypo name="video-camera" size={30} color="white" />
        </TopVideoIconContainer>}
        {isVideo && <TopFullScreenIconContainer onPress={onPressFullScreen} >
          <MaterialIcons name="fullscreen" size={30} color="white" />
        </TopFullScreenIconContainer>}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          keyExtractor={(photo) => photo.id+""}
          renderItem={renderItem}
          numColumns={numColumns}
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
        />
      </Bottom>
    </Container>
  )
};

export default PlusPhoto;

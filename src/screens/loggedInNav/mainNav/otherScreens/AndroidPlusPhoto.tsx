import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Alert, FlatList, Image, ListRenderItem, PermissionsAndroid, TouchableOpacity, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../../../../color";
import PermissionRequestView from "../../../../components/upload/PermissionRequestView";
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import CameraRoll from "@react-native-community/cameraroll";

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
  AndroidPlusPhoto:{
    maxPhotoNumber:number,
    setPurePhotoUriArr:React.Dispatch<React.SetStateAction<string[]>>,
    setCroppedPhotoUriArr:React.Dispatch<React.SetStateAction<string[]>>
  },
  FullScreenVideo: {uri: string},
  // EditPost:{plusPhoto:string[]},
  EditPost:{plusPhoto:FileInfo[]},
};

type Props = NativeStackScreenProps<INavProps, 'AndroidPlusPhoto'>;



const AndroidPlusPhoto = ({navigation,route}:Props) => {
  
  const maxPhotoNumber = route.params.maxPhotoNumber;
  // const setPurePhotoUriArr = route.params.setPurePhotoUriArr;
  // const setCroppedPhotoUriArr = route.params.setCroppedPhotoUriArr;

  // 카메라 설정.. 어디다 쓰는거지?
  const [permissionOk,setPermissionOk] = useState<boolean|null>(null);
  // 선택한 사진들의 목록
  const [photos,setPhotos] = useState<FileInfo[]>([]);
  // 현재 선택 사진
  const [chosenPhoto,setChosenPhoto] = useState<FileInfo>();
  // const [chosenPhoto,setChosenPhoto] = useState("");
  // 얘는 선택한애 index 써야해서 state 로 씀. id 만 받고 업로드로 넘길 때 얘로 localUri 받음.
  // const [chosenPhotoIdArr,setChosenPhotoIdArr] = useState<string[]>([]);
  const [allChosenPhotosArr,setAllChosenPhotosArr] = useState<FileInfo[]>([]);
  // const [chosenPhotoAsset,setChosenPhotoAsset] = useState<MediaLibrary.Asset|null>(null);

  const [endCursorName,setEndCursorName] = useState<string>();
  const [isHaveNextPage,setIsHaveNextPage] = useState<boolean>(true);

  // 사진들 가져옴
  const getPhotos = async() => {
    if(!isHaveNextPage) return;
    const {edges,page_info:{end_cursor,has_next_page}} = await CameraRoll.getPhotos({
      first: 30,
      ...(endCursorName && { after: endCursorName }),
    });
    const photos = edges.map(photo=>{
      // const {uri} = photo.node.image;
      const {image:{uri},type} = photo.node;
      return {
        uri,
        isVideo: type === "video/mp4",
      };
    });

    // 맨처음 가져왔을 땐 큰 화면을 제일 처음 사진으로 지정
    // if(!endCursorName && photos.length !== 0){
    const isFirstGetPhotos = !endCursorName && photos.length !== 0
    if(isFirstGetPhotos){
      // setChosenPhoto(photos[0]?.uri);
      // video 도 uri 넣으면 되는지 확인. 아님 비디오를 재생하거나
      setChosenPhoto(photos[0]);
    }
    setEndCursorName(end_cursor);
    setIsHaveNextPage(has_next_page);
    setPhotos(prev=>[...prev,...photos]);
  };
  
  // 권한 확인 & 요청
  const hasAndroidPermission = async() => {
    const setPermissionAndGetPhoto = () => {
      setPermissionOk(true);
      getPhotos();
    };

    // if(Platform.OS !== "android") {
    //   return setPermissionAndGetPhoto();
    // }

    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return setPermissionAndGetPhoto();
    }

    const status = await PermissionsAndroid.request(permission);
    if(status === 'granted'){
      return setPermissionAndGetPhoto();
    }
  };

  // 처음 시작하자마자 권한 확인
  useEffect(()=>{
    hasAndroidPermission();
  },[]);
  

  // 다음 화면으로 넘어가기. 파일 받아서 넘어감.
  const HeaderRight = () => <TouchableOpacity onPress={async() => {
    // 사진을 하나도 선택 안했을 경우.
    if(allChosenPhotosArr.length === 0){
      navigation.goBack();
    } else {
      navigation.navigate("EditPost",{plusPhoto:allChosenPhotosArr});
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
  },[permissionOk,allChosenPhotosArr])

  // FlatList 설정
  const numColumns = 4;
  const {width} = useWindowDimensions();
  // 각각의 사진 높이/넓이
  const imageWidth = width/numColumns;


  // 사진 클릭 시
  const selectPhoto = (file:FileInfo) => {
    const index = allChosenPhotosArr.findIndex(singleChosenPhoto=>singleChosenPhoto.uri === file.uri);
    if(index === -1) {
      // 처음 선택하는 사진일 때
      // 10장 이상은 선택 안됨.
      if(allChosenPhotosArr.length === maxPhotoNumber) {
        return Alert.alert(`한번에 업로드할 수 있는 최대 사진 갯수는 10장 이기 때문에 ${maxPhotoNumber}장 이상 선택하실 수 없습니다.`)
      }
      // 큰 이미지에 넣음
      setChosenPhoto(file);
      // setChosenPhoto(file.uri);

      // 여기는 화면 변경이 위에 setChosenPhoto 로 되서 setChosenPhotoIdArr 말고 그냥 chosenPhotoIdArr 를 바꿨는데 잘 동작함.. 근데 음 문제가 있을라나?? 있네, 같은걸 계속 클릭하면 안나옴
      // chosenPhotoIdArr.push(file.id);
      setAllChosenPhotosArr(prev => {
        const newArr = [...prev]
        newArr.push(file);
        return newArr;
      })

    } else {
      // 이미 선택했던 사진일 때
      setAllChosenPhotosArr(prev=>{
        const newArr = [...prev]
        newArr.splice(index,1);
        return newArr;
      })
      // chosenPhotoIdArr.splice(index,1);
    }
  };

  
  // 각각의 사진 렌더링
  const renderItem: ListRenderItem<FileInfo> = ({item:photo}) => {
    // 선택한 사진이 있는지, 있다면 걔의 인덱스를 넣음.
    const index = allChosenPhotosArr.findIndex(singleChosenPhoto=>singleChosenPhoto.uri === photo.uri);
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
        {photo.isVideo && <VideoIconContainer>
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

  const isVideo = chosenPhoto && chosenPhoto.isVideo;

  const onPressFullScreen = async() => {
    navigation.navigate("FullScreenVideo",{
      uri: chosenPhoto.uri,
    });
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
          keyExtractor={(photo,index) => index+""}
          renderItem={renderItem}
          numColumns={numColumns}
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
        />
      </Bottom>
    </Container>
  )
};

export default AndroidPlusPhoto;

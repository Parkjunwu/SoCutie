import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StatusBar, TouchableOpacity, useColorScheme } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons"
import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from "@react-navigation/native";
import FastImage from 'react-native-fast-image'
import CameraPermissionRequestView from "../../../../components/upload/CameraPermissionRequestView";


const Container = styled.View`
  flex:1;
  background-color: ${props=>props.theme.backgroundColor};
`;
const Action = styled.View`
  flex: 0.3;
  align-items: center;
  justify-content: space-around;
  padding: 0px 50px;
`;
const ButtonsContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const TakePhotoBtn = styled.TouchableOpacity<{isDarkMode:boolean}>`
  width: 100px;
  height: 100px;
  background-color: ${props=>props.isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"};
  border-radius: 50px;
  opacity: 0.5;
  ${props=>props.isDarkMode ? "7px solid rgba(0,0,0,0.8)" : "7px solid rgba(255,255,255,0.8)"};
  border: ${props=>props.isDarkMode ? "7px solid rgba(0,0,0,0.8)" : "7px solid rgba(255,255,255,0.8)"};
`;
const SliderContainer = styled.View`
  /* flex: 1; */
`;
const ActionsContainer = styled.View`
  flex-direction: row;
`;
const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  margin-left: 20px;
`;
const PhotoAction = styled.TouchableOpacity`
  background-color: white;
  padding: 5px 10px;
  border-radius: 4px;
`;
const PhotoActionText = styled.Text`
  font-weight: 600;
`;
type INavProps = {
  Tabs: undefined;
  TakePhoto: {photoUri:string};
  UploadForm: {file:string[]};
}
type Props = NativeStackScreenProps<INavProps, 'TakePhoto'>;

const TakePhoto = ({navigation}:Props) => {
  
  // 카메라 설정
  const camera = useRef<Camera>();
  const [takenPhoto,setTakenPhoto] = useState("");
  const [cameraReady,setCameraReady] = useState(false);
  const [permissionOk,setPermissionOk] = useState<boolean|null>(null);
  const [cameraType,setCameraType] = useState(Camera.Constants.Type.back)
  const [zoom,setZoom] = useState(0);
  const [flashMode,setFlashMode] = useState(Camera.Constants.FlashMode.off);

  // 카메라가 사용자 화면에 없을 때 unmount 시키기 위함.
  const isFocused = useIsFocused();

  // 카메라 권한 확인 & 요청
  const getPermissions = async() => {
    const {granted} = await Camera.requestCameraPermissionsAsync();
    setPermissionOk(granted);
  };
  
  useEffect(()=>{
    if(isFocused){
      getPermissions();
    }
  // 의존성을 안넣으니까 요기 Navigation 들어왔을 떄 물어봄.
  },[isFocused]);

  // 전면 / 후면 카메라 변경
  const onCameraSwitch = () => {
    setCameraType(prev => {
      if(prev === Camera.Constants.Type.back) {
        return Camera.Constants.Type.front
      };
      return Camera.Constants.Type.back;
    });
  };

  // 줌 변경
  const onZoomValueChange = (e:number) => {
    setZoom(e)
  }

  // 플래시 변경
  const onFlashChange = () => {
    if(flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on)
    } else if (flashMode === Camera.Constants.FlashMode.on) {
      setFlashMode(Camera.Constants.FlashMode.auto)
    } else {
      setFlashMode(Camera.Constants.FlashMode.off)
    }
  }

  // 카메라 준비 되었는지.
  const onCameraReady = () => setCameraReady(true)

  // 카메라 촬영
  const takePhoto = async() => {
    if(camera.current && cameraReady) {
      const {uri} = await camera.current.takePictureAsync({
        quality:1,
        exif:true,
        skipProcessing:true,
      });
      setTakenPhoto(uri);
    }
  }

  // 찍은 사진 저장 안하고 취소
  const onDismiss = () => setTakenPhoto("")

  // 찍은 사진을 저장하고 업로드로 가져감.
  const savePhotoAndGoToUpload = async() => {
    await MediaLibrary.saveToLibraryAsync(takenPhoto);
    navigation.navigate("UploadForm",{file:[takenPhoto]})
  };
  
  // 찍은 사진을 저장하고 업로드로 가져감.
  const goToUpload = () => {
    navigation.navigate("UploadForm",{file:[takenPhoto]})
  }

  // 찍은 사진을 사용할건지 사용자에게 물음
  const onUpload = () => {
    Alert.alert("사진을 저장하시겠습니까?", "저장 & 업로드 or 업로드",[
      {
        text:"저장 & 업로드",
        onPress:async() => await savePhotoAndGoToUpload(),
      },
      {
        text:"업로드",
        onPress:() => goToUpload(),
      },
      {
        text:"취소",
      }
    ])
  }

  // const cameraState = takenPhoto === "" && isFocused
  //// permission denied 일 때 재요청 버튼 만들기
  const darkModeSubscription = useColorScheme();

  if(permissionOk === null) {
    return <Container />;
  }
  if(permissionOk === false) {
    return <CameraPermissionRequestView />;
  }

  return (
    <Container>
      {isFocused && <StatusBar hidden={true} />}
      {takenPhoto === "" && isFocused ? <Camera 
        type={cameraType}
        zoom={zoom}
        flashMode={flashMode}
        style={{flex:1}}
        ref={camera}
        onCameraReady={onCameraReady}
        
      >
        <CloseButton onPress={()=>navigation.navigate("Main")}>
          <Ionicons name="close" color={darkModeSubscription === "light" ? "black" : "white"} size={30} />
        </CloseButton>
      </Camera> : takenPhoto !== "" && <FastImage
          style={{ flex:1 }}
          source={{ uri:takenPhoto }}
        />
      // <Image source={{uri:takenPhoto}} style={{flex:1}}/>
      }
      {takenPhoto === "" ?<Action>
        <SliderContainer>
          <Slider
            style={{width: 200, height: 40}}
            minimumValue={0}
            maximumValue={1}
            // minimumTrackTintColor="#FFFFFF"
            // maximumTrackTintColor="rgba(255,255,255,0.5)"
            minimumTrackTintColor={darkModeSubscription === "light" ? "#000000" : "#FFFFFF"}
            maximumTrackTintColor={darkModeSubscription === "light" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"}
            onValueChange={onZoomValueChange}
          />
        </SliderContainer>
        <ButtonsContainer>
          <TakePhotoBtn isDarkMode={darkModeSubscription === "light"} onPress={takePhoto}/>
          <ActionsContainer>
            <TouchableOpacity onPress={onFlashChange} style={{marginRight:30}}>
              <Ionicons name={flashMode === Camera.Constants.FlashMode.on?"flash" : flashMode === Camera.Constants.FlashMode.off ? "flash-off": "eye"} size={35} color={darkModeSubscription === "light" ? "black" : "white"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onCameraSwitch}>
              <Ionicons name="camera-reverse" size={35} color={darkModeSubscription === "light" ? "black" : "white"} />
            </TouchableOpacity>
          </ActionsContainer>
        </ButtonsContainer>
      </Action> : <Action>
        <PhotoAction onPress={onDismiss}>
          <PhotoActionText>취소</PhotoActionText>  
        </PhotoAction>  
        <PhotoAction onPress={onUpload}>
          <PhotoActionText>저장</PhotoActionText>  
        </PhotoAction>
      </Action>}
    </Container>
  );
};

export default TakePhoto;

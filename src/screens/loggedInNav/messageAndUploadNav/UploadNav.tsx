import React, { useState } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Platform, TouchableOpacity, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SelectPhoto from "./uploadNav/SelectPhoto";
import TakePhoto from "./uploadNav/TakePhoto";
import styled from "styled-components/native";
import AndroidSelectPhoto from "./uploadNav/AndroidSelectPhoto";
import SafeAreaContainer from "../../../components/upload/SafeAreaContainer";
import UploadPetLog from "../mainNav/otherScreens/UploadPetLog";
import UploadStackNavGeneratorNeedWhichComponent from "../../../navigator/UploadStackNavGeneratorNeedWhichComponent";

const TabTitle = styled.Text<{isAndroid:boolean,color:string}>`
  font-weight: ${props=>props.isAndroid ? 'bold' : 600};
  color: ${props=>props.color};
`;

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

///// 대충함. 원래는 네비게이션 별로 나눠야함. 걍 여기서만 쓰니까 screen 두개만 씀.
type INavProps = {
  Select:undefined;
  MainNav:undefined;
  FullScreenVideo:undefined;
}
type Props = NativeStackScreenProps<INavProps, 'Select'>;

type SelectScreenNavigationProp = Props['navigation'];

const UploadNav = () => {
  const navigation = useNavigation<SelectScreenNavigationProp>();
  const darkModeSubscription = useColorScheme();

  const isAndroid = Platform.OS === "android"

  const [isPhotoTranslateActive,setIsPhotoTranslateActive] = useState(false);

  console.log("isPhotoTranslateActive")
  console.log(isPhotoTranslateActive)

  return(
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle:{
          backgroundColor:darkModeSubscription === "light" ? "white" : "black",
          // height 를 못받아서 지정. 근데 48이 기본인듯. 안드로이드 확인
          height: 48,
        },
        // 얘도 height 를 못받아서 지정.
        tabBarContentContainerStyle:{
          height: 48,
        },
        tabBarActiveTintColor:darkModeSubscription === "light" ? "black" : "white",
        tabBarInactiveTintColor:"grey",
        tabBarIndicatorStyle:{
          backgroundColor:darkModeSubscription === "light" ? "black" : "white",
          top:0,
        },
        swipeEnabled: isPhotoTranslateActive ? false : true,
      }}
    >
      {/* <Tab.Screen name="Select" options={{ */}
      {/* name 을 Select 에서 SelectNav 로 바꿨는데 혹시 오류나면 이거 변경 */}
      <Tab.Screen name="SelectNav" options={{
        tabBarLabel:({focused, color})=><TabTitle isAndroid={isAndroid} color={color}>스토리</TabTitle>
      }}>
        {
          // SafeAreaContainer 에 넣어야 StatusBar 넘어가지 않음
          // 헤더 넣을라고 StackNav 에 넣은..듯?
          ()=><UploadStackNavGeneratorNeedWhichComponent whichComponent="story" />
          // <SafeAreaContainer>
          //   <Stack.Navigator
          //     screenOptions={{
          //       headerTitleAlign:"center",
          //       headerStyle:{
          //         backgroundColor:darkModeSubscription === "light" ? "white" : "black",
          //       },
          //       headerTintColor:darkModeSubscription === "light" ? "black" : "white",
          //       // headerLeft:({tintColor})=><TouchableOpacity onPress={() => navigation.goBack()}>
          //       //     <Ionicons name="close" size={24} color={tintColor}/>
          //       //   </TouchableOpacity>,
          //       // title:"사진 선택"
          //     }}
          //   >
          //     {/* 안드로이드는 cameraRoll 을 써야 외부 저장소 파일을 받을 수 있음. ios 는 expo MediaLibrary 써야 localUri 받고 얘로 받아야 FastImage 에 나옴. cameraRoll 에서 localUri 는 바로 못 받고 따로 다시 받아야함. */}
          //     <Stack.Screen name="SelectPhoto" component={isAndroid ? AndroidSelectPhoto : SelectPhoto} options={{
          //       headerLeft:({tintColor})=><TouchableOpacity onPress={() => navigation.goBack()}>
          //           <Ionicons name="close" size={24} color={tintColor}/>
          //         </TouchableOpacity>,
          //       title:"사진 선택"
          //     }} />
          //     {/* UploadFormNav 로 옮김. 문제 없으면 지워 */}
          //     {/* <Stack.Screen name="FullScreenVideo" component={FullScreenVideo} options={{
          //       title:"선택한 동영상",
          //       headerBackTitleVisible:false,
          //     }} /> */}
          //     {/* <Stack.Screen name="EditVideo" component={EditVideo} options={{
          //       title:"동영상 편집",
          //       headerBackTitleVisible:false,
          //     }} /> */}
          //   </Stack.Navigator>
          // </SafeAreaContainer>
        }
      </Tab.Screen>

      <Tab.Screen name="UploadPetLogNav" options={{
        tabBarLabel:({focused, color})=><TabTitle isAndroid={isAndroid} color={color}>팻로그</TabTitle>
      }}>
        {()=><UploadStackNavGeneratorNeedWhichComponent whichComponent="UploadPetLog" isPhotoTranslateActive={isPhotoTranslateActive} setIsPhotoTranslateActive={setIsPhotoTranslateActive}/>}
      </Tab.Screen>

      <Tab.Screen name="Take" component={TakePhoto} options={{
        tabBarLabel:({focused, color})=><TabTitle isAndroid={isAndroid} color={color}>사진 촬영</TabTitle>
      }}/>
    </Tab.Navigator>
  );
}
export default UploadNav;
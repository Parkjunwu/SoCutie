import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import MainNav from "./loggedInNav/MainNav";
import UploadNav from "./loggedInNav/messageAndUploadNav/UploadNav";
import MessageNav from "./loggedInNav/messageAndUploadNav/MessageNav";
import messaging from '@react-native-firebase/messaging';
import useOnPressPushNotification from "../hooks/useOnPressPushNotification";
import useMe from "../hooks/useMe";
import UploadFormNav from "./loggedInNav/messageAndUploadNav/UploadFormNav";
import FullScreenVideo from "./loggedInNav/messageAndUploadNav/uploadNav/FullScreenVideo";
import useIsDarkMode from "../hooks/useIsDarkMode";
import EditNetworkVideo from "./loggedInNav/mainNav/otherScreens/EditNetworkVideo";
import { HomeNavStackParamsList } from "../types/homeNavStackParamsList";
import { isAndroid } from "../utils";

const Stack = createNativeStackNavigator<HomeNavStackParamsList>();

const HomeNav = () => {

  const isDarkMode = useIsDarkMode();

  const {data:currentUser} = useMe();

  // notification 눌러서 들어왔을 경우
  const notificationNavigate = useOnPressPushNotification();
  
  useEffect(()=>{
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        '백그라운드에서 noti 눌러서 들어옴',
        remoteMessage.data,
      );
      
      // receiverUserId 가 있다는건 현재 유저랑 같은지 확인하는거. 현재는 message 받은 때만 확인함. 다르면 return
      const receiverUserId = remoteMessage.data.receiverUserId;
      // 로그인 안한 상태면 currentUser null 이니까 ?.체크
      const isNotCurrentUsersMessage = receiverUserId !== String(currentUser?.me?.id);
      if(receiverUserId && isNotCurrentUsersMessage) return;

      notificationNavigate(remoteMessage.data);
    });

    const appOpenPushMessage = async() => {
      const message = await messaging().getInitialNotification()
      if (message) {
        console.log(
          '꺼진 상태에서 noti 눌러서 들어옴',
          message.data,
        );

        // 얘도 onNotificationOpenedApp 랑 마찬가지
        const receiverUserId = message.data.receiverUserId;
        const isNotCurrentUsersMessage = receiverUserId !== String(currentUser?.me?.id);
        if(receiverUserId && isNotCurrentUsersMessage) return;

        notificationNavigate(message.data);
      }
    }
    appOpenPushMessage();
  },[])

  return (
    <Stack.Navigator
      screenOptions={{
        ...(isAndroid && {
          headerTitleStyle: {
            fontSize: 15,
            fontWeight: "bold",
          },
        }),
      }}
    >
      <Stack.Screen name="Main" component={MainNav} options={{
        headerShown:false,
      }} />
      <Stack.Screen name="Upload" component={UploadNav} options={{
        headerShown:false,
      }} />
      {/* UploadForm 대신 UploadFormNav */}
      {/* <Stack.Screen name="UploadForm" component={UploadForm} options={{
        title:"업로드",
        headerStyle:{
          backgroundColor:darkModeSubscription === "light" ? "white" : "black",
        },
        headerTintColor:darkModeSubscription === "light" ? "black" : "white",
        headerBackVisible:false,
        headerTitleAlign:"center",
      }} /> */}
      <Stack.Screen name="UploadFormNav" component={UploadFormNav} options={{
        headerShown:false,
      }} />
      <Stack.Screen name="Messages" component={MessageNav} options={{
        headerShown:false,
        presentation:"modal",
        gestureEnabled:true,
      }} />
      <Stack.Screen name="EditNetworkVideo" component={EditNetworkVideo} options={{
        title:"동영상 편집",
        headerStyle:{
          backgroundColor: isDarkMode ? "black" : "white",
        },
        headerTintColor: isDarkMode ? "white" : "black",
      }}/>
      <Stack.Screen name="FullScreenVideo" component={FullScreenVideo} options={{
        title:"동영상 확인",
        headerStyle:{
          backgroundColor: isDarkMode ? "black" : "white",
        },
        headerTintColor: isDarkMode ? "white" : "black",
      }}/>
      
    </Stack.Navigator>
  );
}
export default HomeNav;
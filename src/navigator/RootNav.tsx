import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeNav from "../screens/HomeNav";
import Comments from "../screens/loggedInNav/mainNav/otherScreens/Comments";
import Profile from "../screens/loggedInNav/mainNav/otherScreens/Profile";
import Photo from "../screens/loggedInNav/mainNav/otherScreens/Photo";
import AuthNav from "../screens/AuthNav";
import LogOutCompletedView from "../screens/LogOutCompletedView";
import Room from "../screens/loggedInNav/messageAndUploadNav/messageNav/Room";
import useIsDarkMode from "../hooks/useIsDarkMode";
import PetLog from "../screens/loggedInNav/mainNav/otherScreens/PetLog";
import RootNavStackParamsList from "../types/rootNavStackParamsList";
import PushNotificationPetLog from "../screens/PushNotificationPetLog";
import GoHomeBtn from "../components/pushNotificationPetLog/GoHomeBtn";

const Stack = createNativeStackNavigator<RootNavStackParamsList>();

const RootNav = () => {

  // const darkModeSubscription = useColorScheme();
  // const isDarkMode = darkModeSubscription === "dark";
  const isDarkMode = useIsDarkMode();

  return (
    <Stack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor: isDarkMode ? "black" : "white",
      },
      headerTintColor: isDarkMode ? "white" : "black",
      headerTitleAlign:"center",
    }}>
      <Stack.Screen name="HomeNav" component={HomeNav} options={{
        headerShown:false
      }}/>
      <Stack.Screen name="AuthNav" component={AuthNav} options={{
        headerShown:false
      }}/>
      <Stack.Screen name="LogOutCompletedView" component={LogOutCompletedView} options={{
        headerShown:false
      }}/>
      <Stack.Screen name="PushNotificationUser" component={Profile} options={{
        title:"프로필",
      }} />
      <Stack.Screen name="PushNotificationPost" component={Photo} options={{
        title:"포스팅",
      }}/>
      <Stack.Screen name="PushNotificationComment" component={Comments} options={{
        title:"댓글",
      }}/>
      <Stack.Screen name="PushNotificationPetLog" component={PushNotificationPetLog} options={{
        title:"펫로그",
        headerLeft:({tintColor})=><GoHomeBtn tintColor={tintColor}/>
      }}/>
      <Stack.Screen name="PushNotificationRoom" component={Room} options={{
        title:"대화창",
      }}/>
    </Stack.Navigator>
  );
};

export default RootNav;
import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MainNav from "./loggedInNav/MainNav";
import UploadNav from "./loggedInNav/messageAndUploadNav/UploadNav";
import UploadForm from "./loggedInNav/messageAndUploadNav/UploadForm";
import MessageNav from "./loggedInNav/messageAndUploadNav/MessageNav";

type TabParamList = {
  FeedTab:undefined;
  SearchTab:undefined;
  CameraTab:undefined;
  NotificationTab:undefined;
  MeTab:undefined;
};
type NativeStackParamList = {
  Main:NavigatorScreenParams<TabParamList>;
  Upload:undefined;
  UploadForm:undefined;
  Messages:undefined;
};

const Stack = createNativeStackNavigator<NativeStackParamList>();

const LoggedInNav = () => {
  return (
    <Stack.Navigator screenOptions={{
      presentation:"modal",
      gestureEnabled:true,
      // headerShown:false,
    }}>
      <Stack.Screen name="Main" component={MainNav} 
      options={{headerShown:false,}}
      />
      <Stack.Screen name="Upload" component={UploadNav} 
      options={{headerShown:false,}}
      />
      <Stack.Screen name="UploadForm" component={UploadForm} />
      <Stack.Screen name="Messages" component={MessageNav} options={{headerShown:false,}}/>
    </Stack.Navigator>
  );
}
export default LoggedInNav;
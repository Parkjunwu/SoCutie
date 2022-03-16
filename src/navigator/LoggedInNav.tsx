import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import UploadForm from "../screens/UploadForm";
import MessageNav from "./MessageNav";
import TabsNav from "./TabsNav";
import UploadNav from "./UploadNav";

type TabParamList = {
  FeedTab:undefined;
  SearchTab:undefined;
  CameraTab:undefined;
  NotificationTab:undefined;
  MeTab:undefined;
};
type NativeStackParamList = {
  Tabs:NavigatorScreenParams<TabParamList>;
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
      <Stack.Screen name="Tabs" component={TabsNav} 
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
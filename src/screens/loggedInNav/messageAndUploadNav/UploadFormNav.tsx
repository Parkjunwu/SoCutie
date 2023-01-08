import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useIsDarkMode from "../../../hooks/useIsDarkMode";
import { isAndroid } from "../../../utils";
import UploadFormRoute from "./UploadFormRoute";
import UploadFormIOS from "./UploadFormIOS";
// import CheckEditVideo from "./uploadNav/CheckEditVideo";
import EditVideo from "./uploadNav/EditVideo";
import FullScreenVideo from "./uploadNav/FullScreenVideo";

const Stack = createNativeStackNavigator();

const UploadFormNav = () => {

  const isDarkMode = useIsDarkMode();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:{
          backgroundColor:isDarkMode ? "black" : "white",
        },
        headerTintColor:isDarkMode ? "white" : "black",
        headerBackVisible:false,
        headerTitleAlign:"center",
        ...(isAndroid && {
          headerTitleStyle: {
            fontSize: 15,
            fontWeight: "bold",
          },
        }),
      }}
    >
      <Stack.Screen
        name="UploadForm"
        component={UploadFormRoute}
        options={{
          title:"업로드",
        }}
      />
      <Stack.Screen
        name="EditVideo"
        component={EditVideo}
        options={{
          title:"동영상 편집",
          headerBackTitleVisible:false,
          // headerBackButtonMenuEnabled:true,
          headerBackVisible:true
        }}
      />
      {/* <Stack.Screen
        name="CheckEditVideo"
        component={CheckEditVideo}
        options={{
          title:null,
          headerBackTitleVisible:false,
          // headerBackButtonMenuEnabled:true,
          headerBackVisible:true
        }}
      /> */}
      {/* 얜 ios 만 된대. android 확인 */}
      {/* UploadNav 에서 여기로 변경. SelectPhoto, UploadForm 에서 둘 다 확인해서 */}
      <Stack.Screen name="FullScreenVideo" component={FullScreenVideo} options={{
        // title:"선택한 동영상",
        title:null,
        headerBackTitleVisible:false,
      }} />
    </Stack.Navigator>
  );
};

export default UploadFormNav;
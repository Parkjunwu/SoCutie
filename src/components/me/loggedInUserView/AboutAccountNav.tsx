import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useIsDarkMode from "../../../hooks/useIsDarkMode";
import { isAndroid } from "../../../utils";
import AboutAccount from "./aboutAccountNav/AboutAccount";
import AccountWithdrawal from "./aboutAccountNav/AccountWithdrawal";
import HeaderBackBtn from "./aboutAccountNav/component/HeaderBackBtn";
import SeeBlockUsers from "./aboutAccountNav/SeeBlockUsers";


type StackParamList = {
  AboutAccount: undefined;
  AccountWithdrawal: undefined;
  SeeBlockUsers: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const AboutAccountNav = () => {

  // const darkModeSubscription = useColorScheme();
  // const isDarkMode = darkModeSubscription === "dark";
  const isDarkMode = useIsDarkMode();

  return (
    <Stack.Navigator screenOptions={{
      title:"계정",
      ...(isAndroid && {
        headerTitleStyle: {
          fontSize: 15,
          fontWeight: "bold",
        },
      }),
      headerTitleAlign:"center",
      headerStyle:{
        backgroundColor: isDarkMode ? "black" : "white",
      },
      headerTintColor: isDarkMode ? "white" : "black",
      headerShadowVisible:true,
      headerBackTitleVisible:false,
      headerLeft:({tintColor})=><HeaderBackBtn tintColor={tintColor}/>
    }}>
      <Stack.Screen name="AboutAccount" component={AboutAccount} />
      <Stack.Screen name="SeeBlockUsers" component={SeeBlockUsers} options={{
        title:"차단한 유저"
      }} />
      <Stack.Screen name="AccountWithdrawal" component={AccountWithdrawal} options={{
        title:"계정 탈퇴"
      }} />
    </Stack.Navigator>
  );
};

export default AboutAccountNav;
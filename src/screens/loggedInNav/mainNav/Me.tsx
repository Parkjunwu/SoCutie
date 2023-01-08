import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, View } from 'react-native';
import MeLoggedInUserView from '../../../components/me/loggedInUserView/MeLoggedInUserView';
import { MeStackProps } from '../../../components/type';
import useLogOut from '../../../hooks/useLogOut';
import * as WebBrowser from 'expo-web-browser';
import LogOutBtn from '../../../components/me/LogOutBtn';
import AboutAccountNav from '../../../components/me/loggedInUserView/AboutAccountNav';
import useIsDarkMode from '../../../hooks/useIsDarkMode';

const Drawer = createDrawerNavigator();

type Prop = NativeStackScreenProps<MeStackProps,"Me">

const Me = ({navigation,route}:Prop) => {
  
  const logOut = useLogOut();

  // const darkModeSubscription = useColorScheme();
  // const isDarkMode = darkModeSubscription === "dark";
  const isDarkMode = useIsDarkMode();
  
  return (
    // 걍 사이드 메뉴를 보여주기 위함이라 navigation 의미는 없음. 전부 e.preventDefault(); 하고 기능 넣음.
    <Drawer.Navigator
      useLegacyImplementation={true}
      screenOptions={{
        drawerStyle:{
          backgroundColor: isDarkMode ? "rgba(0,0,0,0.8)" : "white",
        },
        headerStyle:{
          backgroundColor: isDarkMode ? "black" : "white",
        },
        headerTintColor:isDarkMode ? "white" : "black",
        drawerPosition:"right",
        headerLeft:()=>null,
        swipeEnabled:false,
        drawerItemStyle:{
          backgroundColor: isDarkMode ? null : "white",
          borderBottomColor: isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)",
          borderBottomWidth:1,
          // flex: 1,
        },
        drawerLabelStyle:{
          color: isDarkMode ? "white" : "black",
        },
        drawerContentContainerStyle:{
          // backgroundColor:"yellow",
          flex: 1,
        },
        // drawerContentStyle:{
          // backgroundColor:"yellow",
          // flex: 1,
        // }
      }}
    >
      {/* 맨처음 MeLoggedInUserView 을 놔야 스크린 뜸. */}
      <Drawer.Screen
        name="MeLoggedInUserView"
        component={MeLoggedInUserView}
        options={{
          drawerLabel:"이용약관 보기"
        }}
        listeners={()=>{
          return {
            drawerItemPress:async(e)=>{
              e.preventDefault();
              await WebBrowser.openBrowserAsync('https://effulgent-klepon-5dde0b.netlify.app/');
            }
          }
        }}
      />
      <Drawer.Screen
        name="a"
        component={View}
        options={{
          drawerLabel:"개인정보처리방침 보기",
        }}
        listeners={()=>{
          return {
            drawerItemPress:async(e)=>{
              e.preventDefault();
              await WebBrowser.openBrowserAsync('https://stellular-pony-89a2f5.netlify.app/');
            }
          }
        }}
      />
      <Drawer.Screen
        name="b"
        component={AboutAccountNav}
        options={{
          drawerLabel:"계정",
          headerShown:false,
        }}
      />
      <Drawer.Screen
        name="c"
        component={View}
        options={{
          // color 가 drawerLabelStyle 이 아니네. 왜지?
          drawerLabel:()=><LogOutBtn/>,
          drawerItemStyle:{
            flex: 1,
            justifyContent:"flex-end"
          }
        }}
        listeners={()=>{
          return {
            drawerItemPress:(e)=>{
              e.preventDefault();
              Alert.alert("로그아웃 하시겠습니까?",null,[
                {
                  text: "로그아웃",
                  onPress: async() => {
                    await logOut();
                    navigation.navigate("LogOutCompletedView");
                  }
                },
                {
                  text: "취소",
                  style: 'destructive'
                },
              ],
              { cancelable: true, })
            }
          }
        }}
      />
    </Drawer.Navigator>
  );
}

export default Me;
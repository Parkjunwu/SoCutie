import { gql, useQuery } from "@apollo/client";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Alert, useColorScheme, View } from "react-native";
import { isLoggedInVar } from "../../apollo";
import cacheImage from "../../cacheImage";
import TabIcon from "../../components/nav/TabIcon";
import NotLoggedInUserView from "../../components/NotLoggedInUserView";
import useMe from "../../hooks/useMe";
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../logic/subscribeToMoreExcuteOnlyOnce";
import SharedStackNav from "../../navigator/SharedStackNav"
import { getNumberOfUnreadNotification } from "../../__generated__/getNumberOfUnreadNotification";
import { userNotificationUpdate } from "../../__generated__/userNotificationUpdate";
import NotificationStackNav from "./mainNav/NotificationStackNav";
import FastImage from 'react-native-fast-image'
import {Entypo} from "@expo/vector-icons"
import { USER_NOTIFICATION_UPDATE } from "../../gql/forCodeGen";
import ForResetSharedNavScreen from "../../components/sharedStackNav/ForResetSharedNavScreen";
// import NewPetLogList from "./mainNav/otherScreens/NewPetLogList";
// import PetLog from "./mainNav/otherScreens/PetLog";
// import UploadPetLog from "./mainNav/otherScreens/UploadPetLog";

const GET_NUMBER_OF_UNREAD_NOTIFICATION = gql`
  query getNumberOfUnreadNotification {
    getNumberOfUnreadNotification 
  }
`;

// 만약 이거 말고 핸드폰 알림이 이걸로 되는게 아니면 백앤드에 보내는 거를 Notification 아닌 true 로 변경.
// forCodeGen 으로 옮김
// const USER_NOTIFICATION_UPDATE 

type TabParamList = {
  FeedTab:undefined;
  // SearchTab:undefined;
  NewPetLogListTab:undefined;
  CameraTab:undefined;
  NotificationTab:undefined;
  MeTab:undefined;
};

type Props = BottomTabScreenProps<{Upload:undefined,CameraTab:undefined}, 'CameraTab'>;

const Tab = createBottomTabNavigator<TabParamList>();

// 알림 갯수. 0개 일때는 안떠야 돼서 null 로 지정.
let numberOfUnreadIfZeroIsNull: number|null;

const MainNav = () => {

  const isLoggedIn = isLoggedInVar();
  const {data:meData} = useMe();
  
  ////

  // 유저 이미지를 캐시 저장. 근데 지금 너무 느림.
  useEffect(()=>{
    if(meData?.me){
      cacheImage(meData.me.avatar);
    }
  },[meData]);

  ////

  
  const darkModeSubscription = useColorScheme();

  // 처음 실행 시 안읽은 캐시 갯수 받음
  const { data, subscribeToMore } = useQuery<getNumberOfUnreadNotification>(GET_NUMBER_OF_UNREAD_NOTIFICATION,{
    fetchPolicy: 'network-only',
    skip:!isLoggedIn,
  });

  // 알림 subscribe 하면 알림 갯수 변경
  const updateQuery:UpdateQueryFn<getNumberOfUnreadNotification,null,userNotificationUpdate> = (prev,{subscriptionData}) => {
    if(!subscriptionData.data.userNotificationUpdate.id) {
      return prev;
    }
    return Object.assign({}, prev, {
      getNumberOfUnreadNotification: prev === null ? 1 : prev.getNumberOfUnreadNotification + 1
    });
  };

  // 이게 필요가 있나?? 위에서 받는데. 글고 렌더링에 얘를 받는데 걍 data 넣으면 될듯.
  // if(isLoggedIn){
    // notification 안읽은 갯수. 캐시에서 받음.
    // const numberOfUnread = getUnreadNumberOfNotificationOnCache();
    // numberOfUnreadIfZeroIsNull = numberOfUnread === 0 ? null : numberOfUnread;
  // }

  const numberOfUnread = data?.getNumberOfUnreadNotification;
  numberOfUnreadIfZeroIsNull = numberOfUnread === 0 ? null : numberOfUnread;

  // notification subscribe 하고 캐시까지 변경하는 함수
  const wholeSubscribeToMoreFn = () => {
    console.log("subscribe")
    subscribeToMore({
      document:USER_NOTIFICATION_UPDATE,
      updateQuery,
      onError:(err) => console.error("error is "+err),
    });
  };
  
  // subscription 한번만 실행되게 하기 위함
  subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData(wholeSubscribeToMoreFn,data?.getNumberOfUnreadNotification);

  return (
  <Tab.Navigator
    screenOptions={{
      // headerTransparent:true
      headerShown:false,
      tabBarStyle:{
        backgroundColor: darkModeSubscription === "light" ? "white" : "black",
        borderTopColor: darkModeSubscription === "light" ? "rgba(0,0,0,0.5)":"rgba(255,255,255,0.5)",
      },
      tabBarActiveTintColor: darkModeSubscription === "light" ? "rgba(0,0,0,0.7)" : "white",
      tabBarShowLabel:false,
    }}
  >
    <Tab.Screen name="FeedTab" options={{tabBarIcon:({focused,color})=>
    // <TabIcon iconName="home" focused={focused} color={color}/>}}>
    <Entypo name="documents" size={24} color={color}/>}}>
      {()=><SharedStackNav screenName="Feed"/>}
    </Tab.Screen>
    {/* <Tab.Screen name="SearchTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="search" focused={focused} color={color}/>}}>
      {()=><SharedStackNav screenName="Search"/>} 
    </Tab.Screen> */}
    <Tab.Screen name="NewPetLogListTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="md-book" focused={focused} color={color}/>}}>
      {/* {()=><SharedStackNav screenName="NewPetLogList"/>}  */}
      {()=><ForResetSharedNavScreen>
        <SharedStackNav screenName="NewPetLogList"/>
      </ForResetSharedNavScreen>} 
    </Tab.Screen>
    

    {/* <Tab.Screen name="PetLogTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="ios-book" focused={focused} color={color}/>}}>
      {()=><SharedStackNav screenName="PetLog"/>} 
    </Tab.Screen> */}

    <Tab.Screen
      name="CameraTab"
      component={View}
      listeners={({navigation}:Props) => {
        if(isLoggedIn) {
          return {
            // 카메라 nav 로 이동
            tabPress:(e) => {
              e.preventDefault();
              navigation.navigate("Upload");
            }
          }
        } else {
          return {
            // 로그인 / 회원가입 물어봄
            tabPress:(e) => {
              e.preventDefault();
              Alert.alert("회원가입하고 다른 사람들과 나의 취향을 공유하세요!","회원가입 / 로그인 페이지로 이동하시겠습니까?",[
                {
                  text:"이동",
                  onPress:()=>navigation.navigate("AuthNav"),
                },
                {
                  text:"취소",
                }
              ]);
            }
          }
        }
      }}
      
      options={{
        tabBarIcon:({focused, color})=>
        <TabIcon iconName="camera" focused={focused} color={color}/>
      }}
    />
    
    <Tab.Screen name="NotificationTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="heart" focused={focused} color={color}/>, tabBarBadge:numberOfUnreadIfZeroIsNull }}>
      {/* NotificationStackNav는 다른 컴포넌트 갔다 돌아오면 Notification 화면 보여줌. */}
      {/* 로그인 여부에 따라 보여주는 화면이 다름 */}
      {isLoggedIn ? ()=><NotificationStackNav /> : ()=><NotLoggedInUserView/>}
    </Tab.Screen>

    {/* 얘는 만약 각 알림 클릭 시 해당 컴포넌트를 Notification 탭에서가 아닌 Home 탭에서 화면 보여주기 위함. */}
    {/* <Tab.Screen name="Notification" component={Notification} options={{tabBarIcon:({focused,color})=><TabIcon iconName="heart" focused={focused} color={color}/>, tabBarBadge:numberOfUnreadIfZeroIsNull }} /> */}
    <Tab.Screen name="MeTab" options={{tabBarIcon:({focused,color})=>
    {return meData?.me?.avatar ?
      // <UserImg source={{uri:meData.me.avatar}} focused={focused} />
      <FastImage
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          ...(focused && {
            borderColor: "rgba(255,255,255,0.8)",
            borderWidth: 2,
          })
        }}
        source={{uri:meData.me.avatar}}
      />
      :
      <TabIcon iconName="person" focused={focused} color={color}/>
    }
    }}>
      {/* 로그인 여부에 따라 보여주는 화면이 다름 */}
      {isLoggedIn ? ()=><SharedStackNav screenName="Me"/> : ()=><NotLoggedInUserView/>}
    </Tab.Screen>
  </Tab.Navigator>
  );
}
export default MainNav;
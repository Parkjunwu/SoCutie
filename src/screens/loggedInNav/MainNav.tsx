import { gql, useQuery } from "@apollo/client";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import styled, { css } from "styled-components/native";
import cacheImage from "../../cacheImage";
import TabIcon from "../../components/nav/TabIcon";
import useMe from "../../hooks/useMe";
import getUnreadNumberOfNotificationOnCache from "../../logic/getUnreadNumberOfNotificationOnCache";
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../logic/subscribeToMoreExcuteOnlyOnce";
import SharedStackNav from "../../navigator/SharedStackNav"
import { getNumberOfUnreadNotification } from "../../__generated__/getNumberOfUnreadNotification";
import { userNotificationUpdate } from "../../__generated__/userNotificationUpdate";

const GET_NUMBER_OF_UNREAD_NOTIFICATION = gql`
  query getNumberOfUnreadNotification {
    getNumberOfUnreadNotification 
  }
`;

// 만약 이거 말고 핸드폰 알림이 이걸로 되는게 아니면 백앤드에 보내는 거를 Notification 아닌 true 로 변경.
const USER_NOTIFICATION_UPDATE = gql`
  subscription userNotificationUpdate {
    userNotificationUpdate {
      id
    }
  }
`;


const UserImg = styled.Image<{focused:boolean}>`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  ${props => props.focused && css`
    border-color: rgba(255,255,255,0.8);
    border-width: 2px;
  `}
`;
type TabParamList = {
  FeedTab:undefined;
  SearchTab:undefined;
  CameraTab:undefined;
  NotificationTab:undefined;
  MeTab:undefined;
};

type Props = BottomTabScreenProps<{Upload:undefined,CameraTab:undefined}, 'CameraTab'>;

const Tab = createBottomTabNavigator<TabParamList>();

// 알림 갯수. 0개 일때는 안떠야 돼서 null 로 지정.
let numberOfUnreadIfZeroIsNull: number|null;

const MainNav = () => {
  const {data:meData} = useMe();
  // 유저 이미지를 캐시 저장. 근데 지금 너무 느림.
  useEffect(()=>{
    if(meData?.me){
      cacheImage(meData.me.avatar);
    }
  },[meData]);
  const darkModeSubscription = useColorScheme();

  // 처음 실행 시 안읽은 캐시 갯수 받음
  const { data, refetch, subscribeToMore } = useQuery<getNumberOfUnreadNotification>(GET_NUMBER_OF_UNREAD_NOTIFICATION);
  
  useEffect(()=>{
    refetch();
  },[])

  // 알림 subscribe 하면 알림 갯수 변경
  const updateQuery:UpdateQueryFn<getNumberOfUnreadNotification,null,userNotificationUpdate> = (prev,{subscriptionData}) => {
    if(!subscriptionData.data.userNotificationUpdate.id) {
      return prev;
    }
    return Object.assign({}, prev, {
      getNumberOfUnreadNotification: prev === null ? 1 : prev.getNumberOfUnreadNotification + 1
    });
  };

  // notification 안읽은 갯수. 캐시에서 받음.
  const numberOfUnread = getUnreadNumberOfNotificationOnCache();
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
    <Tab.Screen name="FeedTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="home" focused={focused} color={color}/>}}>
      {()=><SharedStackNav screenName="Feed"/>} 
      
    </Tab.Screen>
    <Tab.Screen name="SearchTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="search" focused={focused} color={color}/>}}>
      {()=><SharedStackNav screenName="Search"/>} 
    </Tab.Screen>

    <Tab.Screen
      name="CameraTab"
      component={View}
      listeners={({navigation}:Props) => {
        return {
          tabPress:(e) => {
            e.preventDefault();
            navigation.navigate("Upload");
          }
        }
      }}
      
      options={{
        tabBarIcon:({focused, color})=>
        <TabIcon iconName="camera" focused={focused} color={color}/>
      }}
    />
    <Tab.Screen name="NotificationTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="heart" focused={focused} color={color}/>, tabBarBadge:numberOfUnreadIfZeroIsNull }}>
      {()=><SharedStackNav screenName="Notification"/>}
    </Tab.Screen>
    <Tab.Screen name="MeTab" options={{tabBarIcon:({focused,color})=>
    {return meData?.me?.avatar ?
      <UserImg source={{uri:meData.me.avatar}} focused={focused} />
      :
      <TabIcon iconName="person" focused={focused} color={color}/>
    }
    }}>
      {()=><SharedStackNav screenName="Me"/>} 
    </Tab.Screen>
  </Tab.Navigator>
  );
}
export default MainNav;
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import styled, { css } from "styled-components/native";
import TabIcon from "../components/nav/TabIcon";
import useMe from "../hooks/useMe";
import StackNavFactory from "./SharedStackNav";

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
// type NativeStackParamList = {
//   Tabs:NavigatorScreenParams<TabParamList>;
//   Upload:undefined;
// };
// 걍 대충 만듦.
type Props = BottomTabScreenProps<{Upload:undefined,CameraTab:undefined}, 'CameraTab'>;

const Tab = createBottomTabNavigator<TabParamList>();

const TabsNav = () => {
  const {data} = useMe();
  // data?.me?.avatar
  return (
  <Tab.Navigator
    screenOptions={{
      // headerTransparent:true
      headerShown:false,
      tabBarStyle:{
        backgroundColor:"black",
        borderTopColor:"rgba(255,255,255,0.5)",
      },
      tabBarActiveTintColor:"white",
      tabBarShowLabel:false,
    }}
  >
    <Tab.Screen name="FeedTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="home" focused={focused} color={color}/>}}>
      {()=><StackNavFactory screenName="Feed"/>} 
    </Tab.Screen>
    <Tab.Screen name="SearchTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="search" focused={focused} color={color}/>}}>
      {()=><StackNavFactory screenName="Search"/>} 
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
    <Tab.Screen name="NotificationTab" options={{tabBarIcon:({focused,color})=><TabIcon iconName="heart" focused={focused} color={color}/>}}>
      {()=><StackNavFactory screenName="Notification"/>} 
    </Tab.Screen>
    <Tab.Screen name="MeTab" options={{tabBarIcon:({focused,color})=>
    {return data?.me?.avatar ?
      <UserImg source={{uri:data.me.avatar}} focused={focused} />
      // <Image source={{uri:data.me.avatar}} style={{width:26,height:26,borderRadius:13,...(focused&&{borderColor:"red",borderWidth:2})}}/>
      :
      <TabIcon iconName="person" focused={focused} color={color}/>
    }
    }}>
      {()=><StackNavFactory screenName="Me"/>} 
    </Tab.Screen>
  </Tab.Navigator>
  );
}
export default TabsNav;
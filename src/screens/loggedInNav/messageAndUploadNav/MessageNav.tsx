import React from "react";
import Room from "./messageNav/Room";
import Rooms from "./messageNav/Rooms";
import { TouchableOpacity, useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TemporaryRoom from "./messageNav/TemporaryRoom";
import { Ionicons, Entypo } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native";
import Following from "../mainNav/otherScreens/Following";
import useMe from "../../../hooks/useMe";
import { isAndroid } from "../../../utils";

const Stack = createNativeStackNavigator();

const MessageNav = () => {
  const darkModeSubscription = useColorScheme();
  const navigation = useNavigation();
  const {data} = useMe();
  const getUserId = () => data?.me.id
  return (
    <Stack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor: darkModeSubscription === "light" ? "white" : "black",
      },
      headerTintColor: darkModeSubscription === "light" ? "black" : "white",
      headerTitleAlign:"center",
      ...(isAndroid && {
        headerTitleStyle: {
          fontSize: 15,
          fontWeight: "bold",
        },
      }),
    }}>
      <Stack.Screen name="Rooms" component={Rooms} options={{
        title:"메세지",
        headerLeft:({tintColor}) => (
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Ionicons name="chevron-down" color={tintColor} size={30} />
          </TouchableOpacity>
        ),
        headerRight:({tintColor}) => (
          <TouchableOpacity onPress={()=>navigation.navigate("Following",{
            userId:getUserId(),
            isMessage:true,
          })}>
            <Entypo name="new-message" size={24} color={tintColor} />
          </TouchableOpacity>
        )
      }}/>
      <Stack.Screen name="Room" component={Room} options={{
        // TemporaryRoom 에서 올 때만 animation:"none" 하고 싶은데.. 어떻게 만들지?
        animation:"none",
        title:null,
        // navigation.goBack() 이 여기에 놓으면 아예 MessageNav 를 빠져나감.
        headerLeft:({tintColor}) => (
          // <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Ionicons name="chevron-back" color={tintColor} size={30} />
          // </TouchableOpacity>
        )
      }} />
      <Stack.Screen name="TemporaryRoom" component={TemporaryRoom}/>
      <Stack.Screen name="Following" component={Following} options={{
        headerBackTitleVisible:false,
        title:"유저 목록"
      }} />
    </Stack.Navigator>
  )
};
export default MessageNav;
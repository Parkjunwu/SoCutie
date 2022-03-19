import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Room from "./messageNav/Room";
import Rooms from "./messageNav/Rooms";
import { useColorScheme } from "react-native";

const Stack = createStackNavigator();

const MessageNav = () => {
  const darkModeSubscription = useColorScheme();
  return (
    <Stack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor: darkModeSubscription === "light" ? "white" : "black",
      },
      headerTintColor: darkModeSubscription === "light" ? "black" : "white",
      // cardStyle:{
      //   backgroundColor:"black"
      // },
    }}>
      <Stack.Screen name="Rooms" component={Rooms} />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  )
};
export default MessageNav;
import React from "react";
import Room from "./messageNav/Room";
import Rooms from "./messageNav/Rooms";
import { useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const MessageNav = () => {
  const darkModeSubscription = useColorScheme();
  return (
    <Stack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor: darkModeSubscription === "light" ? "white" : "black",
      },
      headerTintColor: darkModeSubscription === "light" ? "black" : "white",
    }}>
      <Stack.Screen name="Rooms" component={Rooms} />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  )
};
export default MessageNav;
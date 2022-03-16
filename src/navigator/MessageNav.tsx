import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Room from "../screens/Room";
import Rooms from "../screens/Rooms";

const Stack = createStackNavigator();

const MessageNav = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor:"black",
      },
      headerTintColor:"white",
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
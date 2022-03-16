import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

///// 대충함. 원래는 네비게이션 별로 나눠야함. 걍 여기서만 쓰니까 screen 두개만 씀.
type INavProps = {
  Select:undefined;
  Tabs:undefined;
}
type Props = NativeStackScreenProps<INavProps, 'Select'>;

type SelectScreenNavigationProp = Props['navigation'];

const UploadNav = () => {
  const navigation = useNavigation<SelectScreenNavigationProp>();
  return(
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle:{
          backgroundColor:"black",
        },
        tabBarActiveTintColor:"white",
        tabBarInactiveTintColor:"grey",
        tabBarIndicatorStyle:{
          backgroundColor:"white",
          top:0,
        }
      }}
    >
      {/* <Tab.Screen name="Select" component={SelectPhoto} /> */}
      <Tab.Screen name="Select">
        {()=><Stack.Navigator
          screenOptions={{
            headerStyle:{
              backgroundColor:"black",
            },
            headerTintColor:"white",
            headerLeft:({tintColor})=><TouchableOpacity onPress={() => navigation.navigate("Tabs")}>
                <Ionicons name="close" size={24} color={tintColor}/>
              </TouchableOpacity>,
            title:"Choose a photo"
          }}
        >
          <Stack.Screen name="SelectPhoto" component={SelectPhoto} />
        </Stack.Navigator>}
      </Tab.Screen>
      <Tab.Screen name="Take" component={TakePhoto} />
    </Tab.Navigator>
  );
}
export default UploadNav;
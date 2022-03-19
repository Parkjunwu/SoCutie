import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateAccount from './loggedOutNav/CreateAccount';
import LogIn from './loggedOutNav/LogIn';
import Welcome from './loggedOutNav/Welcome';
import { useColorScheme } from 'react-native';
import { colors } from '../color';


type RootStackParamList = {
  Welcome: undefined;
  LogIn: undefined;
  CreateAccount: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoggedOutNav() {
  const darkModeSubscription = useColorScheme();
  return (
    <Stack.Navigator screenOptions={{
      headerBackTitleVisible:false,
      headerTransparent:true,
      headerTitle:()=>false,
      headerTintColor:darkModeSubscription === "light" ? colors.darkYellow : "white"
    }}>
      <Stack.Screen name="Welcome" component={Welcome} options={{headerShown:false}}/>
      <Stack.Screen name="LogIn" component={LogIn}/>
      <Stack.Screen name="CreateAccount" component={CreateAccount}/>
    </Stack.Navigator>
  );
}
export default LoggedOutNav;
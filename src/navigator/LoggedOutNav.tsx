import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateAccount from '../screens/CreateAccount';
import LogIn from '../screens/LogIn';
import Welcome from '../screens/Welcome';

type RootStackParamList = {
  Welcome: undefined;
  LogIn: undefined;
  CreateAccount: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoggedOutNav() {
  return (
    <Stack.Navigator screenOptions={{
      headerBackTitleVisible:false,
      headerTransparent:true,
      headerTitle:()=>false,
      headerTintColor:"white"
    }}>
      <Stack.Screen name="Welcome" component={Welcome} options={{headerShown:false}}/>
      <Stack.Screen name="LogIn" component={LogIn}/>
      <Stack.Screen name="CreateAccount" component={CreateAccount}/>
    </Stack.Navigator>
  );
}
export default LoggedOutNav;
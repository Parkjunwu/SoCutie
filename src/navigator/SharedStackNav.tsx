import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import styled from "styled-components/native";
import Search from "../screens/loggedInNav/mainNav/Search";
import CommentLikes from "../screens/loggedInNav/mainNav/otherScreens/CommentLikes";
import Feed from "../screens/loggedInNav/mainNav/Feed";
import Me from "../screens/loggedInNav/mainNav/Me";
import Notification from "../screens/loggedInNav/mainNav/Notification";
import Profile from "../screens/loggedInNav/mainNav/otherScreens/Profile";
import Comments from "../screens/loggedInNav/mainNav/otherScreens/Comments";
import EditProfile from "../screens/loggedInNav/mainNav/otherScreens/EditProfile";
import PostLikes from "../screens/loggedInNav/mainNav/otherScreens/PostLikes";
import CommentOfCommentLikes from "../screens/loggedInNav/mainNav/otherScreens/CommentOfCommentLikes";
import Followers from "../screens/loggedInNav/mainNav/otherScreens/Followers";
import Following from "../screens/loggedInNav/mainNav/otherScreens/Following";
import PhotoScreen from "../screens/loggedInNav/mainNav/otherScreens/Photo";
import { useColorScheme } from "react-native";

const Stack = createNativeStackNavigator();

interface ISharedStackNavProps {
  screenName: string;
  ifNotificationGetNumberOfUnread?: number;
}

const Img = styled.Image`
  height: 50px;
  width: 100%;
`;

const SharedStackNav: React.FC<ISharedStackNavProps> = ({screenName,ifNotificationGetNumberOfUnread}) => {
  const darkModeSubscription = useColorScheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:{
          backgroundColor: darkModeSubscription === "light" ? "white" : "black"
        },
        headerTintColor: darkModeSubscription === "light" ? "black" : "white",
        headerShadowVisible:true,
        headerBackTitleVisible:false,
      }}
    >
      {screenName === "Feed"?<Stack.Screen name={"Feed"} component={Feed} options={{
        headerTitle:()=><Img source={require("../../assets/logo.png")} resizeMode="contain"/>
      }}/>:null}
      {screenName === "Search"?<Stack.Screen name={"Search"} component={Search} />:null}
      {screenName === "Notification"?<Stack.Screen name={"Notification"} component={Notification} 
      
      initialParams={{ unreadNotification: ifNotificationGetNumberOfUnread }}
      
      />:null}
      {screenName === "Me"?<Stack.Screen name={"Me"} component={Me}/>:null}
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name="Photo" component={PhotoScreen}/>
      <Stack.Screen name="Comments" component={Comments}/>
      <Stack.Screen name="EditProfile" component={EditProfile} options={{title:"프로필 변경"}}/>
      {/* 이 아래는 형식은 다 똑같고 쿼리만 다름 */}
      <Stack.Screen name="PostLikes" component={PostLikes}/>
      <Stack.Screen name="CommentLikes" component={CommentLikes}/>
      <Stack.Screen name="CommentOfCommentLikes" component={CommentOfCommentLikes}/>
      <Stack.Screen name="Followers" component={Followers}/>
      <Stack.Screen name="Following" component={Following}/>
    </Stack.Navigator>
  );
}
export default SharedStackNav;

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
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
import HashTag from "../screens/loggedInNav/mainNav/otherScreens/HashTag";
import AccusePost from "../screens/loggedInNav/mainNav/otherScreens/AccusePost";
import EditPost from "../screens/loggedInNav/mainNav/otherScreens/EditPost";
import PlusPhoto from "../screens/loggedInNav/mainNav/otherScreens/PlusPhoto";
import { isAndroid } from "../utils";
import AndroidPlusPhoto from "../screens/loggedInNav/mainNav/otherScreens/AndroidPlusPhoto";
import EditPetLog from "../screens/loggedInNav/mainNav/otherScreens/EditPetLog";
import PetLog from "../screens/loggedInNav/mainNav/otherScreens/PetLog";
import NewPetLogList from "../screens/loggedInNav/mainNav/otherScreens/NewPetLogList";
import AccusePetLog from "../screens/loggedInNav/mainNav/otherScreens/AccusePetLog";
// import PlusPhotoBtn from "../components/upload/PlusPhotoBtn";
import AndroidSelectPhoto from "../screens/loggedInNav/messageAndUploadNav/uploadNav/AndroidSelectPhoto";
import SelectPhoto from "../screens/loggedInNav/messageAndUploadNav/uploadNav/SelectPhoto";
// import EditPetLogPlusPhotoBtn from "../components/editPetLog/EditPetLogPlusPhotoBtn";
import UploadFormRoute from "../screens/loggedInNav/messageAndUploadNav/UploadFormRoute";
import PushNotificationPetLog from "../screens/PushNotificationPetLog";
import SearchPetLog from "../screens/loggedInNav/mainNav/otherScreens/SearchPetLog";


const Stack = createNativeStackNavigator();

interface ISharedStackNavProps {
  screenName: string;
  ifNotificationGetNumberOfUnread?: number;
}

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
        headerTitleAlign:"center",
        ...(isAndroid && {
          headerTitleStyle: {
            fontSize: 15,
            fontWeight: "bold",
          },
        }),
      }}
    >
      {screenName === "Feed"
      ?
      // <Stack.Screen name={"Feed"} component={Feed}/>
      <>
      <Stack.Screen name={"Feed"} component={Feed}/>
      <Stack.Screen name={"Search"} component={Search} options={{headerShown:false}} />
      </>
      :
      null}
      {/* {screenName === "Search"
      ?
      <Stack.Screen name={"Search"} component={Search} options={{headerShown:false}} />
      :
      null} */}
      {screenName === "NewPetLogList"
      ?
      <>
      <Stack.Screen
        name={"NewPetLogList"}
        component={NewPetLogList}
        options={{title:"펫로그"}}
      />
      <Stack.Screen
        name={"SearchPetLog"}
        component={SearchPetLog}
        options={{headerShown:false}}
      />
      </>
      :
      null}
      {screenName === "Notification"
      ?
      <>
        <Stack.Screen
          name={"Notification"}
          component={Notification} 
          options={{title:"알림"}}
          initialParams={{ unreadNotification: ifNotificationGetNumberOfUnread }}
        />
        <Stack.Screen
          name={"NotificationPetLog"}
          component={PushNotificationPetLog}
          options={{title:"펫로그"}}
        />
      </>
      :
      null}
      {screenName === "Me"
      ?
      <Stack.Screen name={"Me"} component={Me} options={{headerShown:false}} />
      :
      null}
      <Stack.Screen name="Profile" component={Profile} options={{title:""}} />
      <Stack.Screen name="Photo" component={PhotoScreen} options={{title:"포스팅"}} />
      <Stack.Screen name="Comments" component={Comments} options={{title:"댓글"}}/>
      <Stack.Screen name="EditProfile" component={EditProfile} options={{title:"프로필 변경"}}/>
      {/* 이 아래는 형식은 다 똑같고 쿼리만 다름 */}
      <Stack.Screen name="PostLikes" component={PostLikes} options={{title:"좋아요한 사람"}}/>
      <Stack.Screen name="CommentLikes" component={CommentLikes} options={{title:"좋아요한 사람"}}/>
      <Stack.Screen name="CommentOfCommentLikes" component={CommentOfCommentLikes} options={{title:"좋아요한 사람"}}/>
      <Stack.Screen name="Followers" component={Followers} options={{title:"팔로워"}}/>
      <Stack.Screen name="Following" component={Following} options={{title:"팔로잉"}}/>
      <Stack.Screen name="HashTag" component={HashTag} options={{
        title:null,
      }} />
      <Stack.Screen name="AccusePost" component={AccusePost} options={{
        presentation:"modal",
        title:"게시물 신고",
        headerTitleStyle:{fontSize:18}
      }} />
      <Stack.Screen name="EditPost" component={EditPost} options={{title:"게시물 수정"}}/>
      <Stack.Screen name="PlusPhoto" component={isAndroid ? AndroidPlusPhoto : PlusPhoto} options={{title:"사진 추가"}}/>
      <Stack.Screen name="PetLog" component={PetLog} options={{title:null}}/>

      {/*  */}

      <Stack.Screen
        name="EditPetLog"
        component={EditPetLog}
        options={{
          // title:"게시물 수정"
          title:null,
          headerBackVisible:false,
          // 여기다 넣으니까 안받아짐. 왜지??
          // headerTitle:({tintColor}) => <EditPetLogPlusPhotoBtn tintColor={tintColor} />,
        }}
      />

      <Stack.Screen
        name={"PetLogSelectPhoto"}
        component={isAndroid ? AndroidSelectPhoto : SelectPhoto}
        options={{
          headerBackVisible:false,
          title:"사진 선택",
        }}
      />

      <Stack.Screen
        name={"PetLogUploadForm"}
        component={UploadFormRoute}
        options={{
          title:"사진 추가",
        }}
      />

      {/*  */}

      {/* // 얘는 병합해서 써도 될듯.
      <Stack.Screen name="PlusPhoto" component={isAndroid ? AndroidPlusPhoto : PlusPhoto} options={{title:"사진 추가"}}/> */}
      <Stack.Screen name="AccusePetLog" component={AccusePetLog} options={{title:"게시물 신고"}}/>
    </Stack.Navigator>
  );
}
export default SharedStackNav;

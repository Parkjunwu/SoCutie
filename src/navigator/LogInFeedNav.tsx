import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NewPostFeed from '../components/feed/feedTab/NewPostFeed';
import FollowersFeed from '../components/feed/feedTab/FollowersFeed';
import { colors } from '../color';
import WhenOpenFeedThenGetNumberOfUnreadMessageAndSetHeaderMessage from '../components/feed/WhenOpenFeedThenGetNumberOfUnreadMessage';
import { isAndroid } from '../utils';
import useIsDarkMode from '../hooks/useIsDarkMode';

const Tab = createMaterialTopTabNavigator();

const LogInFeedNav = ({setFeedOptions}) => {
  // Feed 들어올 때 안읽은 메세지 갯수 받고 헤더 오른쪽에 메세지 버튼 생성함.
  WhenOpenFeedThenGetNumberOfUnreadMessageAndSetHeaderMessage();

  // const darkModeSubscription = useColorScheme();
  // const isDarkMode = darkModeSubscription === "dark";
  const isDarkMode = useIsDarkMode();

  return (
    <Tab.Navigator
      // 이거 넣어야 처음에 화면 안짤림. react-native-pager-view 버그.
      sceneContainerStyle={{
        overflow: 'visible'
      }}
      screenOptions={{
        tabBarStyle:{
          height: 30,
          backgroundColor: isDarkMode ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.7)"
        },
        tabBarLabelStyle:{
          // color:isDarkMode?"white":"black",
          fontSize: 14,
          fontWeight: isAndroid ? 'bold' : "600"
        },
        tabBarContentContainerStyle:{
          height:30,
          alignItems:"center"
        },
        tabBarActiveTintColor: isDarkMode ? colors.yellow : colors.darkYellow,
        tabBarInactiveTintColor: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
        tabBarIndicatorStyle:{
          backgroundColor: isDarkMode ? colors.yellow : colors.darkYellow,
        },
        swipeEnabled: isAndroid ? false : true,
      }}
    >
      <Tab.Screen name="NewPostFeed" options={{title:"새로운 포스팅"}}>
        {()=><NewPostFeed setFeedOptions={setFeedOptions} />}
      </Tab.Screen>
      <Tab.Screen name="FollowersFeed" options={{title:"내 이웃 소식"}}>
        {()=><FollowersFeed setFeedOptions={setFeedOptions} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default LogInFeedNav;
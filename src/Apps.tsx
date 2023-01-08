import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { ApolloProvider } from "@apollo/client";
import client, { cache } from "./apollo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";
import 'react-native-gesture-handler';
import { ThemeProvider } from "styled-components/native";
import { darkMode, lightMode } from "./styles";
import { useColorScheme } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import setPushNotification from "./deivcePushNotification";
import BeforeSplashHide from "./BeforeSplashHide";

setPushNotification();


export default function Apps() {

  const darkModeSubscription = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  const preloadFonts = async() => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    await Promise.all([...fontPromises]);
  };

  // const preloadLocalImages = async () => {
  //   const localImagesToLoad = [
  //     // require("../assets/logo.png"),
  //     // require("../assets/no_user.png"),
  //     image.logo,
  //     image.no_user,
  //   ];
  //   const sources = await Promise.all(
  //     localImagesToLoad.map(async (uri) => ({
  //       // uri: await loadImage(uri)
  //       uri: await getCachedLocalImageAsync(uri)
  //     }))
  //   );
  //   FastImage.preload(sources);
  // };


  const preload = async() => {

    // apollo 캐시 저장

    // 왜 캐시 저장을 얘까지 두개 쓰고 있던 거지?
    // const persistor = new CachePersistor({
    //   cache,
    //   storage: new AsyncStorageWrapper(AsyncStorage),
    // });

    const toDoList = [
      await persistCache({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
      }),
      await preloadFonts(),
      // preloadLocalImages 는 BeforeSplashHide 에서.
      // await preloadLocalImages(),
    ];
    
    // 여기서 await Promise.all 로
    await Promise.all(toDoList)
  };

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await preload();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }


  return (
    // ErrorCatchApps 를 재귀함수로 만들었는데 뭐 이상하면 이거 확인. 오류났을 때 로그아웃 시키는 애.
    <SafeAreaProvider>
      <ThemeProvider theme={darkModeSubscription === "light" ? lightMode : darkMode}>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <BeforeSplashHide />
            {/* splash screen 받는 애 */}
            {/* <View
              style={{ flex: 1 }}
              onLayout={onLayoutRootView}
            > */}
              {/* 로그인 안하면 못써. 근데 얘도 HomeNav 바꿔야함. 내부에서 navigate 가 안됨. 상위 nav 가 없어서 */}
              {/* {isLoggedIn?<HomeNav/>:<AuthNav/>} */}
              {/* 로그인 안해도 쓸 수 있도록 */}
              {/* <RootNav />
            </View> */}
          </NavigationContainer>
        </ApolloProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

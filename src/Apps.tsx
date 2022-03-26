import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { isLoggedInVar, tokenVar, cache } from "./apollo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, CachePersistor, persistCache } from "apollo3-cache-persist";
import 'react-native-gesture-handler';
import LoggedInNav from "./screens/LoggedInNav";
import LoggedOutNav from "./screens/LoggedOutNav";
import { ThemeProvider } from "styled-components/native";
import { darkMode, lightMode } from "./styles";
import { useColorScheme } from "react-native";
import ErrorCatchApps from "./ErrorCatchApps";

export default function Apps() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkModeSubscription = useColorScheme();
  const [isAppNotReady, setIsAppNotReady] = useState(true);
  const onFinish = () => setIsAppNotReady(false);

  const preloadAssets = async() => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [
      // require("../assets/logo.png"),
      require("../assets/logo.png"),
    ];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    await Promise.all([...fontPromises, ...imagePromises]);
  };

  const preload = async() => {
    const token = await AsyncStorage.getItem("token")
    // token 검증 로직 필요함. 토큰 만료시 다시 받는 것도 구현
    if(token) {
      isLoggedInVar(true);
      tokenVar(token);
    };
    await preloadAssets();
    await persistCache({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
      /////
      // serialize:undefined,
    });
    const persistor = new CachePersistor({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });
    // await persistor.restore();
    // await persistor.purge(); 
    // await persistor.remove();
    // cache.gc();
    // cache.evict({ id: 'ROOT_QUERY' })
    // 얘가 다 삭제인듯
    // client.resetStore()

  };
  if (isAppNotReady) {
    return (
      <AppLoading
        startAsync={preload}
        onError={console.warn}
        onFinish={onFinish}
      />
    );
  };
  
  return (
    // ErrorCatchApps 를 재귀함수로 만들었는데 뭐 이상하면 이거 확인. 오류났을 때 로그아웃 시키는 애.
    <ErrorCatchApps>
      <ThemeProvider theme={darkModeSubscription === "light" ? lightMode : darkMode}>
        <ApolloProvider client={client}>
          <NavigationContainer>
            {/* 로그인 안하면 못써 */}
            {isLoggedIn?<LoggedInNav/>:<LoggedOutNav/>}
          </NavigationContainer>
        </ApolloProvider>
      </ThemeProvider>
    </ErrorCatchApps>
  );
};

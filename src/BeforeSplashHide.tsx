import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { View } from "react-native";
import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { ME_FRAGMENT } from "./fragment";
import { autoLogin, autoLoginVariables } from "./__generated__/autoLogin";
import useLogOut from "./hooks/useLogOut";
import EncryptedStorage from 'react-native-encrypted-storage';
import { isLoggedInVar, REFRESH_TOKEN, accessTokenVar, logoUriVar, noUserUriVar } from "./apollo";
import FastImage from "react-native-fast-image";
import { getLogoImageLocalUri, getNoUserImageLocalUri } from "./logic/getImageLocalUri";
import RootView from "./navigator/RootView";

const AUTO_LOGIN = gql`
  mutation autoLogin($token: String!) {
    autoLogin(token:$token) {
      ok
      error
      loggedInUser {
        # useMe 랑 똑같음
        ...MeFragment
      }
      accessToken
    }
  }
  ${ME_FRAGMENT}
`;

type AutoLoginOnCompleted = (data: autoLogin)=>void

// ApolloProvider 받은 이후에 해야 하는 애들
const BeforeSplashHide = () => {

  const [autoLogin,{data}] = useMutation<autoLogin,autoLoginVariables>(AUTO_LOGIN,{
    fetchPolicy:"network-only",
  });

  const logOut = useLogOut();

  const cacheUpdateMeData: MutationUpdaterFunction<autoLogin, autoLoginVariables, DefaultContext, ApolloCache<any>> = async (cache,data) => {
    if(data.data?.autoLogin.ok) {
      // useMe 에 캐시
      const loggedInUserData = data.data.autoLogin.loggedInUser;
      const userId = loggedInUserData.id;
      const ref = cache.writeFragment({
        id:`User:${userId}`,
        fragment:gql`
          fragment Me on User {
            id
            userName
            avatar
            bio
            totalFollowing
            totalFollowers
          }
        `,
        data:loggedInUserData
      });
      cache.modify({
        id:"ROOT_QUERY",
        fields:{
          me(){
            return ref;
          }
        }
      });
    } else {
      await logOut();
    }
  };


  const preloadLocalImageAndSetReactiveVar = async () => {
    const setLogoImage = async () => {
      const logoUri = await getLogoImageLocalUri();
      logoUriVar(logoUri);
      return { uri: logoUri };
    };

    const setNoUserImage = async () => {
      const no_UserUri = await getNoUserImageLocalUri();
      noUserUriVar(no_UserUri);
      return { uri: no_UserUri };
    };
    
    const localImagesToLoad = [
      await setLogoImage(),
      await setNoUserImage(),
    ];

    const sources = await Promise.all(localImagesToLoad);

    FastImage.preload(sources);
  };

    
  const ifTokenThenAutoLogin = async () => {

    const isToken = await EncryptedStorage.getItem(REFRESH_TOKEN);

    const reactiveVarUpdateAndCacheImage: AutoLoginOnCompleted = async(data) => {
      if(data.autoLogin.ok){
        const accessToken = data.autoLogin.accessToken;
        accessTokenVar(accessToken);
        isLoggedInVar(true);
        const userAvatar = data.autoLogin.loggedInUser.avatar;
        if(userAvatar) {
          FastImage.preload([
            { uri: userAvatar }
          ]);
        }
      } else {
        await EncryptedStorage.removeItem(REFRESH_TOKEN);
      }
    };

    if(isToken) {
      await autoLogin({
        variables:{
          token:isToken
        },
        onCompleted:reactiveVarUpdateAndCacheImage,
        update:cacheUpdateMeData
      });
    }
  };

  const preload = async() => {
    const toDoList = [
      await preloadLocalImageAndSetReactiveVar(),
      await ifTokenThenAutoLogin(),
    ];
    
    // 여기서 await Promise.all 로
    await Promise.all(toDoList);
    // await client.resetStore();
  };

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await preload();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  console.log("appIsReady")
  console.log(appIsReady)

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // 얘 없으면 SplashScreen.hideAsync 안됨
  if (!appIsReady) {
    return null;
  }

  return (
    <View
      style={{ flex: 1 }}
      onLayout={onLayoutRootView}
    >
      {/* 로그인 안하면 못써. 근데 얘도 HomeNav 바꿔야함. 내부에서 navigate 가 안됨. 상위 nav 가 없어서 */}
      {/* {isLoggedIn?<HomeNav/>:<AuthNav/>} */}
      {/* 로그인 안해도 쓸 수 있도록 */}
      {/* <RootNav /> */}
      {/* 유저 삭제시 캐시 삭제 에러떠서 걍 이렇게 함. LogOut 캐시 삭제도 여기 넣어도 됨. */}
      <RootView/>
    </View>
  )
};

export default BeforeSplashHide;
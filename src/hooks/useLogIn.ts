import { gql, useMutation } from "@apollo/client";
import messaging from '@react-native-firebase/messaging';
import client, { isLoggedInVar, REFRESH_TOKEN, accessTokenVar } from "../apollo";
import EncryptedStorage from 'react-native-encrypted-storage';
import { registerPushNotiToken, registerPushNotiTokenVariables } from "../__generated__/registerPushNotiToken";
import useMe from "./useMe";

const REGISTER_PUSH_NOTI_TOKEN = gql`
  mutation registerPushNotiToken( $deviceToken: String! ) {
    registerPushNotiToken( deviceToken: $deviceToken ){
      ok
      error
    }
  }
`;

const useLogIn = () => {
  const [register] = useMutation<registerPushNotiToken,registerPushNotiTokenVariables>(REGISTER_PUSH_NOTI_TOKEN);
  
  // me 데이터 refetch. useLogOut 에선 안해도 될라나?
  const {refetch} = useMe();
  
  const logInFunctionNeedToken = async(accessToken:string,refreshToken:string) => {
    
    // 얘네는 일단 try catch 안함. 내부로직이라.. 근데 해야겠지?
    // 캐시 삭제
    await client.resetStore();
    // 토큰을 EncryptedStorage 에서 가져옴
    await EncryptedStorage.setItem(REFRESH_TOKEN,refreshToken);
    // login 전역변수 변경
    // isLoggedInVar 를 먼저 변경해서? me 받고 로그아웃됨.? accessTokenVar 를 먼저 받아봄. 일단 되긴 하는데.
    accessTokenVar(accessToken);
    await refetch();
    
    isLoggedInVar(true);
    // me 데이터를 LogIn 에서 받음. 여기서 받으면 Feed 에 Nav 넣으니까 안됨. 그냥 Feed 만 있을 땐 됬음.
    // EncryptedStorage 에 토큰이 들어가야 context 를 줄 수 있음.
    try {
      // 디바이스가 등록이 안되어 있으면 등록. 처음 설치했을때만 실행됨.
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
        // 토큰 받음
      const deviceToken = await messaging().getToken();
        // 토큰 백엔드 업로드
      const isRegisterOk = await register({
        variables:{
          deviceToken
        }
      });
      if(!isRegisterOk.data.registerPushNotiToken.ok) {
        console.log("useLogIn 의 registerPushNotiToken / 토큰 등록 실패")
        console.log(isRegisterOk.data.registerPushNotiToken.error);
      }
    } catch (error) {
      console.log("useLogIn / 토큰 받기 or 등록 실패");
      console.error(error);
    }

  };
  return logInFunctionNeedToken;
};

export default useLogIn;
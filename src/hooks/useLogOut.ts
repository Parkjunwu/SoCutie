import { gql, useMutation } from "@apollo/client";
import client, { isLoggedInVar, REFRESH_TOKEN, accessTokenVar } from "../apollo";
import EncryptedStorage from 'react-native-encrypted-storage';
import { deletePushNotiToken } from "../__generated__/deletePushNotiToken";

const DELETE_PUSH_NOTI_TOKEN = gql`
  mutation deletePushNotiToken {
    deletePushNotiToken {
      ok
      error
    }
  }
`;

const useLogOut = () => {
  const [deletePushNotiToken] = useMutation<deletePushNotiToken>(DELETE_PUSH_NOTI_TOKEN);
  
  const logOut = async() => {

    // 백엔드에서 로그인 정보를 받아야 하니 캐시보다 먼저 실행
    const deleteDeviceToken = await deletePushNotiToken();

    if(!deleteDeviceToken.data.deletePushNotiToken.ok) {
      console.log("useLogOut 의 deletePushNotiToken / 토큰 삭제 실패");
    }

    // 캐시 삭제를 accessTokenVar 밑에 놓으니까 오류남.. 왠진 모름.
    await client.resetStore();
    await EncryptedStorage.removeItem(REFRESH_TOKEN);
    // accessTokenVar(null) 로 하니까 header 에 'null' 로 가짐.
    accessTokenVar('');
    isLoggedInVar(false);
  };
  return logOut;
};

export default useLogOut;
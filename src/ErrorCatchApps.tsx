// import React from "react";
// import { Alert } from "react-native";
// import { logUserOut } from "./apollo";
// import useLogOut from "./hooks/useLogOut";


// 로그아웃 로직
// export const logUserOut = async() => {
//   // 캐시 삭제를 accessTokenVar 밑에 놓으니까 오류남.. 왠진 모름.
//   await client.resetStore();
//   await EncryptedStorage.removeItem(REFRESH_TOKEN);
//   isLoggedInVar(false);
//   // null 로 하니까 header 에 'null' 로 가짐.
//   // accessTokenVar(null);
//   accessTokenVar('');
// };

// // 오류 발생시 오류를 콘솔에 찍고 로그아웃 시킴. 재귀함수?? 로 만들었는데 될지는 모르겠음.
// // 근데 얘는 앱 처음 렌더링할때만 받고 나중에 나는 에러는 못받는 듯?
// const ErrorCatchApps:React.FC = ({children}) => {
//   console.log("ErrorCatchApps");
//   try {
//     return <>
//       {children}
//     </>
//   } catch (e) {
//     Alert.alert(
//       "알 수 없는 오류가 발생하였습니다.",
//       "같은 문제가 지속적으로 발생시 문의 주시면 감사드리겠습니다.",
//       [
//         {text:"확인"}
//       ]
//     );
//     console.error("ErrorCatchApps // Apps Error is "+e);
//     return <ErrorCatchApps />
//   }
// };

// export default ErrorCatchApps;
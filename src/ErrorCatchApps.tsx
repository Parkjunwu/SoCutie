import React from "react";
import { Alert } from "react-native";
import { logUserOut } from "./apollo";

// 오류 발생시 오류를 콘솔에 찍고 로그아웃 시킴. 재귀함수?? 로 만들었는데 될지는 모르겠음.
const ErrorCatchApps:React.FC = ({children}) => {
  console.log("ErrorCatchApps");
  try {
    return <>
      {children}
    </>
  } catch (e) {
    Alert.alert(
      "알 수 없는 오류가 발생하였습니다.",
      "같은 문제가 지속적으로 발생시 문의 주시면 감사드리겠습니다.",
      [
        {text:"확인"}
      ]
    );
    console.error("Apps Error is "+e);
    logUserOut();
    return <ErrorCatchApps />
  }
};

export default ErrorCatchApps;
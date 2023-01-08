import React, { useEffect } from "react";
import styled from "styled-components/native";

const LogOutView = styled.View`
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
  justify-content: center;
  align-items: center;
`;
const LogOutText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 16px;
  font-weight: 600;
`;

const LogOutCompletedView = ({navigation}) => {
  useEffect(()=>{
    setTimeout(()=>{
      navigation.navigate("FeedTab",{
        screen:"Feed"
      });
    },1000)
  },[]);
  return <LogOutView>
    <LogOutText>정상적으로 로그아웃 되었습니다.</LogOutText>
  </LogOutView>
}

export default LogOutCompletedView;
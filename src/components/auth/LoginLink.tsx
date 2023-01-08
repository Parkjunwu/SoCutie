import React from "react";
import { Platform } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";

const LoginLinkText = styled.Text<{isAndroid:boolean}>`
  color: ${colors.brown};
  font-weight: ${props=>props.isAndroid ? 'bold' : 600};
  margin-top: 10px;
`;

const LoginLink:React.FC = ({children}) => {
  const isAndroid = Platform.OS === "android";
  return <LoginLinkText isAndroid={isAndroid}>
    {children}
  </LoginLinkText>;
};

export default LoginLink;
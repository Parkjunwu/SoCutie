import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: ${props=>props.theme.backgroundColor};
  flex:1;
`;
interface IScreenProps {
  loading:boolean
}

const ScreenLayout: React.FC<IScreenProps> = ({loading, children}) => {
  return <Container>
    {loading ? <ActivityIndicator color="white" /> : children}
  </Container>;
}
export default ScreenLayout;
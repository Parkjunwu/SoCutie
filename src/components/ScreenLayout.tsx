import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: black;
  flex:1;
  /* align-items: center; */
  /* justify-content: center; */
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
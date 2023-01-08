import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import PetLogHeaderComponent from "./PetLogHeaderComponent";

const Container = styled.View`
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
  padding: 10px;
`;
const ActivityIndicatorContainer = styled.ActivityIndicator`
  margin: 100px auto;
`

type PetLogHeaderComponentType = {
  id: number;
  title: string;
  createdAt: string;
  user: {
    id: number,
    userName: string,
    avatar: string,
  };
  likes:number;
  commentNumber:number;
};

const PetLogLoading = (props:PetLogHeaderComponentType) => {
  return (
    <Container>
      <PetLogHeaderComponent {...props}/>
      <ActivityIndicatorContainer />
    </Container>
  );
};

export default PetLogLoading;
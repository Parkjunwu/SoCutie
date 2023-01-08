import { ApolloQueryResult } from "@apollo/client";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  margin: 30px auto;
  align-items: center;
  justify-content: center;
`;
const SeePetLogText = styled.Text`
  color: ${props=>props.theme.textColor};
`;

type PushNotificationPetLogListEmptyComponentProps = {
  petLogRefetch:(variables?: Partial<{
    petLogId: number;
  }>) => Promise<ApolloQueryResult<any>>,
  loading:boolean
}

const PushNotificationPetLogListEmptyComponent = ({petLogRefetch,loading}: PushNotificationPetLogListEmptyComponentProps) => {

  const onPressSeePetLog = () => {
    petLogRefetch();
  };

  return (
    <Container>
      {loading ?
        <ActivityIndicator/>
        :
        <TouchableOpacity onPress={onPressSeePetLog}>
          <SeePetLogText>게시물 보기</SeePetLogText>
        </TouchableOpacity>
      }
    </Container>
  )
};

export default PushNotificationPetLogListEmptyComponent;
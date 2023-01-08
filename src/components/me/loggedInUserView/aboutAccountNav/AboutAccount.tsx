import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
`;
const EachBtn = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: grey;
  margin: 0px 20px;
`;
const EachBtnText = styled.Text`
  color: ${props=>props.theme.textColor};
  padding: 10px 5px;
`;

const AboutAccount = ({navigation}) => {
  
  const onPressSeeBlockUsers = () => {
    navigation.navigate("SeeBlockUsers");
  };

  const onPressAccountWithdrawal = () => {
    navigation.navigate("AccountWithdrawal");
  };

  return (
    <Container>
      <EachBtn onPress={onPressSeeBlockUsers}>
        <EachBtnText>차단한 유저 보기</EachBtnText>
      </EachBtn>
      <EachBtn onPress={onPressAccountWithdrawal}>
        <EachBtnText>회원 탈퇴</EachBtnText>
      </EachBtn>
    </Container>
  );
};

export default AboutAccount;
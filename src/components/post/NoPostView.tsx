import styled from "styled-components/native";

const Container = styled.View`
  background-color: ${props=>props.theme.backgroundColor};
  margin: 100px auto;
`;
const NoDataText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 16px;
  font-weight: bold;
`;

const NoPostView = () => {

  return (
    <Container>
      <NoDataText>존재하지 않는 게시물 입니다.</NoDataText>
    </Container>
  );
};

export default NoPostView;
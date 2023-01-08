import styled from "styled-components/native";
import { colors } from "../../../color";

const Container = styled.View`
  background-color: ${props => props.theme.backgroundColor};
  flex:1;
`;
const CreateCommentContainer = styled.View<{disabled:boolean}>`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: auto 20px;
  opacity:${props => props.disabled ? 0.5 : 1};
`;
const CommentInput = styled.TextInput<{isAndroid:boolean}>`
  padding: ${props=>props.isAndroid ? "7px 10px" : "10px"};
  background-color: ${props=>props.theme.textInputBackgroundColor};
  border-radius: ${props=>props.isAndroid ? "5px" : "3px"};
  width: 85%;
`;
const CreateCommentBtn = styled.TouchableOpacity<{isAndroid:boolean}>`
  border-radius: ${props=>props.isAndroid ? "5px" : "3px"};
  /* background-color: rgba(255,0,0,0.8); */
  background-color: ${colors.yellow};
`;
const CreateCommentBtnText = styled.Text<{isAndroid:boolean}>`
  padding: ${props=>props.isAndroid ? "8px" : "10px"};
  font-size: 15px;
  font-weight: 600;
`;
const NoCommentText = styled.Text`
  text-align: center;
  padding-top: 30px;
  color: ${props=>props.theme.textColor};
`;
const LoadingText = styled(NoCommentText)``;

const FlatListContainer = styled.View`
  flex: 12;
`;
const MarginTopBottomContainer = styled.View`
  margin-top: 12px;
  padding-top: 3px;
  margin-bottom: 35px;
  padding-bottom: 15px;
  background-color: rgba(249,224,118,0.3);
`;
const LoadingView = () => (
  <Container>
    <LoadingText>Loading...</LoadingText>
  </Container>
);

const NoDataView = () => (
  <Container>
    <NoCommentText>댓글이 없습니다.</NoCommentText>
  </Container>
);

export {
  Container,
  CreateCommentContainer,
  CommentInput,
  CreateCommentBtn,
  CreateCommentBtnText,
  NoCommentText,
  FlatListContainer,
  MarginTopBottomContainer,
  LoadingView,
  NoDataView,
};
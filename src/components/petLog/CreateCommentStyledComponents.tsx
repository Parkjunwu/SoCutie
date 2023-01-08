import styled from "styled-components/native";
import { colors } from "../../color";

const CreateCommentContainer = styled.View<{disabled:boolean}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
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
  background-color: ${colors.yellow};
`;
const CreateCommentBtnText = styled.Text<{isAndroid:boolean}>`
  padding: ${props=>props.isAndroid ? "8px" : "10px"};
  font-size: 15px;
  font-weight: 600;
`;

export { CreateCommentContainer, CommentInput,
CreateCommentBtn, CreateCommentBtnText, }
import React, { useState } from "react";
import styled from "styled-components/native";

const Container = styled.View`
  margin-left: 80px;
  flex-direction: row;
`;
const CreateCommentOfComment = styled.TextInput`
  color: ${props => props.theme.textColor};
`;
const CreateCommentOfCommentBtn = styled.TouchableOpacity`

`;
const CreateCommentOfCommentBtnText = styled.Text`
  color: ${props => props.theme.textColor};
`;

type Props = {
  onPressCreateCommentOfComment: (payload: string) => void;
}

const CreateCommentOfCommentContainer = ({onPressCreateCommentOfComment}:Props) => {
  const [commentOfCommentValue,setCommentOfCommentValue] = useState("");
  const onPressBtn = () => {
    onPressCreateCommentOfComment(commentOfCommentValue);
    setCommentOfCommentValue("");
  };
  return(
    <Container>
      <CreateCommentOfComment
        placeholder="댓글 달기"
        value={commentOfCommentValue}
        onChangeText={(text)=>setCommentOfCommentValue(text)}  
      />
      <CreateCommentOfCommentBtn onPress={onPressBtn}>
        <CreateCommentOfCommentBtnText>작성</CreateCommentOfCommentBtnText>
      </CreateCommentOfCommentBtn>
    </Container>
  );
};

export default CreateCommentOfCommentContainer;
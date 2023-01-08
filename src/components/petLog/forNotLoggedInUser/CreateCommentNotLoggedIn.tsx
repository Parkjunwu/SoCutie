import { isAndroid } from "../../../utils";
import { CommentInput, CreateCommentBtn, CreateCommentBtnText, CreateCommentContainer } from "../CreateCommentStyledComponents";

const CreateCommentNotLoggedIn = () => {

  return (
    <CreateCommentContainer
      disabled={true}
    >
      <CommentInput placeholder="댓글 작성은 로그인 후 이용 가능합니다." editable={false} isAndroid={isAndroid} />
      <CreateCommentBtn
        isAndroid={isAndroid}
        disabled={true}
      >
        <CreateCommentBtnText isAndroid={isAndroid}>작성</CreateCommentBtnText>
      </CreateCommentBtn>
    </CreateCommentContainer>
  );
};

export default CreateCommentNotLoggedIn;
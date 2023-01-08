import {
  CreateCommentContainer,
  CommentInput,
  CreateCommentBtn,
  CreateCommentBtnText,
} from "./logInUser/AndroidAndIOSStyledComponent";

type CreateCommentProps = {
  disabled: boolean;
  // disabled: Function;
  placeholder: string;
  // placeholder: Function;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isAndroid: boolean;
  onPressCreateComment: ()=>void;
  onFocusCreateComment?: ()=>void;
};

const CreateComment = ({disabled,placeholder,value,setValue,isAndroid,onPressCreateComment,onFocusCreateComment,}:CreateCommentProps) => {

  return (
    // <CreateCommentContainer disabled={disabled()}>
    <CreateCommentContainer disabled={disabled}>
      <CommentInput
        // placeholder={placeholder()}
        placeholder={placeholder}
        value={value}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(text)=>setValue(text)}
        // editable={!disabled()}
        editable={!disabled}
        // onFocus={onFocusCreateComment}
        {...onFocusCreateComment && ({onFocus:onFocusCreateComment})}
        isAndroid={isAndroid}
      />
      <CreateCommentBtn
        isAndroid={isAndroid}
        // disabled={disabled()}
        disabled={disabled}
        onPress={onPressCreateComment}
      >
        <CreateCommentBtnText isAndroid={isAndroid}>작성</CreateCommentBtnText>
      </CreateCommentBtn>
    </CreateCommentContainer>
  );
};

export default CreateComment;
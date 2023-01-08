import { Platform } from "react-native";
import styled from "styled-components/native";

const KeyboardAvoidView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const MessageKeyboardAvoidLayout:React.FC = ({children}) => {
  return (
    <KeyboardAvoidView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // behavior="position"
      // position 이 아닌데 왜 되는거지?
      style={{flex:1}}
      // contentContainerStyle={{flex:1}}
      keyboardVerticalOffset={50}
    >
      {children}
    </KeyboardAvoidView>
  );
};
export default MessageKeyboardAvoidLayout;
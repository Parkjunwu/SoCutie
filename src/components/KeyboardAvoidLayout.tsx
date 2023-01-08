import { Platform } from "react-native";
import styled from "styled-components/native";

const KeyboardAvoidView = styled.KeyboardAvoidingView`
  flex: 1;
`;

// MessageKeyboardAvoidLayout 랑 똑같음. 근데 MessageKeyboardAvoidLayout 에서 원래 behavior="position" 했을 때 FlatList 한번에 움직여서 이래 한건데.. 만약 계속 똑같으면 그냥 합침.
// UploadForm 에서는 그냥 behavior="position" 하니까 되네. 뭐지..
const KeyboardAvoidLayout:React.FC = ({children}) => {
  return (
    <KeyboardAvoidView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex:1}}
      keyboardVerticalOffset={120}
    >
      {children}
    </KeyboardAvoidView>
  );
};
export default KeyboardAvoidLayout;
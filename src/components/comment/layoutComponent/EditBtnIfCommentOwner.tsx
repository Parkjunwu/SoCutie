import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "react-native";
import { useState } from "react";

// const Container = styled.View`
//   /* width: 10%; */
// `;
const EditBtn = styled.TouchableOpacity`
  width: 10%;
  /* flex: 1; */
`;
// const OptionModal = styled.Modal`
//   background-color: tomato;
//   flex: 1;
//   justify-content: center;
//   align-items: center;
// `;
// const V = styled.View`
//   background-color: yellow;
//   flex: 1;
//   width: 50px;
//   height: 50px;
//   justify-content: center;
//   align-items: center;
// `;
const EditBtnIfCommentOwner = ({isMine}) => {
  const darkModeSubscription = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const onPressEditBtn = () => {
    setModalVisible(prev => !prev)
  };
  return (
    // <Container>
      // <OptionModal
      //   visible={modalVisible}
      //   // transparent={true}
      // >
      //   <V></V>
      // </OptionModal>
      <EditBtn onPress={onPressEditBtn}>
        {isMine && <Ionicons name="ellipsis-vertical-outline" size={24} color={darkModeSubscription === 'light' ? "black" : "white"} />}
      </EditBtn>
    // </Container>
  )
};
export default EditBtnIfCommentOwner ;
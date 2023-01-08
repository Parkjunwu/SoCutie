import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const PlusPhotoPressable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  /* background-color: red; */
`;
const PlusPhotoText = styled.Text<{tintColor:string}>`
  color: ${props=>props.tintColor};
  font-size: 16px;
`;

const EditPetLogPlusPhotoBtn = ({tintColor}) => {

  const navigation = useNavigation();

  return (
    <PlusPhotoPressable
      onPress={() => navigation.navigate("PetLogSelectPhoto",{
        from:"editPetLog",
      })}
    >
      <PlusPhotoText tintColor={tintColor} >사진 추가</PlusPhotoText>
      <Ionicons name="ios-add-sharp" size={23} color={tintColor}/>
    </PlusPhotoPressable>
  );
};

export default EditPetLogPlusPhotoBtn;
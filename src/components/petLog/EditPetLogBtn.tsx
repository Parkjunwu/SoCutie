import { Feather } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native";
import useIsDarkMode from "../../hooks/useIsDarkMode";


const EditPetLogBtn = () => {

  const onPressEdit = () => {
    // Alert
    // navigate
  };

  const isDarkMode = useIsDarkMode();

  return (
    <TouchableOpacity onPress={onPressEdit}>
      <Feather name="edit-3" size={24} color={isDarkMode ? "white" : "black"} />
    </TouchableOpacity>
  )
};

export default EditPetLogBtn;
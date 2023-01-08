import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"

const GoToSearchPetLogBtn = ({tintColor,navigation}) => (
  <TouchableOpacity onPress={()=>navigation.navigate("SearchPetLog")}>
    <Ionicons name="ios-search" color={tintColor} size={30}/>
  </TouchableOpacity>
);

export default GoToSearchPetLogBtn;
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"

const GoToSearchPostAndUserBtn = ({tintColor,navigation}) => (
  <TouchableOpacity onPress={()=>navigation.navigate("Search")}>
    <Ionicons name="ios-search" color={tintColor} size={30}/>
  </TouchableOpacity>
);

export default GoToSearchPostAndUserBtn;
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const HamburgerBtn = ({tintColor}) => {
  const navigation = useNavigation();

  const onPressLogOut = ()=> navigation.openDrawer()

  return (
    <TouchableOpacity onPress={onPressLogOut} style={{marginRight:5}} >
      <Ionicons name="reorder-three-outline" size={30} color={tintColor} />
    </TouchableOpacity>
  );
};

export default HamburgerBtn;
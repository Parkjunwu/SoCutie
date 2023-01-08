import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavStackParamsList from "../../types/rootNavStackParamsList";


const GoHomeBtn = ({tintColor}) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootNavStackParamsList,"PushNotificationPetLog">>();

  return (
    <TouchableOpacity
      style={{
        flexDirection:"row"
      }}
      onPress={()=>navigation.navigate("HomeNav")}
    >
      {/* <Ionicons name="chevron-back-sharp" size={22} color={tintColor} /> */}
      <Ionicons name="ios-home" size={22} color={tintColor} />
    </TouchableOpacity>
  )
};

export default GoHomeBtn;
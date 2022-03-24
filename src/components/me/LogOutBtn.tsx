import { Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { logUserOut } from "../../apollo";

const onPressLogOut = () => {
    Alert.alert("로그아웃 하시겠습니까?",null,[
      { text: "로그아웃", onPress: () => logUserOut() },
      {
        text: "취소",
        style: 'destructive'
      },
    ],
    { cancelable: true, })
  };

const LogOutBtn = ({tintColor}) => {
  return (
    <TouchableOpacity onPress={onPressLogOut} >
      <Ionicons name="log-out-outline" size={24} color={tintColor} />
    </TouchableOpacity>
  );
};

export default LogOutBtn;
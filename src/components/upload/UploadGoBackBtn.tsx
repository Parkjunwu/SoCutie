import { useNavigation } from "@react-navigation/native";
import { Alert, OpaqueColorValue, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type UploadGoBackBtnProps = {
  tintColor: string;
  whichComponent: string;
  alertCheck?: boolean;
};

const UploadGoBackBtn = ({tintColor,whichComponent,alertCheck}:UploadGoBackBtnProps) => {

  const navigation = useNavigation();
  const onPressBtn = () => {
    if(whichComponent === "UploadPetLog") {
      const navigateToFeedTab = () => navigation.navigate("FeedTab");
      if(alertCheck) {
        Alert.alert(
          "팻로그 업로드를 취소하시겠습니까?",
          "작성하신 내용은 유실됩니다.",
          [
            {
              text:"취소하고 뒤로가기",
              onPress:()=>navigateToFeedTab(),
              style:"destructive"
            },
            {
              text:"계속 작성",
            }
          ]  
        )
      } else {
        navigateToFeedTab();
      }
    } else {
      navigation.goBack(); 
    }
  }

  return (
    <TouchableOpacity onPress={onPressBtn}>
      <Ionicons name={whichComponent === "PetLogSelectPhoto" ? "chevron-back" : "close"} size={24} color={tintColor}/>
    </TouchableOpacity>
  );
};

export default UploadGoBackBtn;
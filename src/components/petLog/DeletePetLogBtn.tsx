import { useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native";
import DELETE_PETLOG from "../../gql/deletePetLog";
import useIsDarkMode from "../../hooks/useIsDarkMode";


const DeletePetLogBtn = () => {

  const [deletePetLog,{}] = useMutation(DELETE_PETLOG,{
    variables:{
      // id:route.params.id,
    },
    update:(cache,data)=>{
      // if(ok){
        // Alert.alert
        // navigate
      // } else {
        // Alert.alert
      // }
    }
  });

  const onPressDelete = async() => {
    // Alert.alert
    // await deletePetLog();
  };

  const isDarkMode = useIsDarkMode();

  return (
    <TouchableOpacity onPress={onPressDelete}>
      <Ionicons name="trash" size={24} color={isDarkMode ? "white" : "black"} />
    </TouchableOpacity>
  )
};

export default DeletePetLogBtn;
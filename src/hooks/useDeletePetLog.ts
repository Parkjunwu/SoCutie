import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import DELETE_PETLOG from "../gql/deletePetLog";
import { deletePetLog, deletePetLogVariables } from "../__generated__/deletePetLog";

const useDeletePetLog = (petLogId:number) => {

  const navigation = useNavigation();

  const [deletePetLog] = useMutation<deletePetLog,deletePetLogVariables>(DELETE_PETLOG,{
    variables:{
      id:petLogId,
    },
    update:(cache,data)=>{
      if(data.data?.deletePetLog.ok){
        cache.evict({ id: `PetLog:${petLogId}` });
        // cache.gc();
        navigation.goBack();
        Alert.alert("삭제가 완료되었습니다.",null,[
          {
            text:"확인",
          }
        ]);
      } else if (data.data?.deletePetLog.error === "post not found") {
        Alert.alert("존재하지 않는 게시물입니다.","같은 오류가 지속적으로 발생 시 문의 주시면 감사드리겠습니다.",[
          {
            text:"확인",
          }
        ]);
      } else if (data.data?.deletePetLog.error === "Not authorized") {
        Alert.alert("다른 유저의 게시물을 삭제할 수 없습니다.",null,[
          {
            text:"확인",
          }
        ]);
      }
    }
  });

  return deletePetLog;
};

export default useDeletePetLog;
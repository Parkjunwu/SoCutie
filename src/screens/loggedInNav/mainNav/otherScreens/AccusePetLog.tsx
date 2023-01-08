import { gql, useMutation } from "@apollo/client";
import AccuseLayout from "../../../../components/AccuseLayout";

const ACCUSE_PETLOG = gql`
  mutation accusePetLog(
    $id:Int!
    $reason:Int!
    $detail:String
  ) {
    accusePetLog(
      id:$id
      reason:$reason
      detail:$detail
    ) {
      ok
      error
    }
  }
`;

const AccusePetLog = ({navigation,route}) => {

  const petLogId = route.params.petLogId;

  const [accusePetLog] = useMutation(ACCUSE_PETLOG);

  return (
    <AccuseLayout
      accuseFn={accusePetLog}
      accuseThingId={petLogId}
    />
  );
};

export default AccusePetLog;
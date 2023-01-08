import { gql } from "@apollo/client";

const DELETE_PETLOG = gql`
  mutation deletePetLog($id: Int!){
    deletePetLog(id: $id) {
      ok
      error
    }
  }
`;

export default DELETE_PETLOG;
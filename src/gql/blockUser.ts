import { gql } from "@apollo/client";

const BLOCK_USER = gql`
  mutation blockUser($id:Int!){
    blockUser(id:$id) {
      ok
      error
      beforeUnreadTotal
    }
  }
`;

export default BLOCK_USER;
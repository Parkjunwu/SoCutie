import { gql } from "@apollo/client";

const UN_BLOCK_USER = gql`
  mutation unblockUser($id:Int!){
    unblockUser(id:$id) {
      ok
      error
    }
  }
`;

export default UN_BLOCK_USER;
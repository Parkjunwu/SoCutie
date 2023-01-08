import { gql } from "@apollo/client";

const FOLLOW_USER = gql`
  mutation followUser($id: Int!) {
    followUser(id: $id){
      ok
      error
    }
  }
`;

export default FOLLOW_USER;
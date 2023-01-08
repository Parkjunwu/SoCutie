import { gql } from "@apollo/client";

const UNFOLLOW_USER = gql`
  mutation unfollowUser($id: Int!) {
    unfollowUser(id: $id){
      ok
      error
    }
  }
`;

export default UNFOLLOW_USER;
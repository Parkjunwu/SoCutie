import { gql } from "@apollo/client";

const SEE_PROFILE = gql`
  query seeProfile($id:Int!){
    seeProfile(id:$id){
      user {
        id
        userName
        bio
        avatar
        totalFollowing
        totalFollowers
        isFollowing
        isMe
      }
      error
    }
  }
`;

export default SEE_PROFILE;
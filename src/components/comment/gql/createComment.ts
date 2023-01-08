import { gql } from "@apollo/client";

const CREATE_COMMENT = gql`
  mutation createComment($payload: String!, $postId: Int!) {
    createComment(payload: $payload, postId: $postId) {
      ok
      error
      id
    }
  }
`;

export default CREATE_COMMENT;
import { gql } from "@apollo/client";

const GET_NOTIFIED_COMMENT_OF_COMMENT = gql`
  query getNotifiedCommentOfComment($commentOfCommentId:Int!) {
    getNotifiedCommentOfComment(commentOfCommentId:$commentOfCommentId) {
      commentOfComment {
        id
        user{
          id
          userName
          avatar
        }
        isMine
        payload
        createdAt
        totalLikes
        isLiked
      }
      error
    }
  }
`;

export default GET_NOTIFIED_COMMENT_OF_COMMENT;
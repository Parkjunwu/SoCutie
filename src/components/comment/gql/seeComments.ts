import { gql } from "@apollo/client";

const SEE_COMMENTS = gql`
  query seeComments($postId:Int!,$cursorId:Int,$isNotification:Boolean) {
    seeComments(postId:$postId,cursorId:$cursorId,isNotification:$isNotification) {
      cursorId
      hasNextPage
      comments{
        id
        user{
          id
          userName
          avatar
        }
        payload
        createdAt
        isMine
        totalLikes
        totalCommentOfComments
        isLiked
      }
      error
      isNotFetchMore
    }
  }
`;

export default SEE_COMMENTS;
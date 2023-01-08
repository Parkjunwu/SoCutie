import { gql } from "@apollo/client";

const SEE_COMMENT_OF_COMMENTS = gql`
  query seeCommentOfComments (
    $commentId: Int!,
    $cursorId: Int,
    $isGetAllCommentOfComments: Boolean
  ) {
    seeCommentOfComments (
      commentId: $commentId,
      cursorId: $cursorId,
      isGetAllCommentOfComments: $isGetAllCommentOfComments
    ) {
      cursorId
      hasNextPage
      commentOfComments {
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
        isLiked
      }
      error
      isNotFetchMore
      # fetchedTime
    }
  }
`;

export default SEE_COMMENT_OF_COMMENTS;
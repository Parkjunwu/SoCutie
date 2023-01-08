import { gql } from "@apollo/client";

const SEE_PETLOG_COMMENT_OF_COMMENTS = gql`
  query seePetLogCommentOfComments(
    $petLogCommentId:Int!,
    $cursorId:Int
    $isGetAllCommentOfComments:Boolean,
  ) {
    seePetLogCommentOfComments(
      petLogCommentId:$petLogCommentId,
      cursorId:$cursorId,
      isGetAllCommentOfComments:$isGetAllCommentOfComments,
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

export default SEE_PETLOG_COMMENT_OF_COMMENTS;
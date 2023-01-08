// import { gql } from "@apollo/client";

// const SEE_PETLOG_COMMENTS = gql`
//   query seePetLogComments(
//     $petLogId: Int!,
//     $cursorId: Int,
//     $isNotification: Boolean,
//   ) {
//     seePetLogComments(
//       petLogId: $petLogId,
//       cursorId: $cursorId,
//       isNotification: $isNotification,
//     ) {
//       cursorId
//       hasNextPage
//       comments {
//         id
//         user {
//           id
//           userName
//           avatar
//         }
//         payload
//         createdAt
//         isMine
//         totalLikes
//         totalCommentOfComments
//         isLiked
//       }
//       error
//       isNotFetchMore
//     }
//   }
// `;

// export default SEE_PETLOG_COMMENTS;

import { gql } from "@apollo/client";

const SEE_PETLOG_COMMENTS = gql`
  query seePetLogComments(
    $petLogId:Int!,
    $offset:Int!
  ) {
    seePetLogComments(
      petLogId: $petLogId,
      offset: $offset,
    ) {
      id
      user {
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
  }
`;

export default SEE_PETLOG_COMMENTS;
/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePetLogCommentOfComments
// ====================================================

export interface seePetLogCommentOfComments_seePetLogCommentOfComments_commentOfComments_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seePetLogCommentOfComments_seePetLogCommentOfComments_commentOfComments {
  __typename: "PetLogCommentOfComment";
  id: number;
  user: seePetLogCommentOfComments_seePetLogCommentOfComments_commentOfComments_user;
  payload: string;
  createdAt: string;
  isMine: boolean;
  totalLikes: number;
  isLiked: boolean | null;
}

export interface seePetLogCommentOfComments_seePetLogCommentOfComments {
  __typename: "SeePetLogCommentOfCommentsResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  commentOfComments: (seePetLogCommentOfComments_seePetLogCommentOfComments_commentOfComments | null)[] | null;
  error: string | null;
  isNotFetchMore: boolean | null;
}

export interface seePetLogCommentOfComments {
  seePetLogCommentOfComments: seePetLogCommentOfComments_seePetLogCommentOfComments;
}

export interface seePetLogCommentOfCommentsVariables {
  petLogCommentId: number;
  cursorId?: number | null;
  isGetAllCommentOfComments?: boolean | null;
}

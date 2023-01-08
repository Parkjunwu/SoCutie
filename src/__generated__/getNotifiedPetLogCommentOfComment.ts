/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNotifiedPetLogCommentOfComment
// ====================================================

export interface getNotifiedPetLogCommentOfComment_getNotifiedPetLogCommentOfComment_petLogCommentOfComment_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface getNotifiedPetLogCommentOfComment_getNotifiedPetLogCommentOfComment_petLogCommentOfComment {
  __typename: "PetLogCommentOfComment";
  id: number;
  user: getNotifiedPetLogCommentOfComment_getNotifiedPetLogCommentOfComment_petLogCommentOfComment_user;
  payload: string;
  createdAt: string;
  isMine: boolean;
  totalLikes: number;
  isLiked: boolean | null;
}

export interface getNotifiedPetLogCommentOfComment_getNotifiedPetLogCommentOfComment {
  __typename: "GetNotifiedPetLogCommentOfCommentResponse";
  petLogCommentOfComment: getNotifiedPetLogCommentOfComment_getNotifiedPetLogCommentOfComment_petLogCommentOfComment | null;
  error: string | null;
}

export interface getNotifiedPetLogCommentOfComment {
  getNotifiedPetLogCommentOfComment: getNotifiedPetLogCommentOfComment_getNotifiedPetLogCommentOfComment;
}

export interface getNotifiedPetLogCommentOfCommentVariables {
  petLogCommentOfCommentId: number;
}

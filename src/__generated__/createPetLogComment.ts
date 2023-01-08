/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createPetLogComment
// ====================================================

export interface createPetLogComment_createPetLogComment_offsetComments_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface createPetLogComment_createPetLogComment_offsetComments {
  __typename: "PetLogComment";
  id: number;
  user: createPetLogComment_createPetLogComment_offsetComments_user;
  payload: string;
  createdAt: string;
  isMine: boolean;
  totalLikes: number;
  totalCommentOfComments: number;
  isLiked: boolean | null;
}

export interface createPetLogComment_createPetLogComment {
  __typename: "CreatePetLogCommentResponse";
  ok: boolean;
  error: string | null;
  totalCommentsNumber: number | null;
  offsetComments: (createPetLogComment_createPetLogComment_offsetComments | null)[] | null;
}

export interface createPetLogComment {
  createPetLogComment: createPetLogComment_createPetLogComment;
}

export interface createPetLogCommentVariables {
  payload: string;
  petLogId: number;
}

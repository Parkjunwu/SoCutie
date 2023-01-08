/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createPetLogCommentOfComment
// ====================================================

export interface createPetLogCommentOfComment_createPetLogCommentOfComment {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
  id: number | null;
}

export interface createPetLogCommentOfComment {
  createPetLogCommentOfComment: createPetLogCommentOfComment_createPetLogCommentOfComment;
}

export interface createPetLogCommentOfCommentVariables {
  payload: string;
  petLogCommentId: number;
}

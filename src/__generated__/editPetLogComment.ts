/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editPetLogComment
// ====================================================

export interface editPetLogComment_editPetLogComment {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface editPetLogComment {
  editPetLogComment: editPetLogComment_editPetLogComment;
}

export interface editPetLogCommentVariables {
  id: number;
  payload: string;
}

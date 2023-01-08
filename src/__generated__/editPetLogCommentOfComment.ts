/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editPetLogCommentOfComment
// ====================================================

export interface editPetLogCommentOfComment_editPetLogCommentOfComment {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface editPetLogCommentOfComment {
  editPetLogCommentOfComment: editPetLogCommentOfComment_editPetLogCommentOfComment;
}

export interface editPetLogCommentOfCommentVariables {
  id: number;
  payload: string;
}

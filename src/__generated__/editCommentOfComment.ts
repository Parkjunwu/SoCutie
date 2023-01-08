/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editCommentOfComment
// ====================================================

export interface editCommentOfComment_editCommentOfComment {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface editCommentOfComment {
  editCommentOfComment: editCommentOfComment_editCommentOfComment;
}

export interface editCommentOfCommentVariables {
  id: number;
  payload: string;
}

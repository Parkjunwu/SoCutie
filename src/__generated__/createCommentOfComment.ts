/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createCommentOfComment
// ====================================================

export interface createCommentOfComment_createCommentOfComment {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
  id: number | null;
}

export interface createCommentOfComment {
  createCommentOfComment: createCommentOfComment_createCommentOfComment;
}

export interface createCommentOfCommentVariables {
  payload: string;
  commentId: number;
}

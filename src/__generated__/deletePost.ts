/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deletePost
// ====================================================

export interface deletePost_deletePost {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface deletePost {
  deletePost: deletePost_deletePost;
}

export interface deletePostVariables {
  id: number;
}

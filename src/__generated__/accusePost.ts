/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: accusePost
// ====================================================

export interface accusePost_accusePost {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface accusePost {
  accusePost: accusePost_accusePost;
}

export interface accusePostVariables {
  id: number;
  reason: number;
  detail?: string | null;
}

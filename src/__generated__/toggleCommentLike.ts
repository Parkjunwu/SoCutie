/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: toggleCommentLike
// ====================================================

export interface toggleCommentLike_toggleCommentLike {
  __typename: "ToggleLikeResult";
  ok: boolean;
  error: string | null;
}

export interface toggleCommentLike {
  toggleCommentLike: toggleCommentLike_toggleCommentLike | null;
}

export interface toggleCommentLikeVariables {
  id: number;
}

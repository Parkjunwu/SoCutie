/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: togglePostLike
// ====================================================

export interface togglePostLike_togglePostLike {
  __typename: "TogglePostLikeResult";
  ok: boolean;
  error: string | null;
}

export interface togglePostLike {
  togglePostLike: togglePostLike_togglePostLike | null;
}

export interface togglePostLikeVariables {
  id: number;
}

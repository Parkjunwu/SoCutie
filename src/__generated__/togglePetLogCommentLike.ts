/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: togglePetLogCommentLike
// ====================================================

export interface togglePetLogCommentLike_togglePetLogCommentLike {
  __typename: "ToggleLikeResult";
  ok: boolean;
  error: string | null;
}

export interface togglePetLogCommentLike {
  togglePetLogCommentLike: togglePetLogCommentLike_togglePetLogCommentLike | null;
}

export interface togglePetLogCommentLikeVariables {
  id: number;
}

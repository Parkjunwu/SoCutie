/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: togglePetLogLike
// ====================================================

export interface togglePetLogLike_togglePetLogLike {
  __typename: "TogglePetLogLikeResult";
  ok: boolean;
  error: string | null;
}

export interface togglePetLogLike {
  togglePetLogLike: togglePetLogLike_togglePetLogLike | null;
}

export interface togglePetLogLikeVariables {
  id: number;
}

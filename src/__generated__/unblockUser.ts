/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: unblockUser
// ====================================================

export interface unblockUser_unblockUser {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface unblockUser {
  unblockUser: unblockUser_unblockUser;
}

export interface unblockUserVariables {
  id: number;
}

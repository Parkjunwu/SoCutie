/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: blockUser
// ====================================================

export interface blockUser_blockUser {
  __typename: "BlockUserResponse";
  ok: boolean;
  error: string | null;
  beforeUnreadTotal: number | null;
}

export interface blockUser {
  blockUser: blockUser_blockUser;
}

export interface blockUserVariables {
  id: number;
}

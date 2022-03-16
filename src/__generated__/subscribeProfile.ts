/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: subscribeProfile
// ====================================================

export interface subscribeProfile_subscribeProfile {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface subscribeProfile {
  subscribeProfile: subscribeProfile_subscribeProfile | null;
}

export interface subscribeProfileVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editProfile
// ====================================================

export interface editProfile_editProfile {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface editProfile {
  editProfile: editProfile_editProfile;
}

export interface editProfileVariables {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  email?: string | null;
  password?: string | null;
  bio?: string | null;
  avatar?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: autoLogin
// ====================================================

export interface autoLogin_autoLogin_loggedInUser {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
  bio: string | null;
  totalFollowing: number;
  totalFollowers: number;
}

export interface autoLogin_autoLogin {
  __typename: "LoginResult";
  ok: boolean;
  error: string | null;
  loggedInUser: autoLogin_autoLogin_loggedInUser | null;
  accessToken: string | null;
}

export interface autoLogin {
  autoLogin: autoLogin_autoLogin;
}

export interface autoLoginVariables {
  token: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginErrorCode } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login {
  __typename: "LoginResult";
  ok: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  errorCode: LoginErrorCode | null;
}

export interface login {
  login: login_login;
}

export interface loginVariables {
  email: string;
  password: string;
}

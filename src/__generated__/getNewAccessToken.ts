/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: getNewAccessToken
// ====================================================

export interface getNewAccessToken_getNewAccessToken {
  __typename: "GetNewAccessTokenResult";
  ok: boolean;
  error: string | null;
  accessToken: string | null;
}

export interface getNewAccessToken {
  getNewAccessToken: getNewAccessToken_getNewAccessToken;
}

export interface getNewAccessTokenVariables {
  refreshToken: string;
}

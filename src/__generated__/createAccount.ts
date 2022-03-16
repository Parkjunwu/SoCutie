/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ErrorCode } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createAccount
// ====================================================

export interface createAccount_createAccount {
  __typename: "createAccountResponse";
  ok: boolean;
  errorCode: ErrorCode | null;
}

export interface createAccount {
  createAccount: createAccount_createAccount;
}

export interface createAccountVariables {
  firstName: string;
  lastName?: string | null;
  userName: string;
  email: string;
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deletePetLog
// ====================================================

export interface deletePetLog_deletePetLog {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface deletePetLog {
  deletePetLog: deletePetLog_deletePetLog;
}

export interface deletePetLogVariables {
  id: number;
}

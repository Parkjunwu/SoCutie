/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: accusePetLog
// ====================================================

export interface accusePetLog_accusePetLog {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface accusePetLog {
  accusePetLog: accusePetLog_accusePetLog;
}

export interface accusePetLogVariables {
  id: number;
  reason: number;
  detail?: string | null;
}

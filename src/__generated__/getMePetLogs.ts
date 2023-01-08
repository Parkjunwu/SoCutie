/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMePetLogs
// ====================================================

export interface getMePetLogs_getMePetLogs_petLogs {
  __typename: "PetLog";
  id: number;
  title: string;
  thumbNail: string | null;
  createdAt: string;
  likes: number;
  commentNumber: number;
}

export interface getMePetLogs_getMePetLogs {
  __typename: "GetMePetLogsResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  petLogs: (getMePetLogs_getMePetLogs_petLogs | null)[] | null;
  error: string | null;
}

export interface getMePetLogs {
  getMePetLogs: getMePetLogs_getMePetLogs;
}

export interface getMePetLogsVariables {
  cursorId?: number | null;
}

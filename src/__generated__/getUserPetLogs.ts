/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserPetLogs
// ====================================================

export interface getUserPetLogs_getUserPetLogs_petLogs {
  __typename: "PetLog";
  id: number;
  title: string;
  thumbNail: string | null;
  createdAt: string;
  likes: number;
  commentNumber: number;
}

export interface getUserPetLogs_getUserPetLogs {
  __typename: "GetUserPetLogsResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  petLogs: (getUserPetLogs_getUserPetLogs_petLogs | null)[] | null;
  error: string | null;
}

export interface getUserPetLogs {
  getUserPetLogs: getUserPetLogs_getUserPetLogs;
}

export interface getUserPetLogsVariables {
  userId: number;
  cursorId?: number | null;
}

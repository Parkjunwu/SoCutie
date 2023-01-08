/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchPetLogs
// ====================================================

export interface searchPetLogs_searchPetLogs_petLogs_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface searchPetLogs_searchPetLogs_petLogs {
  __typename: "PetLog";
  id: number;
  user: searchPetLogs_searchPetLogs_petLogs_user;
  title: string;
  createdAt: string;
  thumbNail: string | null;
  likes: number;
  commentNumber: number;
}

export interface searchPetLogs_searchPetLogs {
  __typename: "SearchPetLogsResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  petLogs: (searchPetLogs_searchPetLogs_petLogs | null)[] | null;
  error: string | null;
}

export interface searchPetLogs {
  searchPetLogs: searchPetLogs_searchPetLogs;
}

export interface searchPetLogsVariables {
  keyword: string;
  cursorId?: number | null;
}

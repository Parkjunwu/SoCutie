/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeNewPetLogList
// ====================================================

export interface seeNewPetLogList_seeNewPetLogList_petLogs_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeNewPetLogList_seeNewPetLogList_petLogs {
  __typename: "PetLog";
  id: number;
  user: seeNewPetLogList_seeNewPetLogList_petLogs_user;
  title: string;
  thumbNail: string | null;
  createdAt: string;
  likes: number;
  commentNumber: number;
}

export interface seeNewPetLogList_seeNewPetLogList {
  __typename: "SeeNewPetLogListResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  petLogs: (seeNewPetLogList_seeNewPetLogList_petLogs | null)[] | null;
  error: string | null;
}

export interface seeNewPetLogList {
  seeNewPetLogList: seeNewPetLogList_seeNewPetLogList;
}

export interface seeNewPetLogListVariables {
  cursorId?: number | null;
}

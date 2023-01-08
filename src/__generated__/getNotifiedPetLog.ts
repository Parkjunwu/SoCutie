/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNotifiedPetLog
// ====================================================

export interface getNotifiedPetLog_getNotifiedPetLog_petLog_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface getNotifiedPetLog_getNotifiedPetLog_petLog {
  __typename: "PetLog";
  id: number;
  user: getNotifiedPetLog_getNotifiedPetLog_petLog_user;
  title: string;
  body: (string | null)[];
  file: (string | null)[];
  createdAt: string;
  isMine: boolean;
  likes: number;
  commentNumber: number;
  isLiked: boolean;
}

export interface getNotifiedPetLog_getNotifiedPetLog {
  __typename: "GetNotifiedPetLogResponse";
  petLog: getNotifiedPetLog_getNotifiedPetLog_petLog | null;
  error: string | null;
}

export interface getNotifiedPetLog {
  getNotifiedPetLog: getNotifiedPetLog_getNotifiedPetLog;
}

export interface getNotifiedPetLogVariables {
  petLogId: number;
}

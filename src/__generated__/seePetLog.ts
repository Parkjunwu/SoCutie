/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePetLog
// ====================================================

export interface seePetLog_seePetLog {
  __typename: "PetLog";
  id: number;
  body: (string | null)[];
  file: (string | null)[];
  isMine: boolean;
  likes: number;
  commentNumber: number;
  isLiked: boolean;
}

export interface seePetLog {
  seePetLog: seePetLog_seePetLog | null;
}

export interface seePetLogVariables {
  id: number;
}

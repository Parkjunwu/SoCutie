/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: uploadPetLog
// ====================================================

export interface uploadPetLog_uploadPetLog_uploadedPetLog {
  __typename: "PetLog";
  id: number;
  createdAt: string;
}

export interface uploadPetLog_uploadPetLog {
  __typename: "UploadPetLogResponse";
  ok: boolean;
  error: string | null;
  uploadedPetLog: uploadPetLog_uploadPetLog_uploadedPetLog | null;
}

export interface uploadPetLog {
  uploadPetLog: uploadPetLog_uploadPetLog;
}

export interface uploadPetLogVariables {
  title: string;
  fileArr: (any | null)[];
  body: (string | null)[];
  thumbNail?: any | null;
}

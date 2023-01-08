/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editPetLog
// ====================================================

export interface editPetLog_editPetLog {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface editPetLog {
  editPetLog: editPetLog_editPetLog;
}

export interface editPetLogVariables {
  id: number;
  title?: string | null;
  body?: (string | null)[] | null;
  thumbNail?: any | null;
  addFileArr?: (any | null)[] | null;
  addFileIndexArr?: (number | null)[] | null;
  deleteFileArr?: (string | null)[] | null;
  wholeFileArr?: (string | null)[] | null;
  deletePrevThumbNail?: boolean | null;
}

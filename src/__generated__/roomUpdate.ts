/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: roomUpdate
// ====================================================

export interface roomUpdate_roomUpdate {
  __typename: "Message";
  id: number;
  payload: string;
  userId: number;
  read: boolean;
}

export interface roomUpdate {
  roomUpdate: roomUpdate_roomUpdate | null;
}

export interface roomUpdateVariables {
  id: number;
}

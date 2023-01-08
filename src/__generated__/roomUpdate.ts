/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: roomUpdate
// ====================================================

export interface roomUpdate_roomUpdate_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface roomUpdate_roomUpdate {
  __typename: "Message";
  id: number;
  payload: string;
  user: roomUpdate_roomUpdate_user | null;
  read: boolean;
  createdAt: string;
}

export interface roomUpdate {
  roomUpdate: roomUpdate_roomUpdate | null;
}

export interface roomUpdateVariables {
  id: number;
}

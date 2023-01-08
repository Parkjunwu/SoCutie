/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: NewMessage
// ====================================================

export interface NewMessage_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface NewMessage {
  __typename: "Message";
  createdAt: string;
  id: number;
  payload: string;
  read: boolean;
  user: NewMessage_user | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: NewMessage
// ====================================================

export interface NewMessage_user {
  __typename: "User";
  userName: string;
  avatar: string | null;
}

export interface NewMessage {
  __typename: "Message";
  id: number;
  payload: string;
  user: NewMessage_user;
  read: boolean;
}

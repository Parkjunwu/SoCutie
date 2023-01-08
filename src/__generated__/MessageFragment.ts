/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MessageFragment
// ====================================================

export interface MessageFragment_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface MessageFragment {
  __typename: "Message";
  id: number;
  payload: string;
  user: MessageFragment_user | null;
  read: boolean;
  createdAt: string;
}

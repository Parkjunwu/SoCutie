/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRoomMessages
// ====================================================

export interface getRoomMessages_getRoomMessages_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface getRoomMessages_getRoomMessages {
  __typename: "Message";
  id: number;
  payload: string;
  user: getRoomMessages_getRoomMessages_user;
  read: boolean;
  createdAt: string;
}

export interface getRoomMessages {
  getRoomMessages: (getRoomMessages_getRoomMessages | null)[] | null;
}

export interface getRoomMessagesVariables {
  roomId: number;
  cursorId?: number | null;
}

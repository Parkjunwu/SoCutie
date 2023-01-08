/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRoomMessages
// ====================================================

export interface getRoomMessages_getRoomMessages_messages_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface getRoomMessages_getRoomMessages_messages {
  __typename: "Message";
  id: number;
  payload: string;
  user: getRoomMessages_getRoomMessages_messages_user | null;
  read: boolean;
  createdAt: string;
}

export interface getRoomMessages_getRoomMessages {
  __typename: "GetRoomMessagesResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  messages: (getRoomMessages_getRoomMessages_messages | null)[] | null;
  error: string | null;
  isNotFetchMore: boolean | null;
}

export interface getRoomMessages {
  getRoomMessages: getRoomMessages_getRoomMessages;
}

export interface getRoomMessagesVariables {
  roomId: number;
  cursorId?: number | null;
}

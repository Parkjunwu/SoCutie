/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RoomParts
// ====================================================

export interface RoomParts_talkingTo {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface RoomParts_lastMessage {
  __typename: "Message";
  id: number;
  payload: string;
  createdAt: string;
}

export interface RoomParts {
  __typename: "Room";
  id: number;
  talkingTo: RoomParts_talkingTo | null;
  lastMessage: RoomParts_lastMessage | null;
  unreadTotal: number | null;
}

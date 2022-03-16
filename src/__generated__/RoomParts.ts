/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RoomParts
// ====================================================

export interface RoomParts_users {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface RoomParts {
  __typename: "Room";
  id: number;
  users: (RoomParts_users | null)[] | null;
  unreadTotal: number | null;
}

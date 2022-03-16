/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeRooms
// ====================================================

export interface seeRooms_seeRooms_users {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeRooms_seeRooms {
  __typename: "Room";
  id: number;
  users: (seeRooms_seeRooms_users | null)[] | null;
  unreadTotal: number | null;
}

export interface seeRooms {
  seeRooms: (seeRooms_seeRooms | null)[] | null;
}

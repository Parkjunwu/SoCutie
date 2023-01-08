/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeRooms
// ====================================================

export interface seeRooms_seeRooms_rooms_talkingTo {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeRooms_seeRooms_rooms_lastMessage {
  __typename: "Message";
  id: number;
  payload: string;
  createdAt: string;
}

export interface seeRooms_seeRooms_rooms {
  __typename: "Room";
  id: number;
  talkingTo: seeRooms_seeRooms_rooms_talkingTo | null;
  lastMessage: seeRooms_seeRooms_rooms_lastMessage | null;
  unreadTotal: number | null;
}

export interface seeRooms_seeRooms {
  __typename: "SeeRoomResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  rooms: (seeRooms_seeRooms_rooms | null)[] | null;
  error: string | null;
  isNotFetchMore: boolean | null;
}

export interface seeRooms {
  seeRooms: seeRooms_seeRooms | null;
}

export interface seeRoomsVariables {
  cursorId?: number | null;
}

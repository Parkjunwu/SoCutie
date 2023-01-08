/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { isAlreadyRoomState } from "./globalTypes";

// ====================================================
// GraphQL query operation: isAlreadyRoom
// ====================================================

export interface isAlreadyRoom_isAlreadyRoom_room_talkingTo {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface isAlreadyRoom_isAlreadyRoom_room {
  __typename: "Room";
  id: number;
  talkingTo: isAlreadyRoom_isAlreadyRoom_room_talkingTo | null;
  unreadTotal: number | null;
}

export interface isAlreadyRoom_isAlreadyRoom {
  __typename: "isAlreadyRoomResponse";
  state: isAlreadyRoomState;
  room: isAlreadyRoom_isAlreadyRoom_room | null;
}

export interface isAlreadyRoom {
  isAlreadyRoom: isAlreadyRoom_isAlreadyRoom;
}

export interface isAlreadyRoomVariables {
  userId: number;
}

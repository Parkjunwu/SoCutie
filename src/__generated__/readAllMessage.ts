/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: readAllMessage
// ====================================================

export interface readAllMessage_readAllMessage {
  __typename: "readAllMessageResponse";
  ok: boolean;
  numberOfRead: number | null;
  error: string | null;
}

export interface readAllMessage {
  readAllMessage: readAllMessage_readAllMessage;
}

export interface readAllMessageVariables {
  roomId: number;
}

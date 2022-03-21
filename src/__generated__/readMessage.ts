/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: readMessage
// ====================================================

export interface readMessage_readMessage {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface readMessage {
  readMessage: readMessage_readMessage;
}

export interface readMessageVariables {
  id: number;
}

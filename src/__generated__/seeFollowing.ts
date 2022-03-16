/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeFollowing
// ====================================================

export interface seeFollowing_seeFollowing_following {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeFollowing_seeFollowing {
  __typename: "SeeFollowingResult";
  ok: boolean;
  error: string | null;
  following: (seeFollowing_seeFollowing_following | null)[] | null;
  lastId: number | null;
}

export interface seeFollowing {
  seeFollowing: seeFollowing_seeFollowing;
}

export interface seeFollowingVariables {
  id: number;
  lastId?: number | null;
}

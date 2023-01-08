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
  isFollowing: boolean;
  isMe: boolean;
}

export interface seeFollowing_seeFollowing {
  __typename: "SeeFollowingResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  following: (seeFollowing_seeFollowing_following | null)[] | null;
  error: string | null;
  isNotFetchMore: boolean | null;
}

export interface seeFollowing {
  seeFollowing: seeFollowing_seeFollowing;
}

export interface seeFollowingVariables {
  id: number;
  cursorId?: number | null;
}

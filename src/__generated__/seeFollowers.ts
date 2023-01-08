/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeFollowers
// ====================================================

export interface seeFollowers_seeFollowers_followers {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
  isFollowing: boolean;
  isMe: boolean;
}

export interface seeFollowers_seeFollowers {
  __typename: "SeeFollowersResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  followers: (seeFollowers_seeFollowers_followers | null)[] | null;
  error: string | null;
  isNotFetchMore: boolean | null;
}

export interface seeFollowers {
  seeFollowers: seeFollowers_seeFollowers;
}

export interface seeFollowersVariables {
  id: number;
  cursorId?: number | null;
}

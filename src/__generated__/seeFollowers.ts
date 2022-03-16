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
}

export interface seeFollowers_seeFollowers {
  __typename: "SeeFollowersResult";
  ok: boolean;
  error: string | null;
  followers: (seeFollowers_seeFollowers_followers | null)[] | null;
  lastId: number | null;
}

export interface seeFollowers {
  seeFollowers: seeFollowers_seeFollowers;
}

export interface seeFollowersVariables {
  id: number;
  lastId?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePostLikes
// ====================================================

export interface seePostLikes_seePostLikes {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
  isFollowing: boolean;
  isMe: boolean;
}

export interface seePostLikes {
  seePostLikes: (seePostLikes_seePostLikes | null)[] | null;
}

export interface seePostLikesVariables {
  id: number;
  cursorId?: number | null;
}

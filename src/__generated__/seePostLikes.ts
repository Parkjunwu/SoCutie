/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePostLikes
// ====================================================

export interface seePostLikes_seePostLikes_likeUsers {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
  isFollowing: boolean;
  isMe: boolean;
}

export interface seePostLikes_seePostLikes {
  __typename: "SeeLikesResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  likeUsers: (seePostLikes_seePostLikes_likeUsers | null)[] | null;
  error: string | null;
  isNotFetchMore: boolean;
}

export interface seePostLikes {
  seePostLikes: seePostLikes_seePostLikes;
}

export interface seePostLikesVariables {
  id: number;
  cursorId?: number | null;
}

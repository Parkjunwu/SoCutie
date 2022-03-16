/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeFeed
// ====================================================

export interface seeFeed_seeFeed_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeFeed_seeFeed_comments_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeFeed_seeFeed_comments {
  __typename: "Comment";
  id: number;
  user: seeFeed_seeFeed_comments_user;
  payload: string;
  isMine: boolean;
  createdAt: string;
}

export interface seeFeed_seeFeed {
  __typename: "Post";
  id: number;
  user: seeFeed_seeFeed_user;
  file: (string | null)[] | null;
  caption: string | null;
  createdAt: string;
  likes: number;
  comments: (seeFeed_seeFeed_comments | null)[] | null;
  commentNumber: number;
  isMine: boolean;
  isLiked: boolean;
}

export interface seeFeed {
  seeFeed: (seeFeed_seeFeed | null)[] | null;
}

export interface seeFeedVariables {
  offset: number;
}

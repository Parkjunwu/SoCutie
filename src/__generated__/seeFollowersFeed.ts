/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeFollowersFeed
// ====================================================

export interface seeFollowersFeed_seeFollowersFeed_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeFollowersFeed_seeFollowersFeed_bestComment_user {
  __typename: "User";
  userName: string;
}

export interface seeFollowersFeed_seeFollowersFeed_bestComment {
  __typename: "Comment";
  id: number;
  payload: string;
  user: seeFollowersFeed_seeFollowersFeed_bestComment_user;
}

export interface seeFollowersFeed_seeFollowersFeed {
  __typename: "Post";
  id: number;
  user: seeFollowersFeed_seeFollowersFeed_user;
  file: (string | null)[] | null;
  caption: string | null;
  createdAt: string;
  likes: number;
  commentNumber: number;
  isMine: boolean;
  isLiked: boolean;
  bestComment: seeFollowersFeed_seeFollowersFeed_bestComment | null;
}

export interface seeFollowersFeed {
  seeFollowersFeed: (seeFollowersFeed_seeFollowersFeed | null)[] | null;
}

export interface seeFollowersFeedVariables {
  offset: number;
}

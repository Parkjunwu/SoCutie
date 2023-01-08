/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeNewPostFeed
// ====================================================

export interface seeNewPostFeed_seeNewPostFeed_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeNewPostFeed_seeNewPostFeed_bestComment_user {
  __typename: "User";
  userName: string;
}

export interface seeNewPostFeed_seeNewPostFeed_bestComment {
  __typename: "Comment";
  id: number;
  payload: string;
  user: seeNewPostFeed_seeNewPostFeed_bestComment_user;
}

export interface seeNewPostFeed_seeNewPostFeed {
  __typename: "Post";
  id: number;
  user: seeNewPostFeed_seeNewPostFeed_user;
  file: (string | null)[] | null;
  caption: string | null;
  createdAt: string;
  likes: number;
  commentNumber: number;
  isMine: boolean;
  isLiked: boolean;
  bestComment: seeNewPostFeed_seeNewPostFeed_bestComment | null;
}

export interface seeNewPostFeed {
  seeNewPostFeed: (seeNewPostFeed_seeNewPostFeed | null)[] | null;
}

export interface seeNewPostFeedVariables {
  offset: number;
}

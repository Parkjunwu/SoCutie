/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePost
// ====================================================

export interface seePost_seePost_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seePost_seePost_bestComment_user {
  __typename: "User";
  userName: string;
}

export interface seePost_seePost_bestComment {
  __typename: "Comment";
  id: number;
  payload: string;
  user: seePost_seePost_bestComment_user;
}

export interface seePost_seePost {
  __typename: "Post";
  id: number;
  user: seePost_seePost_user;
  file: (string | null)[] | null;
  caption: string | null;
  createdAt: string;
  likes: number;
  commentNumber: number;
  isMine: boolean;
  isLiked: boolean;
  bestComment: seePost_seePost_bestComment | null;
}

export interface seePost {
  seePost: seePost_seePost | null;
}

export interface seePostVariables {
  id: number;
}

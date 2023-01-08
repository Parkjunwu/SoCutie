/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeHashTag
// ====================================================

export interface seeHashTag_seeHashTag_posts_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeHashTag_seeHashTag_posts {
  __typename: "Post";
  id: number;
  user: seeHashTag_seeHashTag_posts_user;
  file: (string | null)[] | null;
  caption: string | null;
  createdAt: string;
  likes: number;
  commentNumber: number;
  isMine: boolean;
  isLiked: boolean;
}

export interface seeHashTag_seeHashTag {
  __typename: "SeeHashTagResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  posts: (seeHashTag_seeHashTag_posts | null)[] | null;
  error: string | null;
}

export interface seeHashTag {
  seeHashTag: seeHashTag_seeHashTag | null;
}

export interface seeHashTagVariables {
  name: string;
  cursorId?: number | null;
}

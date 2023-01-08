/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MyPost
// ====================================================

export interface MyPost_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface MyPost {
  __typename: "Post";
  id: number;
  createdAt: string;
  user: MyPost_user;
  likes: number;
  caption: string | null;
  file: (string | null)[] | null;
  commentNumber: number;
  isLiked: boolean;
  isMine: boolean;
  firstPhoto: string | null;
  isFirstVideo: boolean | null;
}

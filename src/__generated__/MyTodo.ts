/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MyTodo
// ====================================================

export interface MyTodo_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface MyTodo {
  __typename: "Comment";
  id: number;
  user: MyTodo_user;
  payload: string;
  createdAt: string;
  isMine: boolean;
  totalLikes: number;
  totalCommentOfComments: number;
  isLiked: boolean | null;
}

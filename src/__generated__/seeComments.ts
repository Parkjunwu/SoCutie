/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeComments
// ====================================================

export interface seeComments_seeComments_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeComments_seeComments {
  __typename: "Comment";
  id: number;
  user: seeComments_seeComments_user;
  payload: string;
  createdAt: string;
  isMine: boolean;
  totalLikes: number;
  totalCommentOfComments: number;
  isLiked: boolean | null;
}

export interface seeComments {
  seeComments: (seeComments_seeComments | null)[] | null;
}

export interface seeCommentsVariables {
  postId: number;
  cursorId?: number | null;
}

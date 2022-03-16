/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeCommentOfComments
// ====================================================

export interface seeCommentOfComments_seeCommentOfComments_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeCommentOfComments_seeCommentOfComments {
  __typename: "CommentOfComment";
  id: number;
  user: seeCommentOfComments_seeCommentOfComments_user;
  payload: string;
  createdAt: string;
  isMine: boolean;
  totalLikes: number;
  isLiked: boolean | null;
}

export interface seeCommentOfComments {
  seeCommentOfComments: (seeCommentOfComments_seeCommentOfComments | null)[] | null;
}

export interface seeCommentOfCommentsVariables {
  commentId: number;
  cursorId?: number | null;
}

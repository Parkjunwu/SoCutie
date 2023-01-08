/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNotifiedComment
// ====================================================

export interface getNotifiedComment_getNotifiedComment_comment_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface getNotifiedComment_getNotifiedComment_comment {
  __typename: "Comment";
  id: number;
  user: getNotifiedComment_getNotifiedComment_comment_user;
  isMine: boolean;
  payload: string;
  createdAt: string;
  totalLikes: number;
  totalCommentOfComments: number;
  isLiked: boolean | null;
}

export interface getNotifiedComment_getNotifiedComment {
  __typename: "GetNotifiedCommentResponse";
  comment: getNotifiedComment_getNotifiedComment_comment | null;
  error: string | null;
}

export interface getNotifiedComment {
  getNotifiedComment: getNotifiedComment_getNotifiedComment;
}

export interface getNotifiedCommentVariables {
  commentId: number;
}

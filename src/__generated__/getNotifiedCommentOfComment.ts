/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNotifiedCommentOfComment
// ====================================================

export interface getNotifiedCommentOfComment_getNotifiedCommentOfComment_commentOfComment_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface getNotifiedCommentOfComment_getNotifiedCommentOfComment_commentOfComment {
  __typename: "CommentOfComment";
  id: number;
  user: getNotifiedCommentOfComment_getNotifiedCommentOfComment_commentOfComment_user;
  isMine: boolean;
  payload: string;
  createdAt: string;
  totalLikes: number;
  isLiked: boolean | null;
}

export interface getNotifiedCommentOfComment_getNotifiedCommentOfComment {
  __typename: "GetNotifiedCommentOfCommentResponse";
  commentOfComment: getNotifiedCommentOfComment_getNotifiedCommentOfComment_commentOfComment | null;
  error: string | null;
}

export interface getNotifiedCommentOfComment {
  getNotifiedCommentOfComment: getNotifiedCommentOfComment_getNotifiedCommentOfComment;
}

export interface getNotifiedCommentOfCommentVariables {
  commentOfCommentId: number;
}

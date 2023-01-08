/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeCommentLikes
// ====================================================

export interface seeCommentLikes_seeCommentLikes_likeUsers {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
  isFollowing: boolean;
  isMe: boolean;
}

export interface seeCommentLikes_seeCommentLikes {
  __typename: "SeeLikesResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  likeUsers: (seeCommentLikes_seeCommentLikes_likeUsers | null)[] | null;
  error: string | null;
}

export interface seeCommentLikes {
  seeCommentLikes: seeCommentLikes_seeCommentLikes;
}

export interface seeCommentLikesVariables {
  commentId: number;
  cursorId?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeCommentOfCommentLikes
// ====================================================

export interface seeCommentOfCommentLikes_seeCommentOfCommentLikes_likeUsers {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
  isFollowing: boolean;
  isMe: boolean;
}

export interface seeCommentOfCommentLikes_seeCommentOfCommentLikes {
  __typename: "SeeLikesResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  likeUsers: (seeCommentOfCommentLikes_seeCommentOfCommentLikes_likeUsers | null)[] | null;
  error: string | null;
}

export interface seeCommentOfCommentLikes {
  seeCommentOfCommentLikes: seeCommentOfCommentLikes_seeCommentOfCommentLikes | null;
}

export interface seeCommentOfCommentLikesVariables {
  commentOfCommentId: number;
  cursorId?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeCommentOfCommentLikes
// ====================================================

export interface seeCommentOfCommentLikes_seeCommentOfCommentLikes {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
  isFollowing: boolean;
  isMe: boolean;
}

export interface seeCommentOfCommentLikes {
  seeCommentOfCommentLikes: (seeCommentOfCommentLikes_seeCommentOfCommentLikes | null)[] | null;
}

export interface seeCommentOfCommentLikesVariables {
  commentOfCommentId: number;
  cursorId?: number | null;
}

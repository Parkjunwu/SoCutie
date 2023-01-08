/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeComments
// ====================================================

export interface seeComments_seeComments_comments_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeComments_seeComments_comments {
  __typename: "Comment";
  id: number;
  user: seeComments_seeComments_comments_user;
  payload: string;
  createdAt: string;
  isMine: boolean;
  totalLikes: number;
  totalCommentOfComments: number;
  isLiked: boolean | null;
}

export interface seeComments_seeComments {
  __typename: "SeeCommentsResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  comments: (seeComments_seeComments_comments | null)[] | null;
  error: string | null;
  isNotFetchMore: boolean;
}

export interface seeComments {
  seeComments: seeComments_seeComments;
}

export interface seeCommentsVariables {
  postId: number;
  cursorId?: number | null;
  isNotification?: boolean | null;
}

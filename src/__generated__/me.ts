/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me_posts_post {
  __typename: "Post";
  id: number;
  file: (string | null)[] | null;
}

export interface me_me_posts {
  __typename: "PostAndCursor";
  post: (me_me_posts_post | null)[] | null;
  cursorId: number | null;
}

export interface me_me {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
  bio: string | null;
  totalFollowing: number;
  totalFollowers: number;
  posts: me_me_posts | null;
}

export interface me {
  me: me_me | null;
}

export interface meVariables {
  cursorId?: number | null;
}

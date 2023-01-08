/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserPosts
// ====================================================

export interface getUserPosts_getUserPosts_posts {
  __typename: "Post";
  id: number;
  isFirstVideo: boolean | null;
  firstPhoto: string | null;
}

export interface getUserPosts_getUserPosts {
  __typename: "GetUserPostsResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  posts: (getUserPosts_getUserPosts_posts | null)[] | null;
  error: string | null;
}

export interface getUserPosts {
  getUserPosts: getUserPosts_getUserPosts;
}

export interface getUserPostsVariables {
  userId: number;
  cursorId?: number | null;
}

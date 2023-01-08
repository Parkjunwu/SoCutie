/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMePosts
// ====================================================

export interface getMePosts_getMePosts_posts {
  __typename: "Post";
  id: number;
  isFirstVideo: boolean | null;
  firstPhoto: string | null;
}

export interface getMePosts_getMePosts {
  __typename: "GetMePostsResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  posts: (getMePosts_getMePosts_posts | null)[] | null;
  error: string | null;
}

export interface getMePosts {
  getMePosts: getMePosts_getMePosts;
}

export interface getMePostsVariables {
  cursorId?: number | null;
}

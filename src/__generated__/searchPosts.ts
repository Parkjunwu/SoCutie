/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchPosts
// ====================================================

export interface searchPosts_searchPosts_posts {
  __typename: "Post";
  id: number;
  file: (string | null)[] | null;
}

export interface searchPosts_searchPosts {
  __typename: "SearchPostsResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  posts: (searchPosts_searchPosts_posts | null)[] | null;
  error: string | null;
}

export interface searchPosts {
  searchPosts: searchPosts_searchPosts;
}

export interface searchPostsVariables {
  keyword: string;
  cursorId?: number | null;
}

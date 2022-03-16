/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchPosts
// ====================================================

export interface searchPosts_searchPosts {
  __typename: "Post";
  id: number;
  file: (string | null)[] | null;
}

export interface searchPosts {
  searchPosts: (searchPosts_searchPosts | null)[] | null;
}

export interface searchPostsVariables {
  keyword: string;
}

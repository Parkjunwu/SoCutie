/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchUsers
// ====================================================

export interface searchUsers_searchUsers_users {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface searchUsers_searchUsers {
  __typename: "SearchUsersResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  users: (searchUsers_searchUsers_users | null)[] | null;
  error: string | null;
}

export interface searchUsers {
  searchUsers: searchUsers_searchUsers;
}

export interface searchUsersVariables {
  keyword: string;
  cursorId?: number | null;
}

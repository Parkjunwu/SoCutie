/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchUsers
// ====================================================

export interface searchUsers_searchUsers_users {
  __typename: "User";
  userName: string;
  avatar: string | null;
}

export interface searchUsers_searchUsers {
  __typename: "Result";
  users: (searchUsers_searchUsers_users | null)[] | null;
}

export interface searchUsers {
  searchUsers: searchUsers_searchUsers | null;
}

export interface searchUsersVariables {
  keyword: string;
  lastId?: number | null;
}

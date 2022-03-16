/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeProfile
// ====================================================

export interface seeProfile_seeProfile_posts_post {
  __typename: "Post";
  id: number;
  file: (string | null)[] | null;
}

export interface seeProfile_seeProfile_posts {
  __typename: "PostAndCursor";
  post: (seeProfile_seeProfile_posts_post | null)[] | null;
  cursorId: number | null;
}

export interface seeProfile_seeProfile {
  __typename: "User";
  id: number;
  userName: string;
  bio: string | null;
  avatar: string | null;
  totalFollowing: number;
  totalFollowers: number;
  isFollowing: boolean;
  isMe: boolean;
  posts: seeProfile_seeProfile_posts | null;
}

export interface seeProfile {
  seeProfile: seeProfile_seeProfile | null;
}

export interface seeProfileVariables {
  id: number;
  cursorId?: number | null;
}

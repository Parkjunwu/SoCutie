/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MyPetLog
// ====================================================

export interface MyPetLog_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface MyPetLog {
  __typename: "PetLog";
  id: number;
  createdAt: string;
  user: MyPetLog_user;
  title: string;
  body: (string | null)[];
  file: (string | null)[];
  thumbNail: string | null;
  likes: number;
  commentNumber: number;
  isLiked: boolean;
  isMine: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePetLogComments
// ====================================================

export interface seePetLogComments_seePetLogComments_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seePetLogComments_seePetLogComments {
  __typename: "PetLogComment";
  id: number;
  user: seePetLogComments_seePetLogComments_user;
  payload: string;
  createdAt: string;
  isMine: boolean;
  totalLikes: number;
  totalCommentOfComments: number;
  isLiked: boolean | null;
}

export interface seePetLogComments {
  seePetLogComments: (seePetLogComments_seePetLogComments | null)[] | null;
}

export interface seePetLogCommentsVariables {
  petLogId: number;
  offset: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNotifiedPetLogComment
// ====================================================

export interface getNotifiedPetLogComment_getNotifiedPetLogComment {
  __typename: "GetNotifiedPetLogCommentResponse";
  offset: number | null;
  totalComments: number | null;
  error: string | null;
}

export interface getNotifiedPetLogComment {
  getNotifiedPetLogComment: getNotifiedPetLogComment_getNotifiedPetLogComment;
}

export interface getNotifiedPetLogCommentVariables {
  petLogCommentId: number;
  petLogId: number;
}

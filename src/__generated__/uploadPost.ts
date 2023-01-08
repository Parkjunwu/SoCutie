/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: uploadPost
// ====================================================

export interface uploadPost_uploadPost_uploadedPost {
  __typename: "Post";
  id: number;
  createdAt: string;
}

export interface uploadPost_uploadPost {
  __typename: "UploadPostResponse";
  ok: boolean;
  error: string | null;
  uploadedPost: uploadPost_uploadPost_uploadedPost | null;
}

export interface uploadPost {
  uploadPost: uploadPost_uploadPost;
}

export interface uploadPostVariables {
  photoArr: (any | null)[];
  caption?: string | null;
  isFirstVideo: boolean;
  firstVideoPhoto?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editPost
// ====================================================

export interface editPost_editPost {
  __typename: "MutationResponse";
  ok: boolean;
  error: string | null;
}

export interface editPost {
  editPost: editPost_editPost;
}

export interface editPostVariables {
  id: number;
  caption?: string | null;
  addPhotoArr?: (any | null)[] | null;
  addPhotoIndexArr?: (number | null)[] | null;
  deletePhotoArr?: (string | null)[] | null;
  wholePhotoArr?: (string | null)[] | null;
  isFirstVideo?: boolean | null;
  firstVideoPhoto?: any | null;
}

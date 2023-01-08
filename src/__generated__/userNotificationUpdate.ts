/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WhichNotification } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: userNotificationUpdate
// ====================================================

export interface userNotificationUpdate_userNotificationUpdate_publishUser {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface userNotificationUpdate_userNotificationUpdate {
  __typename: "Notification";
  id: number;
  publishUser: userNotificationUpdate_userNotificationUpdate_publishUser;
  which: WhichNotification;
  read: boolean;
  createdAt: string;
  postId: number | null;
  commentId: number | null;
  commentOfCommentId: number | null;
  userId: number | null;
  petLogId: number | null;
}

export interface userNotificationUpdate {
  userNotificationUpdate: userNotificationUpdate_userNotificationUpdate | null;
}

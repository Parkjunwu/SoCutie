/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WhichNotification } from "./globalTypes";

// ====================================================
// GraphQL query operation: seeUserNotificationList
// ====================================================

export interface seeUserNotificationList_seeUserNotificationList_notification_publishUser {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeUserNotificationList_seeUserNotificationList_notification {
  __typename: "Notification";
  id: number;
  publishUser: seeUserNotificationList_seeUserNotificationList_notification_publishUser;
  which: WhichNotification;
  read: boolean;
  createdAt: string;
  commentId: number | null;
  commentOfCommentId: number | null;
  userId: number | null;
  postId: number | null;
  petLogId: number | null;
}

export interface seeUserNotificationList_seeUserNotificationList {
  __typename: "SeeUserNotificationListResponse";
  cursorId: number | null;
  hasNextPage: boolean | null;
  notification: (seeUserNotificationList_seeUserNotificationList_notification | null)[] | null;
  error: string | null;
  isNotFetchMore: boolean | null;
}

export interface seeUserNotificationList {
  seeUserNotificationList: seeUserNotificationList_seeUserNotificationList | null;
}

export interface seeUserNotificationListVariables {
  cursorId?: number | null;
}

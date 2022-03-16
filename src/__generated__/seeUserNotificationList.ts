/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WhichNotification } from "./globalTypes";

// ====================================================
// GraphQL query operation: seeUserNotificationList
// ====================================================

export interface seeUserNotificationList_seeUserNotificationList_publishUser {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seeUserNotificationList_seeUserNotificationList {
  __typename: "Notification";
  id: number;
  publishUser: seeUserNotificationList_seeUserNotificationList_publishUser;
  which: WhichNotification;
  read: boolean;
  createdAt: string;
}

export interface seeUserNotificationList {
  seeUserNotificationList: (seeUserNotificationList_seeUserNotificationList | null)[] | null;
}

export interface seeUserNotificationListVariables {
  cursorId?: number | null;
}

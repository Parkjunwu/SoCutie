export type transformedMessages_transformedMessages_user = {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export type transformedMessages_transformedMessages = {
  __typename: "Message";
  id: number;
  payload: string;
  user: transformedMessages_transformedMessages_user;
  read: boolean;
  createdDay: string;
  roomId: number;
  transformedTime: string;
}

export type transformedMessages = transformedMessages_transformedMessages[];
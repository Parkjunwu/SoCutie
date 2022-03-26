import { seeRooms_seeRooms_talkingTo } from "../__generated__/seeRooms";

type baseProps = {
  Profile: { id: number, userName: string };
  Comments: { postId: number };
  EditProfile: undefined;
  PostLikes: { postId: number };
  CommentLikes: { commentId: number };
  CommentOfCommentLikes: { commentOfCommentId: number };
  Followers: { userId: number };
  Following: { userId: number };
  Photo: { photoId: number };
}

export type FeedStackProps = baseProps & {
  Feed: undefined;
  Messages: { unreadMessage: number };
  Notification: { unreadNotification: number };
};

export type MeStackProps = baseProps & {
  Me: undefined;
  Post: undefined;
};

export type SearchStackProps = baseProps & {
  Search: undefined;
  Photo: { photoId: number };
};

/////

export type MessageNavProps = {
  Rooms: undefined;
  Room: { id: number, talkingTo: seeRooms_seeRooms_talkingTo, unreadTotal:number };
}
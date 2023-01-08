
type baseProps = {
  Profile: { id: number, userName: string };
  Comments: { postId: number, commentId?: number, commentOfCommentId?: number };
  EditProfile: undefined;
  PostLikes: { postId: number };
  CommentLikes: { commentId: number };
  CommentOfCommentLikes: { commentOfCommentId: number };
  Followers: { userId: number };
  Following: { userId: number, isMessage?: boolean };
  Photo: { photoId: number };
  HashTag: { name: string };
  // 
  PetLog: {
    id: number;
    title: string;
    thumbNail: string;
    createdAt: string;
    user: {
      id: number
      userName: string
      avatar: string
    }
  }
  // Notification 에서만 쓸 수 있음
  NotificationPetLog: {
    petLogId: number;
    commentId?: number;
    commentOfCommentId?: number;
  }
}

export type FeedStackProps = baseProps & {
  Feed: undefined;
  Messages: { unreadMessage: number };
  Notification: { unreadNotification: number };
  TemporaryRoom: { userId: number };
};

export type MeStackProps = baseProps & {
  Me: undefined;
  Post: undefined;
  // PetLog: {
  //   id: number;
  //   title: string;
  //   thumbNail: string;
  //   createdAt: string;
  //   user: {
  //     id: number
  //     userName: string
  //     avatar: string
  //   }
  // }
};

export type SearchStackProps = baseProps & {
  Search: undefined;
  Photo: { photoId: number };
};

/////

export type MessageNavProps = {
  Rooms: undefined;
  // Room: { id: number, talkingTo: seeRooms_seeRooms_rooms_talkingTo, unreadTotal?:number };
  Room: { id: number, opponentUserName:string, unreadTotal?:number };
  
  TemporaryRoom: { userId: number, userName: string };
}
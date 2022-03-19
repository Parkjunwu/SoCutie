type baseProps = {
  Profile: {id:number,userName:string};
  Comments: {postId:number};
  EditProfile: undefined;
  PostLikes: {postId:number};
  CommentLikes: {commentId:number};
  CommentOfCommentLikes: {commentOfCommentId:number};
  Followers: {userId:number};
  Following: {userId:number};
  Photo: {photoId:number};
}

export type FeedStackProps = baseProps & {
  Feed: undefined;
  Messages: undefined;
};

export type MeStackProps = baseProps & {
  Me: undefined;
  // Photo: undefined;
  Post: undefined;
};

export type SearchStackProps = baseProps & {
  Search: undefined;
  Photo: {photoId: number};
};
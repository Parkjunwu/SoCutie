type UpdateSeeCommentsQueryType = {
  action: string;
  commentId: number;
  editPayload?: string;
  // newCacheData?: seeComments_seeComments_comments;
  // prevCommentNumber?: number
  forCreateComment?: {
    offsetComments: (createComment_createComment_offsetComments | null)[] | null,
    setNowCommentsBundleNumber: React.Dispatch<React.SetStateAction<number>>,
    totalCommentsNumber: number,
  }
}

type UpdateSeeCommentOfCommentsQueryType = {
  action: string;
  commentOfCommentId: number;
  editPayload?: string;
  newCacheData?: seeCommentOfComments_seeCommentOfComments_commentOfComments;
  // prevCommentNumber?: number;
  // numberNow?: number;
}

export { UpdateSeeCommentsQueryType, UpdateSeeCommentOfCommentsQueryType };
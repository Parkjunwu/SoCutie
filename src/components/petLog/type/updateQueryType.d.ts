type UpdateSeePetLogCommentsQueryType = {
  action: string;
  petLogCommentId: number;
  editPayload?: string;
  // newCacheData?: seePetLogComments_seePetLogComments_comments;
  // prevCommentNumber?: number
  forCreateComment?: {
    offsetComments: (createPetLogComment_createPetLogComment_offsetComments | null)[] | null,
    setNowCommentsBundleNumber: React.Dispatch<React.SetStateAction<number>>,
    totalCommentsNumber: number,
  }
}

type UpdateSeePetLogCommentOfCommentsQueryType = {
  action: string;
  petLogCommentOfCommentId: number;
  editPayload?: string;
  newCacheData?: seePetLogCommentOfComments_seePetLogCommentOfComments_commentOfComments;
  // prevCommentNumber?: number;
  // numberNow?: number;
}

export { UpdateSeePetLogCommentsQueryType, UpdateSeePetLogCommentOfCommentsQueryType };
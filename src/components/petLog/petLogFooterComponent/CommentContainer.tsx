import { LazyQueryResult, QueryLazyOptions } from "@apollo/client";
import styled from "styled-components/native";
import { getNotifiedPetLogCommentOfComment_getNotifiedPetLogCommentOfComment_petLogCommentOfComment } from "../../../__generated__/getNotifiedPetLogCommentOfComment";
import { seePetLogComments, seePetLogCommentsVariables, seePetLogComments_seePetLogComments } from "../../../__generated__/seePetLogComments";
import NotLogInSingleCommentLayout from "../forNotLoggedInUser/NotLogInSingleCommentLayout";
import SingleCommentLayout from "../SingleCommentLayout";
import { UpdateSeePetLogCommentsQueryType } from "../type/updateQueryType";

const DivideLine = styled.View`
  border-top-width: 1px;
  border-top-color: rgba(192,192,192,0.6);
  margin-bottom: 5px;
`;
const CommentViewTitle = styled.Text`
  color: ${props=>props.theme.textColor};
  font-weight: bold;
  /* margin-left: 8px; */
  /* text-align: center; */
  margin: 5px 0px 8px 10px;
  font-size: 15px;
`;
const FlexRowContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  padding-top: 5px;
  border-top-width: 1px;
  border-top-color: rgba(192,192,192,0.6);
`;

type CommentListContainerProps = {
  dataDotSeePetLogComments:seePetLogComments_seePetLogComments[];
  isLoggedIn:boolean;
  nowEditingIndex:string;
  setNowEditingIndex:React.Dispatch<React.SetStateAction<string>>;
  updateSeePetLogCommentsQuery:({ action, petLogCommentId, editPayload, forCreateComment }: UpdateSeePetLogCommentsQueryType) => void;
  userWhichWriting:string | {
    userName: string;
  };
  setUserWhichWriting:React.Dispatch<React.SetStateAction<string | {
    userName: string;
  }>>;
  bundleIndexPressable:() => any[];
  commentId?:number;
  notifiedCommentOfComment?:getNotifiedPetLogCommentOfComment_getNotifiedPetLogCommentOfComment_petLogCommentOfComment;
  petLogId:number;
  seePetLogComments:(options?: QueryLazyOptions<seePetLogCommentsVariables>) => Promise<LazyQueryResult<seePetLogComments, seePetLogCommentsVariables>>
}

const CommentListContainer = ({
  dataDotSeePetLogComments,
  isLoggedIn,
  nowEditingIndex,
  setNowEditingIndex,
  updateSeePetLogCommentsQuery,
  userWhichWriting,
  setUserWhichWriting,
  bundleIndexPressable,
  commentId,
  notifiedCommentOfComment,
  petLogId,
  seePetLogComments,
}:CommentListContainerProps) => {

  return (
    <>
      {dataDotSeePetLogComments.length !==  0 && <>
        <CommentViewTitle>댓글</CommentViewTitle>
        <DivideLine/>
      </>}
      {/* comment.id 가 안받아 지는 경우가 있음. 왠진 몰라 */}
      {dataDotSeePetLogComments.map(comment=>(
        comment.id ?
          isLoggedIn ?
            <SingleCommentLayout
              key={comment.id}
              comment={comment}
              nowEditingIndex={nowEditingIndex}
              setNowEditingIndex={setNowEditingIndex}
              updateSeePetLogCommentsQuery={updateSeePetLogCommentsQuery}
              userWhichWriting={userWhichWriting}
              setUserWhichWriting={setUserWhichWriting}notifiedCommentOfComment={commentId === comment.id ? notifiedCommentOfComment : null}
              petLogId={petLogId}
              seePetLogComments={seePetLogComments}
            />
          :
            <NotLogInSingleCommentLayout
              key={comment.id}
              comment={comment}
            />
        :
          null
        )
      )}
      {dataDotSeePetLogComments.length !==  0 && <FlexRowContainer>
        {bundleIndexPressable()}
      </FlexRowContainer>}
    </>
  );
};

export default CommentListContainer;
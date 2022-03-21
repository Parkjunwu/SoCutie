import React from "react";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components/native";
import { seeCommentOfComments_seeCommentOfComments } from "../../__generated__/seeCommentOfComments";
import { toggleCommentOfCommentLike, toggleCommentOfCommentLikeVariables } from "../../__generated__/toggleCommentOfCommentLike";
import { PayloadAndLikesContainer } from "./layoutComponent/PayloadAndLikesContainer";
import UserInfoContainer from "./layoutComponent/UserInfoContainer";
import FlexRowContainer from "./commonStyledComponent/FlexRowContainer";
import EditBtnIfCommentOwner from "./layoutComponent/EditBtnIfCommentOwner";

const TOGGLE_COMMENT_OF_COMMENT_LIKE = gql`
  mutation toggleCommentOfCommentLike ($id:Int!) {
    toggleCommentOfCommentLike (id:$id) {
      ok
      error
    }
  }
`;

const LeftMarginContainer = styled.View`
  width: 30px;
`;

const SingleCommentOfCommentLayout = ({mention}:{mention:seeCommentOfComments_seeCommentOfComments}) => {
  const [commentOfCommentLikeMutation] = useMutation<toggleCommentOfCommentLike,toggleCommentOfCommentLikeVariables>(TOGGLE_COMMENT_OF_COMMENT_LIKE);
  const onPressLike = () => {
    commentOfCommentLikeMutation({
      variables:{
        id:mention.id
      },
      update: (cache,result) => {
        const ok = result.data?.toggleCommentOfCommentLike.ok;
        if(ok) {
          const commentOfCommentId = `CommentOfComment:${mention.id}`;
          cache.modify({
            id: commentOfCommentId,
            fields: {
              isLiked(prev) {
                return !prev
              },
              totalLikes(prev) {
                return mention.isLiked ? prev-1 : prev+1
              }
            }
          });
        };
      },
    });
  };
  return (
    <FlexRowContainer>
      <LeftMarginContainer/>
      <UserInfoContainer avatarUri={mention.user.avatar} userName={mention.user.userName}/>
      <PayloadAndLikesContainer payload={mention.payload} onPressLike={onPressLike} isLiked={mention.isLiked} totalLikes={mention.totalLikes} />
      <EditBtnIfCommentOwner isMine={mention.isMine}/>
    </FlexRowContainer>
  )
};

export default SingleCommentOfCommentLayout;
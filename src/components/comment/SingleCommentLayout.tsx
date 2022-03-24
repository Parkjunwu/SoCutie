import React from "react";
import styled from "styled-components/native";
import { seeComments_seeComments } from "../../__generated__/seeComments";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { seeCommentOfComments, seeCommentOfCommentsVariables } from "../../__generated__/seeCommentOfComments";
import { toggleCommentLike, toggleCommentLikeVariables } from "../../__generated__/toggleCommentLike";
import { createCommentOfComment, createCommentOfCommentVariables } from "../../__generated__/createCommentOfComment";
import SingleCommentOfCommentLayout from "./SingleCommentOfCommentLayout";
import UserInfoContainer from "./layoutComponent/UserInfoContainer";
import { PayloadAndLikesAndSeeMoreCommentContainer } from "./layoutComponent/PayloadAndLikesContainer";
import CreateCommentOfCommentContainer from "./layoutComponent/CreateCommentOfCommentContainer";
import FlexRowContainer from "./commonStyledComponent/FlexRowContainer";
import EditBtnIfCommentOwner from "./layoutComponent/EditBtnIfCommentOwner";

const SEE_COMMENT_OF_COMMENTS = gql`
  query seeCommentOfComments ($commentId: Int!, $cursorId: Int) {
    seeCommentOfComments (commentId: $commentId, cursorId: $cursorId) {
      id
      user{
        id
        userName
        avatar
      }
      payload
      createdAt
      isMine
      totalLikes
      isLiked
    }
  }
`;

const TOGGLE_COMMENT_LIKE = gql`
  mutation toggleCommentLike ($id:Int!) {
    toggleCommentLike (id:$id) {
      ok
      error
    }
  }
`;


const CREATE_COMMENT_OF_COMMENT = gql`
  mutation createCommentOfComment ($payload:String!,$commentId:Int!) {
    createCommentOfComment (payload:$payload,commentId:$commentId){
      ok
      error
    }
  }
`;

const SeeMoreComments = styled.TouchableOpacity``;
const SeeMoreCommentsText = styled.Text`
  color: ${props => props.theme.textColor};
`;
const BottomContainer = styled.View``;

let cursorId;


const SingleCommentLayout = ({comment}:{comment:seeComments_seeComments}) => {
  // 로그인 유저냐에 따라 좋아요 클릭 시 알림, 댓글 작성 아예 바꾸기 댓글을 작성하시려면 로그인 하셔야 합니다. 내 댓글일 경우 오른쪽 끝에 점점점 세개 붙여서 수정 삭제
  const [seeCommentOfComments,{data,loading,refetch}] = useLazyQuery<seeCommentOfComments,seeCommentOfCommentsVariables>(SEE_COMMENT_OF_COMMENTS);
  const onPressSeeMoreComments = async() => {
    if(loading) return;
    await seeCommentOfComments({
      variables:{
        commentId:comment.id,
        ...(cursorId && { cursorId })
      }
    });
  };
  const [commentLikeMutation] = useMutation<toggleCommentLike,toggleCommentLikeVariables>(TOGGLE_COMMENT_LIKE);
  const onPressLikes = async() => {
    const result = await commentLikeMutation({
      variables:{
        id:comment.id
      },
      update: (cache,result) => {
        const ok = result.data?.toggleCommentLike.ok;
        if(ok) {
          const commentId = `Comment:${comment.id}`;
          cache.modify({
            id: commentId,
            fields: {
              isLiked(prev) {
                return !prev
              },
              totalLikes(prev) {
                return comment.isLiked ? prev-1 : prev+1
              }
            }
          });
        };
      },
    });
  };

  const [createCommentOfComment] = useMutation<createCommentOfComment,createCommentOfCommentVariables>(CREATE_COMMENT_OF_COMMENT);

  const onPressCreateCommentOfComment = async(payload:string) => {
    await createCommentOfComment({
      variables:{
        payload,
        commentId:comment.id,
      },
      update: () => refetch(),
    });
  };

  const IfCommentOfCommentsExistThenShowButton = () => {
    if(comment.totalCommentOfComments !== 0 && !data){
      return (
        <SeeMoreComments onPress={onPressSeeMoreComments}>
          <SeeMoreCommentsText>댓글 보기</SeeMoreCommentsText>
        </SeeMoreComments>
      );
    }
  };
  const IfUserPressGettingCommentOfCommentThenShowThem = () => {
    return data?.seeCommentOfComments?.map(mention => <SingleCommentOfCommentLayout key={mention.id} mention={mention}/>)
  };

  return (
    <>
      <FlexRowContainer>
        <UserInfoContainer avatarUri={comment.user.avatar} userName={comment.user.userName}/>
        <PayloadAndLikesAndSeeMoreCommentContainer payload={comment.payload} onPressLike={onPressLikes} isLiked={comment.isLiked} totalLikes={comment.totalLikes}>
          {IfCommentOfCommentsExistThenShowButton()}
        </PayloadAndLikesAndSeeMoreCommentContainer>
        <EditBtnIfCommentOwner isMine={comment.isMine}/>
      </FlexRowContainer>
      <BottomContainer>
        {IfUserPressGettingCommentOfCommentThenShowThem()}
        <CreateCommentOfCommentContainer onPressCreateCommentOfComment={onPressCreateCommentOfComment} />
      </BottomContainer>
    </>
  );
};

export default SingleCommentLayout;
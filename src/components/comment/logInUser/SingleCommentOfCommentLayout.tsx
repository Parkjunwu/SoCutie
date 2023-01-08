import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components/native";
import { toggleCommentOfCommentLike, toggleCommentOfCommentLikeVariables } from "../../../__generated__/toggleCommentOfCommentLike";
import { editCommentOfComment, editCommentOfCommentVariables } from "../../../__generated__/editCommentOfComment";
import { deleteCommentOfComment, deleteCommentOfCommentVariables } from "../../../__generated__/deleteCommentOfComment";
import FlexRowContainer from "../commonStyledComponent/FlexRowContainer";
import { LikesAndPassedTimeContainer } from "../layoutComponent/PayloadAndLikesContainer";
import EditBtnIfCommentOwner from "../layoutComponent/EditBtnIfCommentOwner";
import { useNavigation } from "@react-navigation/native";
import AvatarContainer from "../commonStyledComponent/AvatarContainer";
import UserNameAndPayloadContainer from "../commonStyledComponent/UserNameAndPayloadContainer";
import { CommentsNavProps, LogInSingleCommentOfCommentProps } from "../../../types/comment";
import getPassedTime from "../../../logic/getPassedTime";

const TOGGLE_COMMENT_OF_COMMENT_LIKE = gql`
  mutation toggleCommentOfCommentLike ($id:Int!) {
    toggleCommentOfCommentLike (id:$id) {
      ok
      error
    }
  }
`;

const EDIT_COMMENT_OF_COMMENT = gql`
  mutation editCommentOfComment($id:Int!,$payload:String!) {
    editCommentOfComment(id:$id,payload:$payload) {
      ok
      error
    }
  }
`;

const DELETE_COMMENT_OF_COMMENT = gql`
  mutation deleteCommentOfComment($id:Int!) {
    deleteCommentOfComment(id:$id) {
      ok
      error
    }
  }
`;

const ContentContainer = styled.View`
  flex: 1;
`;
const UserActionContainer = styled.View`
  margin-top: 3px;
  margin-left: 10px;
`;

const EditComment = styled.TextInput`
  color: ${props => props.theme.textColor};
  flex: 1;
  margin-left: 10px;
  background-color: ${props=>props.theme.textInputBackgroundColor};
  border-radius: 3px;
  padding-left: 8px;
  padding-right: 8px;
`;

const SingleCommentOfCommentLayout = ({mention,nowEditingIndex,setNowEditingIndex,updateSeeCommentOfCommentsQuery,setUserWhichWriting,commentId}:LogInSingleCommentOfCommentProps) => {
  const commentOfCommentId = mention.id;
  const idForCacheAndEdit = `CommentOfComment:${mention.id}`;

  const [commentOfCommentLikeMutation] = useMutation<toggleCommentOfCommentLike,toggleCommentOfCommentLikeVariables>(TOGGLE_COMMENT_OF_COMMENT_LIKE);



  const onPressLike = () => {
    commentOfCommentLikeMutation({
      variables:{
        id:mention.id
      },
      update: (cache,result) => {
        const ok = result.data?.toggleCommentOfCommentLike.ok;
        if(ok) {
          cache.modify({
            id: idForCacheAndEdit,
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

  
  // 댓글 수정 중이란 뜻
  const isCommentEdit = nowEditingIndex === idForCacheAndEdit;

  const [editPayload,setEditPayload] = useState(mention.payload);



  const [editCommentOfComment] = useMutation<editCommentOfComment,editCommentOfCommentVariables>(EDIT_COMMENT_OF_COMMENT,{
    variables:{
      id:mention.id,
      payload:editPayload,
    },
    update:(cache,result) => {
      const ok = result.data.editCommentOfComment.ok;
      if(ok) {
        cache.modify({
          id: idForCacheAndEdit,
          fields: {
            payload:() => editPayload
          }
        });

        updateSeeCommentOfCommentsQuery({
          action: "editCommentOfComment",
          commentOfCommentId: commentOfCommentId,
          editPayload
        });
        // updateSeeCommentOfCommentsQuery((prev)=>{
        //   const {seeCommentOfComments:{ commentOfComments:prevCommentOfComments, isNotFetchMore, ...prevRest }} = prev;

        //   const newCommentOfComments = prevCommentOfComments.map(commentOfComment => {
        //     if(commentOfComment.id === commentOfCommentId) {
        //       const newCommentOfComment = {...commentOfComment};
        //       newCommentOfComment.payload = editPayload;
        //       return newCommentOfComment;
        //     } else {
        //       return {...commentOfComment};
        //     }
        //   });

        //   const updateResult = {
        //     seeCommentOfComments: {
        //       commentOfComments:newCommentOfComments,
        //       isNotFetchMore:true,
        //       ...prevRest,
        //     }
        //   };

        //   return updateResult;
        // });
      }
    }
  });
  
  const [deleteCommentOfComment] = useMutation<deleteCommentOfComment,deleteCommentOfCommentVariables>(DELETE_COMMENT_OF_COMMENT,{
    variables:{
      id:mention.id,
    },
    update:(cache,result) => {
      const ok = result.data.deleteCommentOfComment.ok;
      if(ok) {

        // 댓글 개수 변경
        cache.modify({
          id:`Comment:${commentId}`,
          fields:{
            totalCommentOfComments(prev){
              return prev-1;
            },
          },
        });
        
        updateSeeCommentOfCommentsQuery({
          action: "deleteCommentOfComment",
          commentOfCommentId: commentOfCommentId,
        });
        // updateSeeCommentOfCommentsQuery((prev)=>{
        //   const {seeCommentOfComments:{ commentOfComments:prevCommentOfComments, isNotFetchMore, ...prevRest }} = prev;

        //   const newCommentOfComments = prevCommentOfComments.filter(commentOfComment => commentOfComment.id !== commentOfCommentId);

        //   const updateResult = {
        //     seeCommentOfComments: {
        //       commentOfComments:newCommentOfComments,
        //       isNotFetchMore:true,
        //       ...prevRest,
        //     }
        //   };

        //   return updateResult;
        // });
      }
    }
  });

  const user = mention.user;
  const userId = user.id;
  const userName = user.userName;
  const avatar = user.avatar;
  const payload = mention.payload;
  const createAt = mention.createdAt;

  const passedTime = getPassedTime(createAt);
  
  const navigation = useNavigation<CommentsNavProps["navigation"]>();
  const onPressUserInfo = () => {
    navigation.navigate("Profile",{id:userId,userName});
  };

  return (
    <FlexRowContainer>
      <AvatarContainer
        avatar={avatar}
        onPressAvatar={onPressUserInfo}
      />
      {isCommentEdit ?
      <EditComment value={editPayload} autoCapitalize="none" autoCorrect={false} onChangeText={(text)=>setEditPayload(text)} multiline={true} />
      :
      <ContentContainer>
        <UserNameAndPayloadContainer
          onPressUserName={onPressUserInfo}
          userName={userName}
          payload={payload}
        />
        <UserActionContainer>
          <LikesAndPassedTimeContainer
            onPressLike={onPressLike}
            isLiked={mention.isLiked}
            totalLikes={mention.totalLikes}
            passedTime={passedTime}
          />
        </UserActionContainer>
      </ContentContainer>
      }
      <EditBtnIfCommentOwner
        id={idForCacheAndEdit}
        isMine={mention.isMine}
        nowEditingIndex={nowEditingIndex}
        setNowEditingIndex={setNowEditingIndex}
        editMutation={editCommentOfComment}
        deleteMutation={deleteCommentOfComment}
        setUserWhichWriting={setUserWhichWriting}
      />
    </FlexRowContainer>
  )
};

export default SingleCommentOfCommentLayout;
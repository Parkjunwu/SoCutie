import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { CommentsNavProps } from "../../types/comment";
import { togglePetLogCommentOfCommentLike, togglePetLogCommentOfCommentLikeVariables } from "../../__generated__/togglePetLogCommentOfCommentLike";
import { editPetLogCommentOfComment, editPetLogCommentOfCommentVariables } from "../../__generated__/editPetLogCommentOfComment";
import { deletePetLogCommentOfComment, deletePetLogCommentOfCommentVariables } from "../../__generated__/deletePetLogCommentOfComment";
import getPassedTime from "../../logic/getPassedTime";
import FlexRowContainer from "../comment/commonStyledComponent/FlexRowContainer";
import AvatarContainer from "../comment/commonStyledComponent/AvatarContainer";
import UserNameAndPayloadContainer from "../comment/commonStyledComponent/UserNameAndPayloadContainer";
import { LikesAndPassedTimeContainer } from "../comment/layoutComponent/PayloadAndLikesContainer";
import EditBtnIfCommentOwner from "../comment/layoutComponent/EditBtnIfCommentOwner";
import { UpdateSeePetLogCommentOfCommentsQueryType, UpdateSeePetLogCommentsQueryType } from "./type/updateQueryType";

const TOGGLE_PETLOG_COMMENT_OF_COMMENT_LIKE = gql`
  mutation togglePetLogCommentOfCommentLike ($id:Int!) {
    togglePetLogCommentOfCommentLike (id:$id) {
      ok
      error
    }
  }
`;

const EDIT_PETLOG_COMMENT_OF_COMMENT = gql`
  mutation editPetLogCommentOfComment($id:Int!,$payload:String!) {
    editPetLogCommentOfComment(id:$id,payload:$payload) {
      ok
      error
    }
  }
`;

const DELETE_PETLOG_COMMENT_OF_COMMENT = gql`
  mutation deletePetLogCommentOfComment($id:Int!) {
    deletePetLogCommentOfComment(id:$id) {
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

type LogInSingleCommentOfCommentProps = {
  nowEditingIndex: string,
  setNowEditingIndex: React.Dispatch<React.SetStateAction<string>>,
  mention:any;
  updateSeePetLogCommentOfCommentsQuery:(props:UpdateSeePetLogCommentOfCommentsQueryType) => void;
  setUserWhichWriting: React.Dispatch<React.SetStateAction<string|{userName:string}>>;
  updateSeePetLogCommentsQuery:(props:UpdateSeePetLogCommentsQueryType) => void;
  petLogCommentId: number;
}

const SingleCommentOfCommentLayout = ({mention,nowEditingIndex,setNowEditingIndex,updateSeePetLogCommentOfCommentsQuery,setUserWhichWriting,updateSeePetLogCommentsQuery,petLogCommentId}:LogInSingleCommentOfCommentProps) => {
  const commentOfCommentId = mention.id;
  const idForCacheAndEdit = `PetLogCommentOfComment:${mention.id}`;

  const [petLogCommentOfCommentLikeMutation] = useMutation<togglePetLogCommentOfCommentLike,togglePetLogCommentOfCommentLikeVariables>(TOGGLE_PETLOG_COMMENT_OF_COMMENT_LIKE);



  const onPressLike = () => {
    petLogCommentOfCommentLikeMutation({
      variables:{
        id:mention.id
      },
      update: (cache,result) => {
        const ok = result.data?.togglePetLogCommentOfCommentLike.ok;
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



  const [editPetLogCommentOfComment] = useMutation<editPetLogCommentOfComment,editPetLogCommentOfCommentVariables>(EDIT_PETLOG_COMMENT_OF_COMMENT,{
    variables:{
      id:mention.id,
      payload:editPayload,
    },
    update:(cache,result) => {
      const ok = result.data.editPetLogCommentOfComment.ok;
      if(ok) {
        cache.modify({
          id: idForCacheAndEdit,
          fields: {
            payload:() => editPayload
          }
        });

        updateSeePetLogCommentOfCommentsQuery({
          action: "editCommentOfComment",
          petLogCommentOfCommentId: commentOfCommentId,
          editPayload
        });
      }
    },
  });
  
  const [deletePetLogCommentOfComment] = useMutation<deletePetLogCommentOfComment,deletePetLogCommentOfCommentVariables>(DELETE_PETLOG_COMMENT_OF_COMMENT,{
    variables:{
      id:mention.id,
    },
    update:(cache,result) => {
      const ok = result.data.deletePetLogCommentOfComment.ok;
      if(ok) { 

        // 대댓글 갯수 변경
        updateSeePetLogCommentsQuery({
          action: "deleteCommentOfComment",
          petLogCommentId: petLogCommentId,
        });

        // 대댓글 제거
        updateSeePetLogCommentOfCommentsQuery({
          action: "deleteCommentOfComment",
          petLogCommentOfCommentId: commentOfCommentId,
        });
        
      }
    },
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
        <EditComment
          value={editPayload}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text)=>setEditPayload(text)}
          multiline={true}
        />
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
        editMutation={editPetLogCommentOfComment}
        deleteMutation={deletePetLogCommentOfComment}
        setUserWhichWriting={setUserWhichWriting}
      />
    </FlexRowContainer>
  )
};

export default SingleCommentOfCommentLayout;
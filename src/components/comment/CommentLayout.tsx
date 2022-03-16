import React from "react";
import styled from "styled-components/native";
import { seeComments_seeComments } from "../../__generated__/seeComments";
import {Ionicons} from "@expo/vector-icons"
import { gql, useLazyQuery } from "@apollo/client";
import { seeCommentOfComments, seeCommentOfCommentsVariables, seeCommentOfComments_seeCommentOfComments } from "../../__generated__/seeCommentOfComments";
import { View } from "react-native";

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

const Container = styled.View`
  padding: 5px 10px;
  flex-direction: row;
`;
const UContainer = styled.View``;
const UserContainer = styled.View`
  flex-direction: row;
  /* background-color: tomato; */
`;
const Avatar = styled.Image`
  /* margin-right: 10px; */
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;
const UserName = styled.Text`
  color:white;
  font-size: 18px;
  font-weight: 600;
  margin: auto 10px;
`;
const ContentContainer = styled.View`
  /* background-color: green; */
  /* width: 70%; */
  flex: 1;
`;
const Payload = styled.Text`
  font-size: 15px;
  color: white;
`;
const TotalContainer = styled.View`
  flex-direction: row;
`;
const ToLikeLink = styled.TouchableOpacity`
  flex-direction: row;
`;
const TotalLikes = styled.Text`
  color: white;
`;
const SeeMoreComments = styled.TouchableOpacity`

`;
const SeeMoreCommentsText = styled.Text`
  color: white;
`;
const CreatePlusCommentContainer = styled.View`
  margin-left: 80px;
  flex-direction: row;
`;
const CreatePlusComment = styled.TextInput`
  color: white;
`;
const CreatePlusCommentBtn = styled.TouchableOpacity`

`;
const CreatePlusCommentBtnText = styled.Text`
  color: white;
`;
const EditBtn = styled.TouchableOpacity`
  width: 10%;
`;

const CommentOfCommentContainer = styled.View`
  margin-left: 10px;
`;

let cursorId;

const CommentOfCommentLayout = ({mention}:{mention:seeCommentOfComments_seeCommentOfComments}) => {
    console.log(mention)
    return (
      <Container>
      <CommentOfCommentContainer>
        <UserContainer>
          <Avatar source={mention.user.avatar ? {uri:mention.user.avatar} : require("../../../assets/no_user.png")}/>
          <UserName>{mention.user.userName}</UserName>
        </UserContainer>
      </CommentOfCommentContainer>
        <ContentContainer>
          <Payload>{mention.payload}</Payload>
          <TotalContainer>
            <ToLikeLink>
              <Ionicons name={mention.isLiked?"heart":"heart-outline"} color={mention.isLiked?"tomato":"white"} size={16}/>
              <TotalLikes>  {mention?.totalLikes}   </TotalLikes>
            </ToLikeLink>
          </TotalContainer>
        </ContentContainer>
        <EditBtn>
          {mention.isMine && <Ionicons name="ellipsis-vertical-outline" size={24} color="black" />}
        </EditBtn>
      </Container>
    )
  }
const CommentLayout = ({comment}:{comment:seeComments_seeComments}) => {
  // 로그인 유저냐에 따라 좋아요 클릭 시 알림, 댓글 작성 아예 바꾸기 댓글을 작성하시려면 로그인 하셔야 합니다. 내 댓글일 경우 오른쪽 끝에 점점점 세개 붙여서 수정 삭제
  const [seeCommentOfComments,{data,loading}] = useLazyQuery<seeCommentOfComments,seeCommentOfCommentsVariables>(SEE_COMMENT_OF_COMMENTS);
  const onPressSeeMoreComments = async() => {
    if(loading) return;
    await seeCommentOfComments({
      variables:{
        commentId:comment.id,
        ...(cursorId && { cursorId })
      }
    });
  };

  
  return (
    <>
    <Container>
      <UContainer>
      <UserContainer>
        <Avatar source={comment.user.avatar ? {uri:comment.user.avatar} : require("../../../assets/no_user.png")}/>
        <UserName>{comment.user.userName}</UserName>
      </UserContainer>
      </UContainer>
        <ContentContainer>
          <Payload>{comment.payload}</Payload>
          <TotalContainer>
            <ToLikeLink>
              <Ionicons name={comment.isLiked?"heart":"heart-outline"} color={comment.isLiked?"tomato":"white"} size={16}/>
            </ToLikeLink>
            <TotalLikes>  {comment?.totalLikes}   </TotalLikes>
            {(comment.totalCommentOfComments !== 0 && !data) && <SeeMoreComments onPress={onPressSeeMoreComments}>
              <SeeMoreCommentsText>댓글 보기</SeeMoreCommentsText>
            </SeeMoreComments>}
          </TotalContainer>
          
        </ContentContainer>
        <EditBtn>
          {comment.isMine && <Ionicons name="ellipsis-vertical-outline" size={24} color="black" />}
        </EditBtn>
    </Container>
    <View>
      {data?.seeCommentOfComments?.map(mention => <CommentOfCommentLayout key={mention.id} mention={mention}/>)}
      <CreatePlusCommentContainer>
        <CreatePlusComment placeholder="댓글 달기"/>
        <CreatePlusCommentBtn>
          <CreatePlusCommentBtnText>작성</CreatePlusCommentBtnText>
        </CreatePlusCommentBtn>
      </CreatePlusCommentContainer>
    </View>
    </>
  );
};

export default CommentLayout;
import { gql, useMutation, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ListRenderItem, Platform, Text, View } from "react-native";
import styled from "styled-components/native";
import SingleCommentLayout from "../../../../components/comment/SingleCommentLayout";
import { FeedStackProps } from "../../../../components/type";
import { createComment, createCommentVariables } from "../../../../__generated__/createComment";
import { seeComments, seeCommentsVariables, seeComments_seeComments } from "../../../../__generated__/seeComments";

const SEE_COMMENTS = gql`
  query seeComments($postId:Int!,$cursorId:Int) {
    seeComments(postId:$postId,cursorId:$cursorId) {
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
      totalCommentOfComments
      isLiked
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation createComment($payload: String!, $postId: Int!) {
    createComment(payload: $payload, postId: $postId) {
      ok
      error
    }
  }
`;

const KeyboardAvoidLayout = styled.KeyboardAvoidingView`
  flex: 1;
`;
const Container = styled.View`
  background-color: ${props => props.theme.backgroundColor};
  flex:1;
`;
const CommentFlatList = styled.FlatList`
  flex:10;
`;
const CreateCommentContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
`;
const CommentInput = styled.TextInput`
  padding: 10px;
  background-color: ${props=>props.theme.textInputBackgroundColor};
  border-radius: 3px;
  width: 85%;
`;
const CreateCommentBtn = styled.TouchableOpacity`
  border-radius: 3px;
   background-color: red;
`;
const CreateCommentBtnText = styled.Text`
  padding: 10px;
  font-size: 15px;
`;

type Props = NativeStackScreenProps<FeedStackProps, 'Comments'>;

const Comments = ({navigation,route}:Props) => {
  const {data,refetch} = useQuery<seeComments,seeCommentsVariables>(SEE_COMMENTS,{
    variables:{
      postId:route.params.postId
    },
  });

  useEffect(()=>{
    refetch();
  },[])

  const [value,setValue] = useState("");
  console.log(value);

  const [createComment] = useMutation<createComment,createCommentVariables>(CREATE_COMMENT);

  const renderItem:ListRenderItem<seeComments_seeComments> = ({item}) => {
    return <SingleCommentLayout comment={item}/>;
  }
  const onPressCreateComment = () => {
    createComment({
      variables:{
        payload:value,
        postId:route.params.postId
      },
      // 댓글 올리고 나서 댓글 다시 받음
      update:(cache, mutationResult) => {
        if(mutationResult.data.createComment.ok){
          // 캐시 말고 그냥 refetch 함. 그동안 다른 사람이 글 쓰면 이상해지니까
          refetch();
          // 만약 캐시 쓸거면 ROOT_QUERY 에 seeComments({"postId":route.params.postId}) 이걸로 변경
        }
      },
    });
  }
  return (
    <KeyboardAvoidLayout
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <Container>
        <CommentFlatList 
          data={data?.seeComments}
          renderItem={renderItem}
          keyExtractor={(item:seeComments_seeComments) => item.id+""}
          ListEmptyComponent={()=><View style={{justifyContent:"center",alignItems:"center"}}><Text style={{color:"white"}}>댓글이 없습니다.</Text></View>}
        />
        <CreateCommentContainer>
          <CommentInput placeholder="댓글을 작성해 주세요." value={value} onChangeText={(text)=>setValue(text)}/>
          <CreateCommentBtn onPress={onPressCreateComment}>
            <CreateCommentBtnText>작성</CreateCommentBtnText>
          </CreateCommentBtn>
        </CreateCommentContainer>
      </Container>
    </KeyboardAvoidLayout>
  );
}
export default Comments;
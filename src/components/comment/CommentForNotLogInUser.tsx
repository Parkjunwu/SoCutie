import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { ListRenderItem } from "react-native";
import styled from "styled-components/native";
import cursorPaginationFetchMore from "../../logic/cursorPaginationFetchMore";
import { CommentProps } from "../../types/comment";
import { isAndroid } from "../../utils";
import { seeComments, seeCommentsVariables, seeComments_seeComments_comments } from "../../__generated__/seeComments";
import KeyboardAvoidLayout from "../KeyboardAvoidLayout";
import SEE_COMMENTS from "./gql/seeComments";
import { CommentInput, CreateCommentBtn, CreateCommentBtnText, CreateCommentContainer } from "./logInUser/AndroidAndIOSStyledComponent";
import NotLogInSingleCommentLayout from "./notLogInUser/NotLogInSingleCommentLayout";

const Container = styled.View`
  background-color: ${props => props.theme.backgroundColor};
  flex:1;
`;
const CommentFlatList = styled.FlatList`
  flex:10;
`;
const NoDataView = styled(Container)`
  justify-content: center;
  align-items: center;
`;
const NoCommentText = styled.Text`
  text-align: center;
  padding-top: 30px;
  color: ${props=>props.theme.textColor};
`;


const CommentForNotLogInUser = ({route}:CommentProps) => {

  const postId = route.params.postId;
  const commentId = route.params.commentId;

  const [seeComments,{data,fetchMore,loading}] = useLazyQuery<seeComments,seeCommentsVariables>(SEE_COMMENTS,{
    variables:{
      postId,
      ...(commentId && { cursorId: commentId })
    },
  });

  useEffect(()=>{
    seeComments();
  },[]);

  // 이건 안넣어도 됨
  const ListHeaderComponent = () => {
    return null;
  };

  const renderItem:ListRenderItem<seeComments_seeComments_comments> = ({item}) => {
    return (
      <NotLogInSingleCommentLayout
        comment={item}
      />
    );
  };
  
  // infinite scroll
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.seeComments.cursorId,
      },
    });
  };

  const onEndReached = async() => {
    await cursorPaginationFetchMore(data?.seeComments,fetchMoreFn);
  };

  if(loading) {
    return (
      <NoDataView style={{justifyContent:"center",alignItems:"center"}}>
        <NoCommentText>Loading ...</NoCommentText>
      </NoDataView>
    );
  }

  return (
    <KeyboardAvoidLayout>
      <Container>
        <CommentFlatList 
          data={data?.seeComments.comments}
          renderItem={renderItem}
          keyExtractor={(item:seeComments_seeComments_comments) => item.id+""}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={()=><NoDataView style={{justifyContent:"center",alignItems:"center"}}><NoCommentText>댓글이 없습니다.</NoCommentText></NoDataView>}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          // onRefresh={onRefresh}
          // refreshing={refreshing}
          inverted={data?.seeComments.comments.length !== 0}
        />
        <CreateCommentContainer
          disabled={true}
        >
          <CommentInput
            placeholder="댓글 작성은 로그인 후 이용 가능합니다."
            editable={false}
            isAndroid={isAndroid}
          />
          <CreateCommentBtn
            isAndroid={isAndroid}
            disabled={true}
          >
            <CreateCommentBtnText isAndroid={isAndroid}>작성</CreateCommentBtnText>
          </CreateCommentBtn>
        </CreateCommentContainer>
      </Container>
    </KeyboardAvoidLayout>
  );
};

export default CommentForNotLogInUser;
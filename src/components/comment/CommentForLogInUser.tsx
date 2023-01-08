import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { ListRenderItem, NativeSyntheticEvent, ScrollView, TextInputFocusEventData, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import cursorPaginationFetchMore from "../../logic/cursorPaginationFetchMore";
import { CommentProps } from "../../types/comment";
import { createComment, createCommentVariables } from "../../__generated__/createComment";
import { getNotifiedCommentOfComment, getNotifiedCommentOfCommentVariables } from "../../__generated__/getNotifiedCommentOfComment";
import { seeComments, seeCommentsVariables, seeComments_seeComments_comments } from "../../__generated__/seeComments";
import SEE_COMMENTS from "./gql/seeComments";
import SingleCommentLayout from "./logInUser/SingleCommentLayout";
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import useMe from "../../hooks/useMe";
import useTextInputKeyboardAware from "../../hooks/useTextInputKeyboardAware";
import useGetInnerLayoutHeight from "../../hooks/useGetInnerLayoutHeight";
import GET_NOTIFIED_COMMENT_OF_COMMENT from "./gql/getNotifiedCommentOfComment";
import CREATE_COMMENT from "./gql/createComment";
import logInUserThing from "./logInUser/logInUserThing";
import { 
  Container,
  CreateCommentContainer,
  CommentInput,
  CreateCommentBtn,
  CreateCommentBtnText,
  NoCommentText,
  FlatListContainer,
  LoadingView,
  NoDataView,
} from "./logInUser/AndroidAndIOSStyledComponent";
import useHeaderRightNavigateToPostIfCommentId from "./hook/useHeaderRightNavigateToPost";
import NotifiedCommentLayOut from "./forNotificationComment/NotifiedCommentLayOut";

const EmptyViewForKeyboardAvoid = styled.View`
  height: 500px;
  background-color: ${props=>props.theme.backgroundColor};
`;

const CommentForLogInUser = ({route}:CommentProps) => {

  const postId = route.params.postId;
  const commentId = route.params.commentId;
  const commentOfCommentId = route.params.commentOfCommentId;

  
  // 훅이 이렇게도 되네
  useHeaderRightNavigateToPostIfCommentId(postId,commentId);

  // 얘랑 밑에 두개는 refetch 안해도 될듯? 어차피 똑같은 앤데. 근데 좋아요 갯수나 이런건 못
  const [getNotifiedCommentOfComment,{data:notifiedCommentOfComment}] = useLazyQuery<getNotifiedCommentOfComment,getNotifiedCommentOfCommentVariables>(GET_NOTIFIED_COMMENT_OF_COMMENT,{
    variables:{
      commentOfCommentId,
    },
  });


  // useLazyQuery 하고 useEffect 로 바로 refetch. 그러면 밑에 refetchNotifiedCommentOfComment, refetchNotifiedComment 도 한번씩만 받음.
  // commentId 있으면 notification 으로 들어왔다는 얘기.
  const [seeComments,{data,loading,fetchMore,updateQuery:updateSeeCommentsQuery}] = useLazyQuery<seeComments,seeCommentsVariables>(SEE_COMMENTS,{
    variables:{
      postId,
      ...(commentId && { cursorId: commentId, isNotification: true }),
    },
    onCompleted:async()=>{
      // param 에 commentId, commentOfCommentId 있으면 = notification 에서 넘어온거면
      if(commentOfCommentId){
        // await refetchNotifiedCommentOfComment();
        await getNotifiedCommentOfComment();
      }
    },
  });
  
  useEffect(()=>{
    // refetch();
    seeComments({
      variables:{
        postId,
        ...(commentId && { cursorId: commentId, isNotification: true }),
      }
    });
  // 백그라운드에서 noti 로 들어오면 refetch 가 안돼. 그래서 의존성 넣음
  },[commentId]);

  // 대댓글 작성 / 댓글 수정일 때 Comment 의 댓글 작성 뷰 안보이도록
  const [userWhichWriting,setUserWhichWriting] = useState<string|{userName:string}>("comment");

  // 댓글 하나가 수정중이면 다른애 안되도록... 이거보다 좋은게 있을 거 같긴한데..
  // isFocused 써서 화면 나갔을 때 수정중인거 있으면 취소할거냐 Alert 도 구현하면 좋을 듯. 확인시 수정 취소
  const [nowEditingIndex,setNowEditingIndex] = useState<string>("");

  const ListEmptyComponent = () => {
    // commentId 가 있으면 헤더가 있으니 아래에 없다는거 안나오게.
    if(commentId) {
      return null;
    }
    
    return (
      <NoDataView />
    );
  };


  const [value,setValue] = useState("");

  const [createComment] = useMutation<createComment,createCommentVariables>(CREATE_COMMENT);


  const renderItem:ListRenderItem<seeComments_seeComments_comments> = ({item}) => {
    return (
      <SingleCommentLayout
        comment={item}
        nowEditingIndex={nowEditingIndex}
        setNowEditingIndex={setNowEditingIndex}
        updateSeeCommentsQuery={updateSeeCommentsQuery}
        userWhichWriting={userWhichWriting}
        setUserWhichWriting={setUserWhichWriting}
      />
    );
  };

  const {data:meData} = useMe();

  const onPressCreateComment = async() => {
    await createComment({
      variables:{
        payload:value,
        postId
      },
      // 댓글 올리고 나서 댓글 다시 받음
      update:async(cache, mutationResult) => {
        if(mutationResult.data.createComment.ok){
          // 지금은 캐시 변경인데 그전에 다른 사람이 쓰면 이상해지..지만 걍 써. 만약 받을거면 await refetch() 쓰되 얘는 5개로 돌아옴
          const now = new Date().getTime()+"";
          const __typename:"Comment" = "Comment";

          const newComment = {
            __typename,
            id: mutationResult.data.createComment.id,
            user: meData.me,
            payload: value,
            createdAt: now,
            isMine: true,
            totalLikes: 0,
            totalCommentOfComments:0,
            isLiked: false,
          };

          updateSeeCommentsQuery((prev)=>{
            const {seeComments:{ comments:prevComments, isNotFetchMore, ...prevRest }} = prev;

            const updateResult = {
              seeComments: {
                comments:[newComment,...prevComments],
                isNotFetchMore:true,
                ...prevRest,
              }
            };

            return updateResult;
          });
          setValue("");
        }
      },
    });
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


  const scrollRef = useRef<ScrollView>();
  const {setCreateCommentOnFocused} = useTextInputKeyboardAware(scrollRef);

  const innerLayoutHeight = useGetInnerLayoutHeight();

  const onFocusCreateComment = (e:NativeSyntheticEvent<TextInputFocusEventData>) => {
    setCreateCommentOnFocused(true);
  }

  const onPressScreen = () => {
    setCreateCommentOnFocused(false);
  };

  if(loading) {
    return <LoadingView />;
  }
  
  if (commentOfCommentId && notifiedCommentOfComment?.getNotifiedCommentOfComment?.error) {
    return <NoCommentText>{notifiedCommentOfComment.getNotifiedCommentOfComment.error}</NoCommentText>;
  }

  const { placeholder, disabled } = logInUserThing(userWhichWriting);
  
  const isAndroid = false;

  const renderData = () => {
    // 댓글, 대댓글 받으면 걔가 Header 에 있으니 뺌.
    if(commentId && data && data.seeComments.comments.length !== 0) {
      const newArray = [...data.seeComments.comments];
      // 첫번째 값은 ListHeaderComponent 에 있으니 삭제. shift 가 삭제하는 애.
      newArray.shift();
      return newArray;
    } else {
      return data?.seeComments.comments;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onPressScreen}>
      <ScrollView ref={scrollRef} scrollEnabled={false}>
        <Container style={{height:innerLayoutHeight}}>
          <FlatListContainer>
            <KeyboardAwareFlatList
              // style={{flex:1}}
              extraScrollHeight={20}
              // data={data?.seeComments.comments}
              data={renderData()}
              renderItem={renderItem}
              keyExtractor={(item:seeComments_seeComments_comments) => item.id+""}
              // 컴포넌트 만들어서 따로 넣어야 TextInput 작동함
              ListHeaderComponent={
                <NotifiedCommentLayOut
                  commentId={commentId}
                  data={data}
                  notifiedCommentOfComment={notifiedCommentOfComment}
                  nowEditingIndex={nowEditingIndex}
                  setNowEditingIndex={setNowEditingIndex}
                  updateSeeCommentsQuery={updateSeeCommentsQuery}
                  userWhichWriting={userWhichWriting}
                  setUserWhichWriting={setUserWhichWriting}
                />
              }
              ListEmptyComponent={ListEmptyComponent}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
              // onRefresh={onRefresh}
              // refreshing={refreshing}
              inverted={data?.seeComments.comments.length !== 0}
            />
          </FlatListContainer>
          <CreateCommentContainer disabled={disabled()}>
            <CommentInput
              placeholder={placeholder()}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text)=>setValue(text)}
              editable={!disabled()}
              onFocus={onFocusCreateComment}
              isAndroid={isAndroid}
            />
            <CreateCommentBtn isAndroid={isAndroid} disabled={disabled()} onPress={onPressCreateComment}>
              <CreateCommentBtnText isAndroid={isAndroid}>작성</CreateCommentBtnText>
            </CreateCommentBtn>
          </CreateCommentContainer>
        </Container>
        {<EmptyViewForKeyboardAvoid/>}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default CommentForLogInUser;
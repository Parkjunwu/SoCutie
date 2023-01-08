import React from "react";
import styled from "styled-components/native";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { seeCommentOfComments, seeCommentOfCommentsVariables } from "../../../__generated__/seeCommentOfComments";
import { toggleCommentLike, toggleCommentLikeVariables } from "../../../__generated__/toggleCommentLike";
import { createCommentOfComment, createCommentOfCommentVariables } from "../../../__generated__/createCommentOfComment";
import SingleCommentOfCommentLayout from "./SingleCommentOfCommentLayout";
import { LikesAndCommentsAndSeeMoreCommentContainer } from "../layoutComponent/PayloadAndLikesContainer";
import CreateCommentOfCommentContainer from "../layoutComponent/CreateCommentOfCommentContainer";
import FlexRowContainer from "../commonStyledComponent/FlexRowContainer";
import EditBtnIfCommentOwner from "../layoutComponent/EditBtnIfCommentOwner";
import cursorPaginationFetchMore from "../../../logic/cursorPaginationFetchMore";
import { useState } from "react";
import { editComment, editCommentVariables } from "../../../__generated__/editComment";
import { deleteComment, deleteCommentVariables } from "../../../__generated__/deleteComment";
import SEE_COMMENT_OF_COMMENTS from "../gql/seeCommentOfComments";
import { useNavigation } from "@react-navigation/native";
import AvatarContainer from "../commonStyledComponent/AvatarContainer";
import UserNameAndPayloadContainer from "../commonStyledComponent/UserNameAndPayloadContainer";
import { CommentsNavProps, LogInSingleCommentProps } from "../../../types/comment";
import getPassedTime from "../../../logic/getPassedTime";
import useMe from "../../../hooks/useMe";
import { View } from "react-native";
import { UpdateSeeCommentOfCommentsQueryType } from "../../post/type/post.updateQueryType";

const FlexRowContainerWithMargin = styled(FlexRowContainer)`
  margin-left: 10px;
`;
const ContentContainer = styled.View`
  flex: 1;
`;
const UserActionContainer = styled.View`
  margin-top: 3px;
  margin-left: 10px;
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
      id
    }
  }
`;

const EDIT_COMMENT = gql`
  mutation editComment($id:Int!,$payload:String!) {
    editComment(id:$id,payload:$payload) {
      ok
      error
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($id:Int!) {
    deleteComment(id:$id) {
      ok
      error
    }
  }
`;


const SeeMoreComments = styled.TouchableOpacity`
`;
const SeeMoreCommentsText = styled.Text`
  color: ${props => props.theme.textColor};
`;
const SeeMoreCommentOfComments = styled(SeeMoreComments)`
  margin-left: 60px;
  margin-bottom: 5px;
`;
const SeeMoreCommentOfCommentsText = styled(SeeMoreCommentsText)``;
const BottomContainer = styled.View`
  margin-left: 40px;
`;
const SeeAllComments = styled.TouchableOpacity`
  margin-top: 5px;
  margin-left: 60px;
`;
const EditComment = styled.TextInput`
  color: ${props => props.theme.textColor};
  flex: 1;
  margin-left: 10px;
  background-color: ${props=>props.theme.textInputBackgroundColor};
  border-radius: 3px;
  padding-left: 8px;
  padding-right: 8px;
  /* 얜 뭔가 안맞음. 그래서 넣음 */
  padding-bottom: 2px;
`;


const SingleCommentLayout = ({comment,notifiedCommentOfComment,nowEditingIndex,setNowEditingIndex,updateSeeCommentsQuery,userWhichWriting,setUserWhichWriting}:LogInSingleCommentProps) => {

  const commentId = comment.id;
  const idForCacheAndEdit = `Comment:${commentId}`;
  
  // 로그인 유저냐에 따라 좋아요 클릭 시 알림, 댓글 작성 아예 바꾸기 댓글을 작성하시려면 로그인 하셔야 합니다. 내 댓글일 경우 오른쪽 끝에 점점점 세개 붙여서 수정 삭제
  const [
    seeCommentOfComments,
    {
      data,
      loading,
      fetchMore,
      updateQuery
    }
  ] = useLazyQuery<seeCommentOfComments,seeCommentOfCommentsVariables>(SEE_COMMENT_OF_COMMENTS,{
    variables:{
      commentId,
      // ...(cursorId && { cursorId })
    }
  });

  const onPressSeeMoreComments = async() => {
    if(loading) return;
    // await refetch();
    await seeCommentOfComments();
  };
  
  const [commentLikeMutation] = useMutation<toggleCommentLike,toggleCommentLikeVariables>(TOGGLE_COMMENT_LIKE);

  const onPressLikes = async() => {
    const result = await commentLikeMutation({
      variables:{
        id:commentId
      },
      update: (cache,result) => {
        const ok = result.data?.toggleCommentLike.ok;
        if(ok) {
          cache.modify({
            id: idForCacheAndEdit,
            fields: {
              isLiked(prev) {
                return !prev;
              },
              totalLikes(prev) {
                return comment.isLiked ? prev-1 : prev+1;
              }
            }
          });
        };
      },
    });
  };




  
  const updateSeeCommentOfCommentsQuery = ({action,commentOfCommentId,editPayload,newCacheData}:UpdateSeeCommentOfCommentsQueryType) => {

    updateQuery((prev)=>{

      if(action === 'createCommentOfComment') {

        const {seeCommentOfComments:{ commentOfComments:prevCommentOfComments, isNotFetchMore, ...prevRest }} = prev;

        // 캐시 변경
        const updateResult = {
          seeCommentOfComments: {
            // 뒤에 나오도록
            commentOfComments:[...prevCommentOfComments,newCacheData],
            isNotFetchMore:true,
            // fetchedTime,
            ...prevRest,
          }
        };

        return updateResult;
      };

      // 그외
      const {seeCommentOfComments:{ commentOfComments:prevCommentOfComments, isNotFetchMore, ...prevRest }} = prev;

      let newCommentOfComments;

      switch(action) {
          
        case 'editCommentOfComment':  // 댓글 변경
          newCommentOfComments = prevCommentOfComments.map(commentOfComment => {
            if(commentOfComment.id === commentOfCommentId) {
              const newCommentOfComment = {...commentOfComment};
              newCommentOfComment.payload = editPayload;
              return newCommentOfComment;
            } else {
              return {...commentOfComment};
            }
          });
          break;

        case 'deleteCommentOfComment': // 댓글 삭제
          newCommentOfComments = prevCommentOfComments.filter(commentOfComment => commentOfComment.id !== commentOfCommentId);
          break;

        // default:
        //   break;
      }

      const updateResult = {
        seeCommentOfComments: {
          commentOfComments:newCommentOfComments,
          isNotFetchMore:true,
          ...prevRest,
        }
      };

      return updateResult;
    });
  };





  const [createCommentOfComment] = useMutation<createCommentOfComment,createCommentOfCommentVariables>(CREATE_COMMENT_OF_COMMENT);

  const {data:meData} = useMe();

  const onPressCreateCommentOfComment = async(payload:string) => {
    await createCommentOfComment({
      variables:{
        commentId,
        payload,
      },
      update: (cache,mutationResult) => {
        if(mutationResult.data.createCommentOfComment.ok){

          // 댓글 개수 변경
          cache.modify({
            id:idForCacheAndEdit,
            fields:{
              totalCommentOfComments(prev){
                return prev+1;
              },
            },
          });

          const readCache = data?.seeCommentOfComments;
          const hasNextPage = readCache?.hasNextPage;
          const cursorId = readCache?.cursorId;

          // 이전 캐시 데이터는 있어. 근데 걔의 갯수랑 총 댓글 갯수가 안맞을 때도 가져와
          if(hasNextPage === true) {
            // 이전에 안불러온 댓글이 있으면 fetchMore. await 는 굳이 안함
            // data 가 5배수인 경우에 hasNextPage 가 true 일 수 있지만 걍 이렇게 함.
            // 근데 만약에 대댓글이 100개 이러면. 끝에 몇개만 받거나 해야함. 이건 아직 구현x

            // 왜 두번 받는거지? 그것도 isGetAllCommentOfComments:true isGetAllCommentOfComments:false 로 받아서 결국 5개 이상은 안나와
            fetchMore({
              variables:{
                cursorId,
                // 끝까지 다받음. 여기서 isGetAllCommentOfComments 쓸라면 useLazyQuery 의 variables 에도 넣어줘야 함.
                isGetAllCommentOfComments:true,
              },
            });
          } else if(readCache === undefined) {
            // 끝까지 다받음.
            seeCommentOfComments({
              variables:{
                commentId,
                isGetAllCommentOfComments:true,
              }}
            );
          } else {
            
            const numberNow = new Date().getTime();
            const now = numberNow+"";
            const __typename:"CommentOfComment" = "CommentOfComment";
            
            const newCommentOfComment = {
              __typename,
              id: mutationResult.data.createCommentOfComment.id,
              user: meData.me,
              payload,
              createdAt: now,
              isMine: true,
              totalLikes: 0,
              isLiked: false,
            };

            updateSeeCommentOfCommentsQuery({
              action: "createCommentOfComment",
              commentOfCommentId: mutationResult.data.createCommentOfComment.id,
              newCacheData: newCommentOfComment,
            });
  
          }
        }
      },
    });
  };



  // infinite scroll, 얘는 더보기 누를때 실행
  const fetchMoreFn = async() => {
    await fetchMore({
      variables:{
        cursorId:data.seeCommentOfComments.cursorId,
      },
    });
  };

  const onPressSeeMoreCommentOfComments = async() => {
    await cursorPaginationFetchMore(data?.seeCommentOfComments,fetchMoreFn);
  };


  // 대댓글 가져오기 버튼. 대댓글 없으면 안나옴.
  const IfCommentOfCommentsExistThenShowSeeMoreButton = () => {
    if(comment.totalCommentOfComments !== 0 && !data){
      return (
        <SeeMoreComments onPress={onPressSeeMoreComments}>
          <SeeMoreCommentsText>댓글 보기</SeeMoreCommentsText>
        </SeeMoreComments>
      );
    } else {
      return null;
    }
  };

  // Notification 으로 들어왔을 시 전체 대댓글 보여주기 버튼
  const ShowAllCommentBtn = () => {
    if(!data){
      return (
        <SeeAllComments onPress={onPressSeeMoreComments}>
          <SeeMoreCommentsText>전체 댓글 보기</SeeMoreCommentsText>
        </SeeAllComments>
      );
    }
  };
  
  // 대댓글 fetchMore 버튼, 다음 없으면 안나옴, 댓글 하나 수정중이면 다른거 수정 못함.
  const IfUserPressGettingCommentOfCommentsThenShowThemNeedIsNowSomethingEditingAndSetFnBecauseEditOnlyOne = () => {
    return (
      <>
        {data?.seeCommentOfComments.commentOfComments?.map(mention => <SingleCommentOfCommentLayout
          key={mention.id}
          mention={mention}
          nowEditingIndex={nowEditingIndex}
          setNowEditingIndex={setNowEditingIndex}
          updateSeeCommentOfCommentsQuery={updateSeeCommentOfCommentsQuery}
          setUserWhichWriting={setUserWhichWriting}
          commentId={commentId}
        />)}
        {data?.seeCommentOfComments.hasNextPage && (
          <SeeMoreCommentOfComments onPress={onPressSeeMoreCommentOfComments}>
            <SeeMoreCommentOfCommentsText>댓글 더보기</SeeMoreCommentOfCommentsText>
          </SeeMoreCommentOfComments>
        )}
      </>
    );
  };

  
  // 댓글 수정 중이란 뜻
  const isCommentEdit = nowEditingIndex === idForCacheAndEdit;

  const [editPayload,setEditPayload] = useState(comment.payload);



  const [editComment] = useMutation<editComment,editCommentVariables>(EDIT_COMMENT,{
    variables:{
      id:commentId,
      payload:editPayload,
    },
    update:(cache,result)=>{
      const ok = result.data.editComment.ok;
      if(ok) {
        cache.modify({
          id: idForCacheAndEdit,
          fields: {
            payload:() => editPayload
          }
        });

        updateSeeCommentsQuery((prev)=>{
          const {seeComments:{ comments:prevComments, isNotFetchMore, ...prevRest }} = prev;

          const newComments = prevComments.map(comment => {
            if(comment.id === commentId) {
              const newComment = {...comment};
              newComment.payload = editPayload;
              return newComment;
            } else {
              return {...comment};
            }
          });

          const updateResult = {
            seeComments: {
              comments:newComments,
              isNotFetchMore:true,
              ...prevRest,
            }
          };

          return updateResult;
        });
      }
    }
  });
  
  const [deleteComment] = useMutation<deleteComment,deleteCommentVariables>(DELETE_COMMENT,{
    variables:{
      id:commentId,
    },
    update:(cache,result)=>{
      const ok = result.data.deleteComment.ok;
      if(ok) {

        updateSeeCommentsQuery((prev)=>{
          const {seeComments:{ comments:prevComments, isNotFetchMore, ...prevRest }} = prev;

          const newComments = prevComments.filter(comment => comment.id !== commentId);

          const updateResult = {
            seeComments: {
              comments:newComments,
              isNotFetchMore:true,
              ...prevRest,
            }
          };

          return updateResult;
        });
      }
    }
  });

  const user = comment.user;
  const userId = user.id;
  const userName = user.userName;
  const avatar = user.avatar;
  const payload = comment.payload;
  const totalCommentOfComments = comment.totalCommentOfComments;
  const isLiked = comment.isLiked;
  const totalLikes = comment.totalLikes;
  const isMine = comment.isMine;
  const createAt = comment.createdAt;

  const passedTime = getPassedTime(createAt);

  const navigation = useNavigation<CommentsNavProps["navigation"]>();
  const onPressUserInfo = () => {
    navigation.navigate("Profile",{id:userId,userName});
  };

  // 컴포넌트 안에 만드는게 성능상 안좋지 않을라나?
  const EditBtn = () => (
    <EditBtnIfCommentOwner
      id={idForCacheAndEdit}
      isMine={isMine}
      nowEditingIndex={nowEditingIndex}
      setNowEditingIndex={setNowEditingIndex}
      editMutation={editComment}
      deleteMutation={deleteComment}
      setUserWhichWriting={setUserWhichWriting}
    />
  );

  return (
    notifiedCommentOfComment ?
      <>
        <FlexRowContainerWithMargin>
          <AvatarContainer
            avatar={avatar}
            onPressAvatar={onPressUserInfo}
          />
          
          <ContentContainer>
            {isCommentEdit ?
              <EditComment
                value={editPayload}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text)=>setEditPayload(text)}
                multiline={true}
              />
            :
              <UserNameAndPayloadContainer
                onPressUserName={onPressUserInfo}
                userName={userName}
                payload={payload}
              />
            }

            <UserActionContainer>
              <LikesAndCommentsAndSeeMoreCommentContainer
                onPressLike={onPressLikes}
                isLiked={isLiked}
                totalLikes={totalLikes}
                totalCommentOfComments={totalCommentOfComments}
                passedTime={passedTime}
              >
                {/* noti 로 들어온 애는 댓글 보기가 여기 없고 밑에 있음 */}
                {/* {IfCommentOfCommentsExistThenShowSeeMoreButton()} */}
              </LikesAndCommentsAndSeeMoreCommentContainer>
            </UserActionContainer>
            
          </ContentContainer>
          <EditBtn />
        </FlexRowContainerWithMargin>

        <BottomContainer>
          {/* 전체 댓글 불러오면 알림 댓글은 안보이게 */}
          {!data && <SingleCommentOfCommentLayout
            mention={notifiedCommentOfComment}
            nowEditingIndex={nowEditingIndex}
            setNowEditingIndex={setNowEditingIndex}
            updateSeeCommentOfCommentsQuery={updateSeeCommentOfCommentsQuery}
            setUserWhichWriting={setUserWhichWriting}commentId={commentId}
          />}
          {/* 댓글 목록 */}
          {IfUserPressGettingCommentOfCommentsThenShowThemNeedIsNowSomethingEditingAndSetFnBecauseEditOnlyOne()}
          <CreateCommentOfCommentContainer
            onPressCreateCommentOfComment={onPressCreateCommentOfComment}
            userWhichWriting={userWhichWriting}
            setUserWhichWriting={setUserWhichWriting}
            userName={userName}
          />
          {/* 전체 댓글보기 버튼 */}
          {ShowAllCommentBtn()}
        </BottomContainer>
      </>
    :
      // View 말고 <> 로 쓰면 inverted 했을 때 순서가 바뀜.
      <View>
        <FlexRowContainerWithMargin>
          <AvatarContainer
            avatar={avatar}
            onPressAvatar={onPressUserInfo}
          />
          
          <ContentContainer>
            {isCommentEdit ?
              <EditComment
                value={editPayload}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text)=>setEditPayload(text)}
                multiline={true}
              />
            :
              <UserNameAndPayloadContainer
                onPressUserName={onPressUserInfo}
                userName={userName}
                payload={payload}
              />
            }

            <UserActionContainer>
              <LikesAndCommentsAndSeeMoreCommentContainer
                onPressLike={onPressLikes}
                isLiked={isLiked}
                totalLikes={totalLikes}
                totalCommentOfComments={totalCommentOfComments}
                passedTime={passedTime}
              >
                {IfCommentOfCommentsExistThenShowSeeMoreButton()}
              </LikesAndCommentsAndSeeMoreCommentContainer>
            </UserActionContainer>
            
          </ContentContainer>
          <EditBtn />
        </FlexRowContainerWithMargin>


        <BottomContainer>
          <CreateCommentOfCommentContainer
            onPressCreateCommentOfComment={onPressCreateCommentOfComment}
            userWhichWriting={userWhichWriting}
            setUserWhichWriting={setUserWhichWriting}
            userName={userName}
          />
          {IfUserPressGettingCommentOfCommentsThenShowThemNeedIsNowSomethingEditingAndSetFnBecauseEditOnlyOne()}
        </BottomContainer>


      </View>
  );
};

export default SingleCommentLayout;
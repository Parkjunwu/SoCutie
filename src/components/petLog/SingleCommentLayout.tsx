import React from "react";
import styled from "styled-components/native";
import { gql, LazyQueryResult, QueryLazyOptions, useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FlexRowContainer from "../comment/commonStyledComponent/FlexRowContainer";
import cursorPaginationFetchMore from "../../logic/cursorPaginationFetchMore";
import { seePetLogComments, seePetLogCommentsVariables, seePetLogComments_seePetLogComments } from "../../__generated__/seePetLogComments";
import { seePetLogCommentOfComments, seePetLogCommentOfCommentsVariables } from "../../__generated__/seePetLogCommentOfComments";
import { togglePetLogCommentLike, togglePetLogCommentLikeVariables } from "../../__generated__/togglePetLogCommentLike";
import { createPetLogCommentOfComment, createPetLogCommentOfCommentVariables } from "../../__generated__/createPetLogCommentOfComment";
import useMe from "../../hooks/useMe";
import { editPetLogComment, editPetLogCommentVariables } from "../../__generated__/editPetLogComment";
import { deletePetLogComment, deletePetLogCommentVariables } from "../../__generated__/deletePetLogComment";
import getPassedTime from "../../logic/getPassedTime";
import { CommentsNavProps } from "../../types/comment";
import EditBtnIfCommentOwner from "../comment/layoutComponent/EditBtnIfCommentOwner";
import AvatarContainer from "../comment/commonStyledComponent/AvatarContainer";
import UserNameAndPayloadContainer from "../comment/commonStyledComponent/UserNameAndPayloadContainer";
import { LikesAndCommentsAndSeeMoreCommentContainer } from "../comment/layoutComponent/PayloadAndLikesContainer";
import CreateCommentOfCommentContainer from "../comment/layoutComponent/CreateCommentOfCommentContainer";
import SingleCommentOfCommentLayout from "./SingleCommentOfCommentLayout";
import SEE_PETLOG_COMMENT_OF_COMMENTS from "./gql/seePetLogCommentOfComments";
import { UpdateSeePetLogCommentOfCommentsQueryType, UpdateSeePetLogCommentsQueryType } from "./type/updateQueryType";

const ContentContainer = styled.View`
  flex: 1;
`;
const UserActionContainer = styled.View`
  margin-top: 3px;
  margin-left: 10px;
`;

const TOGGLE_PETLOG_COMMENT_LIKE = gql`
  mutation togglePetLogCommentLike ($id:Int!) {
    togglePetLogCommentLike (id:$id) {
      ok
      error
    }
  }
`;

const CREATE_PETLOG_COMMENT_OF_COMMENT = gql`
  mutation createPetLogCommentOfComment (
    $payload:String!,
    $petLogCommentId:Int!
  ) {
    createPetLogCommentOfComment (
      payload:$payload,
      petLogCommentId:$petLogCommentId
    ) {
      ok
      error
      id
    }
  }
`;

const EDIT_PETLOG_COMMENT = gql`
  mutation editPetLogComment(
    $id:Int!,
    $payload:String!
  ) {
    editPetLogComment(
      id:$id,
      payload:$payload
    ) {
      ok
      error
    }
  }
`;

const DELETE_PETLOG_COMMENT = gql`
  mutation deletePetLogComment($id:Int!) {
    deletePetLogComment(id:$id) {
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

type LogInSingleCommentProps = {
  comment:seePetLogComments_seePetLogComments;
  notifiedCommentOfComment?:any; // 몰라
  nowEditingIndex: string,
  setNowEditingIndex: React.Dispatch<React.SetStateAction<string>>,
  updateSeePetLogCommentsQuery:(props:UpdateSeePetLogCommentsQueryType) => void;
  userWhichWriting: string | {userName:string},
  setUserWhichWriting: React.Dispatch<React.SetStateAction<string|{userName:string}>>,
  petLogId:number;
  seePetLogComments:(options?: QueryLazyOptions<seePetLogCommentsVariables>) => Promise<LazyQueryResult<seePetLogComments, seePetLogCommentsVariables>>
}

const SingleCommentLayout = ({comment,notifiedCommentOfComment,nowEditingIndex,setNowEditingIndex,updateSeePetLogCommentsQuery,userWhichWriting,setUserWhichWriting,petLogId,seePetLogComments}:LogInSingleCommentProps) => {

  // const commentId = comment.id;
  const petLogCommentId = comment.id;
  const idForCacheAndEdit = `PetLogComment:${comment.id}`;
  
  // 로그인 유저냐에 따라 좋아요 클릭 시 알림, 댓글 작성 아예 바꾸기 댓글을 작성하시려면 로그인 하셔야 합니다. 내 댓글일 경우 오른쪽 끝에 점점점 세개 붙여서 수정 삭제
  const [
    seePetLogCommentOfComments,
    {
      data,
      loading,
      // refetch,
      fetchMore,
      // updateQuery:updateSeePetLogCommentOfCommentsQuery
      updateQuery
    }
  ] = useLazyQuery<seePetLogCommentOfComments,seePetLogCommentOfCommentsVariables>(SEE_PETLOG_COMMENT_OF_COMMENTS,{
    variables:{
      petLogCommentId,
    },
    // network-only 하니까 두번 이상 받으면 뭐가 자꾸 이상해짐.
    // network-only 안해도 서버에서 받네? 뭐지?
    // fetchPolicy:"network-only"
  });

  // seePetLogCommentOfComments 캐시 변경 로직. 겹치는게 많은데 하나하나 너무 길어서 몰아 놓음
  // const updateSeePetLogCommentOfCommentsQuery = makeUpdateSeePetLogCommentOfCommentsQuery(updateQuery);
  const updateSeePetLogCommentOfCommentsQuery = ({action,petLogCommentOfCommentId,editPayload,newCacheData}:UpdateSeePetLogCommentOfCommentsQueryType) => {

    updateQuery((prev)=>{

      if(action === 'createCommentOfComment') {

        // const __typename:"SeePetLogCommentOfCommentsResponse" = "SeePetLogCommentOfCommentsResponse";
        // const hasNextPage = prevCommentNumber === 0 ? false : true;
        // const now = numberNow +"";

        // const newSeeCommentOfComments = {
        //   seePetLogCommentOfComments: {
        //     __typename,
        //     commentOfComments:[newCacheData],
        //     cursorId: petLogCommentOfCommentId,
        //     error: null,
        //     hasNextPage: false,
        //     isNotFetchMore: null,
        //     // fetchedTime: now,
        //   },
        // };

        // // 이전 댓글이 없으면 기존 캐시가 없어. 그런 경우 새로 생성
        // if(prev.seePetLogCommentOfComments === undefined ) {
        //   return newSeeCommentOfComments;
        // }

        const {
          seePetLogCommentOfComments:{
            commentOfComments: prevCommentOfComments,
            isNotFetchMore,
            ...prevRest
          }
        } = prev;
        // commentOfComments:prevCommentOfComments, isNotFetchMore, fetchedTime, ...prevRest }} = prev;

        // 기존의 캐시가 너무 오래 지났으면 이전 캐시 안받고 새로 생성
        // 이게 뭐지? refetch 해야 되는거 아닌가?
        // const passedByTime = numberNow - Number(fetchedTime);
        // // 5분 이상 지남.
        // if ( passedByTime > 60000*5 ) {
        //   return newSeeCommentOfComments;
        // }

        // 캐시 변경
        const updateResult = {
          seePetLogCommentOfComments: {
            // commentOfComments:[newCacheData,...prevCommentOfComments],
            // 시간 역순이라 뒤에 놓음
            commentOfComments:[...prevCommentOfComments,newCacheData],
            isNotFetchMore:true,
            // fetchedTime,
            ...prevRest,
          }
        };

        return updateResult;
      };

      // 그외
      const {seePetLogCommentOfComments:{ commentOfComments:prevCommentOfComments, isNotFetchMore, ...prevRest }} = prev;

      let newCommentOfComments;

      switch(action) {
          
        case 'editCommentOfComment':  // 댓글 변경
          newCommentOfComments = prevCommentOfComments.map(commentOfComment => {
            if(commentOfComment.id === petLogCommentOfCommentId) {
              const newCommentOfComment = {...commentOfComment};
              newCommentOfComment.payload = editPayload;
              return newCommentOfComment;
            } else {
              return {...commentOfComment};
            }
          });
          break;

        case 'deleteCommentOfComment': // 댓글 삭제
          newCommentOfComments = prevCommentOfComments.filter(commentOfComment => commentOfComment.id !== petLogCommentOfCommentId);
          break;

        // default:
        //   break;
      }

      const updateResult = {
        seePetLogCommentOfComments: {
          commentOfComments:newCommentOfComments,
          isNotFetchMore:true,
          ...prevRest,
        }
      };

      return updateResult;
    });
  };

  const onPressSeeMoreComments = async() => {
    if(loading) return;
    await seePetLogCommentOfComments();
  };
  
  const [commentLikeMutation] = useMutation<togglePetLogCommentLike,togglePetLogCommentLikeVariables>(TOGGLE_PETLOG_COMMENT_LIKE);
  const onPressLikes = async() => {
    const result = await commentLikeMutation({
      variables:{
        id:petLogCommentId
      },
      update: (cache,result) => {
        const ok = result.data?.togglePetLogCommentLike.ok;
        if(ok) {
          cache.modify({
            id: idForCacheAndEdit,
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

  const [createPetLogCommentOfComment] = useMutation<createPetLogCommentOfComment,createPetLogCommentOfCommentVariables>(CREATE_PETLOG_COMMENT_OF_COMMENT);

  const {data:meData} = useMe();

  const onPressCreateCommentOfComment = async(payload:string) => {
    await createPetLogCommentOfComment({
      variables:{
        petLogCommentId,
        payload,
      },
      update: (cache,mutationResult) => {
        if(mutationResult.data.createPetLogCommentOfComment.ok){
          // 지금은 캐시 변경인데 그전 seePetLogCommentOfComments 캐시가 5분 이상 됐으면 삭제함.

          // 대댓글 갯수 변경
          updateSeePetLogCommentsQuery({
            action: "createCommentOfComment",
            petLogCommentId: petLogCommentId,
          });

          const readCache = data?.seePetLogCommentOfComments;
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
            seePetLogCommentOfComments({
              variables:{
                petLogCommentId,
                isGetAllCommentOfComments:true,
              }}
            );
          } else {

            const numberNow = new Date().getTime();
            const now = numberNow+"";
            const __typename:"PetLogCommentOfComment" = "PetLogCommentOfComment";
            
            const newCommentOfComment = {
              __typename,
              id: mutationResult.data.createPetLogCommentOfComment.id,
              user: meData.me,
              payload,
              createdAt: now,
              isMine: true,
              totalLikes: 0,
              isLiked: false,
            };

            // 마지막 댓글까지 불러온 상태면 캐시 넣음
            // 대댓글 캐시에 넣음
            updateSeePetLogCommentOfCommentsQuery({
              action: "createCommentOfComment",
              petLogCommentOfCommentId: mutationResult.data.createPetLogCommentOfComment.id,
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
        cursorId:data.seePetLogCommentOfComments.cursorId,
      },
    });
  };

  const onPressSeeMoreCommentOfComments = async() => {
    await cursorPaginationFetchMore(data?.seePetLogCommentOfComments,fetchMoreFn);
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
        {data?.seePetLogCommentOfComments.commentOfComments?.map(mention => <SingleCommentOfCommentLayout
          key={mention.id}
          mention={mention}
          nowEditingIndex={nowEditingIndex}
          setNowEditingIndex={setNowEditingIndex}
          updateSeePetLogCommentOfCommentsQuery={updateSeePetLogCommentOfCommentsQuery}
          setUserWhichWriting={setUserWhichWriting}
          updateSeePetLogCommentsQuery={updateSeePetLogCommentsQuery}
          petLogCommentId={petLogCommentId}
        />)}
        {data?.seePetLogCommentOfComments.hasNextPage && (
          <SeeMoreCommentOfComments onPress={onPressSeeMoreCommentOfComments}>
            <SeeMoreCommentOfCommentsText>댓글 더보기</SeeMoreCommentOfCommentsText>
          </SeeMoreCommentOfComments>
        )}
      </>
      )
  };

  
  // 댓글 수정 중이란 뜻
  const isCommentEdit = nowEditingIndex === idForCacheAndEdit;

  const [editPayload,setEditPayload] = useState(comment.payload);



  const [editPetLogComment] = useMutation<editPetLogComment,editPetLogCommentVariables>(EDIT_PETLOG_COMMENT,{
    variables:{
      id:petLogCommentId,
      payload:editPayload,
    },
    update:(cache,result)=>{
      const ok = result.data.editPetLogComment.ok;
      if(ok) {
        cache.modify({
          id: idForCacheAndEdit,
          fields: {
            payload:() => editPayload
          }
        });

        // 대댓글 캐시 변경
        updateSeePetLogCommentsQuery({
          action: "editComment",
          petLogCommentId: petLogCommentId,
          editPayload,
        });
      }
    },
  });
  
  const [deletePetLogComment] = useMutation<deletePetLogComment,deletePetLogCommentVariables>(DELETE_PETLOG_COMMENT,{
    variables:{
      id:petLogCommentId,
    },
    update:(cache,result)=>{
      const ok = result.data.deletePetLogComment.ok;
      if(ok) {

        let nowCommentNumber:number;

        // 댓글 개수 변경
        cache.modify({
          id:`PetLog:${petLogId}`,
          fields:{
            commentNumber(prev){
              nowCommentNumber = prev-1;
              return nowCommentNumber;
            },
          },
        });

        if(nowCommentNumber%10 === 0 && nowCommentNumber !== 0){
          // 11개 21개 이러면 삭제시 댓글창이 날라가서 다시 받음
          seePetLogComments({
            variables:{
              petLogId,
              offset: nowCommentNumber-10,
            }
          })
        } else {
          // 대댓글 제거
          updateSeePetLogCommentsQuery({
            action:"deleteComment",
            petLogCommentId:petLogCommentId
          });
        }
      }
    },
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
    navigation.navigate("Profile",{id:userId,userName})
  };

  // 컴포넌트 안에 만드는게 성능상 안좋지 않을라나?
  const EditBtn = () => (
    <EditBtnIfCommentOwner
      id={idForCacheAndEdit}
      isMine={isMine}
      nowEditingIndex={nowEditingIndex}
      setNowEditingIndex={setNowEditingIndex}
      editMutation={editPetLogComment}
      deleteMutation={deletePetLogComment}
      setUserWhichWriting={setUserWhichWriting}
    />
  );

  return (
    notifiedCommentOfComment ?
      <>
        <FlexRowContainer>
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
        </FlexRowContainer>

        <BottomContainer>
          {/* 전체 댓글 불러오면 알림 댓글은 안보이게 */}
          {!data && <SingleCommentOfCommentLayout
            mention={notifiedCommentOfComment}
            nowEditingIndex={nowEditingIndex}
            setNowEditingIndex={setNowEditingIndex}
            updateSeePetLogCommentOfCommentsQuery={updateSeePetLogCommentOfCommentsQuery}
            setUserWhichWriting={setUserWhichWriting}
            updateSeePetLogCommentsQuery={updateSeePetLogCommentsQuery}
            petLogCommentId={petLogCommentId}
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
      <>
        <FlexRowContainer>
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
        </FlexRowContainer>
        <BottomContainer>
          <CreateCommentOfCommentContainer
            onPressCreateCommentOfComment={onPressCreateCommentOfComment}
            userWhichWriting={userWhichWriting}
            setUserWhichWriting={setUserWhichWriting}
            userName={userName}
          />
          {IfUserPressGettingCommentOfCommentsThenShowThemNeedIsNowSomethingEditingAndSetFnBecauseEditOnlyOne()}
        </BottomContainer>
      </>
  );
};

export default SingleCommentLayout;
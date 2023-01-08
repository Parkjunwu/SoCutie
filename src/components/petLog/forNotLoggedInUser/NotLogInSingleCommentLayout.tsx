import React from "react";
import styled from "styled-components/native";
import { useLazyQuery } from "@apollo/client";
import { Alert } from "react-native";
import cursorPaginationFetchMore from "../../../logic/cursorPaginationFetchMore";
import { useNavigation } from "@react-navigation/native";
import { CommentsNavProps } from "../../../types/comment";
import getPassedTime from "../../../logic/getPassedTime";
import FlexRowContainer from "../../comment/commonStyledComponent/FlexRowContainer";
import { seePetLogCommentOfComments, seePetLogCommentOfCommentsVariables } from "../../../__generated__/seePetLogCommentOfComments";
import SEE_PETLOG_COMMENT_OF_COMMENTS from "../gql/seePetLogCommentOfComments";
import { seePetLogComments_seePetLogComments } from "../../../__generated__/seePetLogComments";
import AvatarContainer from "../../comment/commonStyledComponent/AvatarContainer";
import UserNameAndPayloadContainer from "../../comment/commonStyledComponent/UserNameAndPayloadContainer";
import UserActionContainer from "../../comment/commonStyledComponent/UserActionContainer";
import { LikesAndCommentsAndSeeMoreCommentContainer } from "../../comment/layoutComponent/PayloadAndLikesContainer";
import NotLogInSingleCommentOfCommentLayout from "./NotLogInSingleCommentOfCommentLayout";

// const FlexRowContainerWithMargin = styled(FlexRowContainer)`
//   margin: 2px 10px 3px 10px;
// `;
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
const BottomContainer = styled.View``;
const ContentContainer = styled.View``;
const RightEmptyContainer = styled.View`
  width: 30px;
`;

const NotLogInSingleCommentLayout = ({comment}:{comment:seePetLogComments_seePetLogComments}) => {

  const petLogCommentId = comment.id;
  
  // 로그인 유저냐에 따라 좋아요 클릭 시 알림, 댓글 작성 아예 바꾸기 댓글을 작성하시려면 로그인 하셔야 합니다. 내 댓글일 경우 오른쪽 끝에 점점점 세개 붙여서 수정 삭제
  const [
    seePetLogCommentOfComments,
    {
      data,
      loading,
      fetchMore,
    }
  ] = useLazyQuery<seePetLogCommentOfComments,seePetLogCommentOfCommentsVariables>(SEE_PETLOG_COMMENT_OF_COMMENTS,{
    variables:{
      petLogCommentId,
      // ...(cursorId && { cursorId })
    }
  });

  const onPressSeeMoreComments = async() => {
    if(loading) return;
    // await refetch();
    await seePetLogCommentOfComments();
  };

  const onPressLikes = async() => {
    Alert.alert("로그인 후 이용 가능합니다.",null,[{
      text:"확인"
    }])
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
  const IfCommentOfCommentsExistThenShowButton = () => {
    if(comment.totalCommentOfComments !== 0 && !data){
      return (
        <SeeMoreComments onPress={onPressSeeMoreComments}>
          <SeeMoreCommentsText>댓글 보기</SeeMoreCommentsText>
        </SeeMoreComments>
      );
    }
  };

  // 대댓글 fetchMore 버튼, 다음 없으면 안나옴, 댓글 하나 수정중이면 다른거 수정 못함.
  const IfUserPressGettingCommentOfCommentsThenShowThemNeedIsNowSomethingEditingAndSetFnBecauseEditOnlyOne = () => {
    return (
      <>
        {data?.seePetLogCommentOfComments.commentOfComments?.map(mention => <NotLogInSingleCommentOfCommentLayout
          key={mention.id}
          mention={mention}
        />)}
        {data?.seePetLogCommentOfComments.hasNextPage && (
          <SeeMoreCommentOfComments onPress={onPressSeeMoreCommentOfComments}>
            <SeeMoreCommentOfCommentsText>댓글 더보기</SeeMoreCommentOfCommentsText>
          </SeeMoreCommentOfComments>
        )}
      </>
      )
  };

  const user = comment.user;
  const userId = user.id
  const userName = user.userName;
  const avatar = user.avatar;
  const payload = comment.payload;
  const totalCommentOfComments = comment.totalCommentOfComments;
  const totalLikes = comment.totalLikes;
  const createAt = comment.createdAt;

  const passedTime = getPassedTime(createAt);

  const navigation = useNavigation<CommentsNavProps["navigation"]>();

  const onPressUserInfo = () => {
    navigation.navigate("Profile",{id:userId,userName})
  };
  


  return (
    <>
      <FlexRowContainer>
        <AvatarContainer
          avatar={avatar}
          onPressAvatar={onPressUserInfo}
        />
        
        <ContentContainer>
          <UserNameAndPayloadContainer
            onPressUserName={onPressUserInfo}
            userName={userName}
            payload={payload}
          />

          <UserActionContainer>
            <LikesAndCommentsAndSeeMoreCommentContainer
              onPressLike={onPressLikes}
              isLiked={false}
              totalLikes={totalLikes}
              totalCommentOfComments={totalCommentOfComments}
              passedTime={passedTime}
            >
              {IfCommentOfCommentsExistThenShowButton()}
            </LikesAndCommentsAndSeeMoreCommentContainer>
          </UserActionContainer>
          
        </ContentContainer>
        <RightEmptyContainer />
      </FlexRowContainer>
      
      <BottomContainer>
        {IfUserPressGettingCommentOfCommentsThenShowThemNeedIsNowSomethingEditingAndSetFnBecauseEditOnlyOne()}
      </BottomContainer>
    </>
  );
};

export default NotLogInSingleCommentLayout;
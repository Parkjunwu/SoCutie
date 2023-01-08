import styled from "styled-components/native";
import useIsDarkMode from "../../hooks/useIsDarkMode";
import { isLoggedInVar } from "../../apollo";
import { gql, useLazyQuery } from "@apollo/client";
import logInUserThing from "../comment/logInUser/logInUserThing";
import { useEffect, useState } from "react";
import { seePetLogComments, seePetLogCommentsVariables } from "../../__generated__/seePetLogComments";
import SEE_PETLOG_COMMENTS from "../../gql/seePetLogComments";
import CreateComment from "../petLog/CreateComment";
import { makeUpdateSeePetLogCommentsQuery } from "../petLog/logic/makeUpdateSeePetLogCommentsQuery";
import { getNotifiedPetLogComment, getNotifiedPetLogCommentVariables } from "../../__generated__/getNotifiedPetLogComment";
import { getNotifiedPetLogCommentOfComment, getNotifiedPetLogCommentOfCommentVariables } from "../../__generated__/getNotifiedPetLogCommentOfComment";
import UserAndInfoContainer from "../petLog/petLogFooterComponent/UserAndInfoContainer";
import CommentListContainer from "../petLog/petLogFooterComponent/CommentContainer";
import CreateCommentNotLoggedIn from "../petLog/forNotLoggedInUser/CreateCommentNotLoggedIn";
import makeBundleIndexPressable from "../petLog/petLogFooterComponent/bundleIndexPressable";
import { Alert } from "react-native";

const GET_NOTIFIED_PETLOG_COMMENT = gql`
  query getNotifiedPetLogComment(
    $petLogCommentId:Int!,
    $petLogId:Int!
  ) {
    getNotifiedPetLogComment(
      petLogCommentId:$petLogCommentId,
      petLogId:$petLogId
    ) {
      offset
      totalComments
      error
    }
  }
`;

const GET_NOTIFIED_PETLOG_COMMENT_OF_COMMENT = gql`
  query getNotifiedPetLogCommentOfComment(
    $petLogCommentOfCommentId:Int!
  ) {
    getNotifiedPetLogCommentOfComment(
      petLogCommentOfCommentId:$petLogCommentOfCommentId
    ) {
      petLogCommentOfComment {
        id
        user {
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
      error
    }
  }
`;

const Container = styled.View<{isDarkMode:boolean}>`
  margin-top: 10px;
  border-top-color: rgba(100,100,100,0.4);
  border-top-width: ${props=>props.isDarkMode ? "0px" : "1px"};
  padding: 15px 10px 20px 10px;
`;
const CommentContainer = styled.View`
  margin-top: 12px;
`;

type PushNotificationPetLogFooterComponentProps = {
  id: number;
  // userId: number;
  user: {
    id: number,
    userName: string,
    avatar: string,
  };
  isLiked: boolean;
  likes: number;
  commentNumber: number;
  petLogId:number;
  commentId: number;
  commentOfCommentId?: number;
};

const PushNotificationPetLogFooterComponent = ({
  id,
  isLiked,
  likes,
  commentNumber,
  user,
  petLogId,
  commentId,
  commentOfCommentId,
}:PushNotificationPetLogFooterComponentProps) => {

  const [getNotifiedPetLogCommentOfComment,{data:getNotifiedPetLogCommentOfCommentData,}] = useLazyQuery<getNotifiedPetLogCommentOfComment,getNotifiedPetLogCommentOfCommentVariables>(GET_NOTIFIED_PETLOG_COMMENT_OF_COMMENT,{
    variables:{
      petLogCommentOfCommentId:commentOfCommentId,
    },
  });

  useEffect(()=>{
    if(getNotifiedPetLogCommentOfCommentData?.getNotifiedPetLogCommentOfComment.error) {
      // 에러 시 화면에 띄움
      Alert.alert(getNotifiedPetLogCommentOfCommentData.getNotifiedPetLogCommentOfComment.error)
    }
  },[getNotifiedPetLogCommentOfCommentData])

  const [seePetLogComments,{data,refetch:seePetLogCommentsRefetch,updateQuery}] = useLazyQuery<seePetLogComments,seePetLogCommentsVariables>(SEE_PETLOG_COMMENTS);

  const [getNotifiedPetLogComment,{data:getNotifiedPetLogCommentData,}] = useLazyQuery<getNotifiedPetLogComment,getNotifiedPetLogCommentVariables>(GET_NOTIFIED_PETLOG_COMMENT, {
    fetchPolicy:"network-only",
    onCompleted: async(data) => {
      const getData = data.getNotifiedPetLogComment;
      const error = getData.error;
      console.log(getData)
      // 에러 시 화면에 띄움
      if(error) {
        Alert.alert(error);
      } else {
        
        const offset = getData.offset;
        const bundleIndex = Math.floor(offset/10) + 1;
        setNowCommentsBundleNumber(bundleIndex)
        
        await seePetLogComments({
          variables:{
            petLogId,
            offset,
          },
        });

        if(commentOfCommentId) {
          await getNotifiedPetLogCommentOfComment();
        }
      }
    },
  });

  // console.log("getNotifiedPetLogCommentData")
  // console.log(getNotifiedPetLogCommentData)
  // console.log("petLogId")
  // console.log(petLogId)
  // console.log("commentId")
  // console.log(commentId)
  // console.log("getNotifiedPetLogCommentOfCommentData?.getNotifiedPetLogCommentOfComment")
  // console.log(getNotifiedPetLogCommentOfCommentData?.getNotifiedPetLogCommentOfComment.petLogCommentOfComment)

  // 게시물 보기 하면 얘가 날라감.. props 바뀌면서 다른 컴포넌트 되는건가? 우째하지?
  useEffect(()=>{
    if(commentId) {
      getNotifiedPetLogComment({
        variables:{
          petLogCommentId: commentId,
          petLogId,
        },
      });
    }
  },[commentId]);


  const isDarkMode = useIsDarkMode();

  const updateSeePetLogCommentsQuery = makeUpdateSeePetLogCommentsQuery(updateQuery);

  // CommentForLogInUser 보고 댓글 작성 거의 만드는 중.
  // 대댓글 작성 / 댓글 수정일 때 Comment 의 댓글 작성 뷰 안보이도록
  const [userWhichWriting,setUserWhichWriting] = useState<string|{userName:string}>("comment");
  
  const { placeholder, disabled } = logInUserThing(userWhichWriting);

  const [nowEditingIndex,setNowEditingIndex] = useState("");

  const isLoggedIn = isLoggedInVar();

  const [nowCommentsBundleNumber,setNowCommentsBundleNumber] = useState(1);

  const take = 10;

  // await 안써도 될듯
  const onPressBundleNumber = (bundleNumber:number) => {
    if(nowCommentsBundleNumber !== bundleNumber){
      setNowCommentsBundleNumber(bundleNumber);
      // refetch 말고 seePetLogComments 를 쓸라니까 뭐가 이상함.
      seePetLogCommentsRefetch({
        petLogId,
        offset: (bundleNumber-1) * take,
      });
    }
  };

  
  const bundleIndexPressable = () => { 
    return makeBundleIndexPressable(
      getNotifiedPetLogCommentData?.getNotifiedPetLogComment.totalComments,
      onPressBundleNumber,
      nowCommentsBundleNumber
    );
  };

  return (
    <Container isDarkMode={isDarkMode} >

      {user && <UserAndInfoContainer
          id={id}
          isLiked={isLiked}
          likes={likes}
          commentNumber={commentNumber}
          user={user}
          isDarkMode={isDarkMode}
        />
      }

      <CommentContainer>
        {data?.seePetLogComments && <CommentListContainer
          dataDotSeePetLogComments={data.seePetLogComments}
          isLoggedIn={isLoggedIn}
          nowEditingIndex={nowEditingIndex}
          setNowEditingIndex={setNowEditingIndex}
          updateSeePetLogCommentsQuery={updateSeePetLogCommentsQuery}
          userWhichWriting={userWhichWriting}
          setUserWhichWriting={setUserWhichWriting}
          bundleIndexPressable={bundleIndexPressable}
          commentId={commentId}
          notifiedCommentOfComment={getNotifiedPetLogCommentOfCommentData?.getNotifiedPetLogCommentOfComment.petLogCommentOfComment}
          petLogId={petLogId}
        />}

        {isLoggedIn ?
          <CreateComment
            petLogId={petLogId}
            disabled={disabled()}
            placeholder={placeholder()}
            updateSeePetLogCommentsQuery={updateSeePetLogCommentsQuery}
            setNowCommentsBundleNumber={setNowCommentsBundleNumber}
          />
        :
          <CreateCommentNotLoggedIn />
        }
      </CommentContainer>

    </Container>
  );
};

export default PushNotificationPetLogFooterComponent;
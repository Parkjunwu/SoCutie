import styled from "styled-components/native";
import useIsDarkMode from "../../hooks/useIsDarkMode";
import { isLoggedInVar } from "../../apollo";
import { useLazyQuery } from "@apollo/client";
import logInUserThing from "../comment/logInUser/logInUserThing";
import { useEffect, useState } from "react";
import CreateComment from "./CreateComment";
import { seePetLogComments, seePetLogCommentsVariables } from "../../__generated__/seePetLogComments";
import SEE_PETLOG_COMMENTS from "../../gql/seePetLogComments";
import CreateCommentNotLoggedIn from "./forNotLoggedInUser/CreateCommentNotLoggedIn";
import { PetLogFooterComponentProps } from "./type/petLogFooterComponentProps";
import UserAndInfoContainer from "./petLogFooterComponent/UserAndInfoContainer";
import CommentListContainer from "./petLogFooterComponent/CommentContainer";
import { makeUpdateSeePetLogCommentsQuery } from "./logic/makeUpdateSeePetLogCommentsQuery";
import makeBundleIndexPressable from "./petLogFooterComponent/bundleIndexPressable";

const Container = styled.View<{isDarkMode:boolean}>`
  margin-top: 10px;
  border-top-color: rgba(100,100,100,0.4);
  border-top-width: ${props=>props.isDarkMode ? "0px" : "1px"};
  padding: 15px 10px 20px 10px;
  /* flex: 1; */
`;
const CommentContainer = styled.View`
  margin-top: 12px;
`;

const PetLogFooterComponent = (props:PetLogFooterComponentProps) => {

  const {id,isLiked,likes,commentNumber,user} = props;

  // update 를 해야하나? 안해도 될거같은데?
  const [seePetLogComments,{data,refetch,updateQuery}] = useLazyQuery<seePetLogComments,seePetLogCommentsVariables>(SEE_PETLOG_COMMENTS, {
    variables: {
      petLogId: id,
      offset: 0,
    },
  });

  const isDarkMode = useIsDarkMode();

  // 변경
  // const onPressSeeComments = async() => await refetch();
  useEffect(()=>{
    seePetLogComments();
  },[])


  // seePetLogComments 캐시 변경 로직. 겹치는게 많은데 하나하나 너무 길어서 몰아 놓음.
  // NotificationPetLog 에서도 써야 해서 함수 반환 함수로 만듦. 헷갈리면 SingleCommentLayout 에 있는거 보고 이해하도록
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
      refetch({
        petLogId: id,
        offset: (bundleNumber-1) * take,
      });
    }
  };
  
  const bundleIndexPressable = () => { 
    return makeBundleIndexPressable(
      commentNumber,
      onPressBundleNumber,
      nowCommentsBundleNumber,
      isDarkMode
    );
  };

  // console.log("data?.seePetLogComments")
  // console.log(data?.seePetLogComments.map(comment=>comment.id))

  return (
    <Container isDarkMode={isDarkMode} >

      <UserAndInfoContainer
        id={id}
        isLiked={isLiked}
        likes={likes}
        commentNumber={commentNumber}
        user={user}
        isDarkMode={isDarkMode}
      />

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
            petLogId={props.id}
            seePetLogComments={seePetLogComments}
          />
        }

        {isLoggedIn ?
          <CreateComment
            petLogId={id}
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

export default PetLogFooterComponent;
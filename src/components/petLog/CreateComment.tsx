import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { useState } from "react";
import { Alert } from "react-native";
// import SEE_PETLOG_COMMENTS from "../../gql/seePetLogComments";
// import useMe from "../../hooks/useMe";
import { isAndroid } from "../../utils";
import { createPetLogComment, createPetLogCommentVariables } from "../../__generated__/createPetLogComment";
import { CommentInput, CreateCommentBtn, CreateCommentBtnText, CreateCommentContainer } from "./CreateCommentStyledComponents";
import { UpdateSeePetLogCommentsQueryType } from "./type/updateQueryType";

const CREATE_PETLOG_COMMENT = gql`
  mutation createPetLogComment(
    $payload: String!
    $petLogId: Int!
  ) {
    createPetLogComment(
      payload: $payload
      petLogId: $petLogId
    ) {
      ok
      error
      totalCommentsNumber
      offsetComments {
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
        totalCommentOfComments
        isLiked
      }
    }
  }
`;


type CreateCommentProps = {
  petLogId: number;
  disabled: boolean;
  placeholder: string;
  // userWhichWriting: string | { userName: string };
  // setUserWhichWriting: React.Dispatch<React.SetStateAction<string | { userName: string}>>;
  updateSeePetLogCommentsQuery:(props:UpdateSeePetLogCommentsQueryType) => void;
  setNowCommentsBundleNumber:React.Dispatch<React.SetStateAction<number>>
};

const CreateComment = ({petLogId,disabled,placeholder,updateSeePetLogCommentsQuery,setNowCommentsBundleNumber}:CreateCommentProps) => {

  const [comment,setComment] = useState("");

  // const meRef = useGetMeRef();
  // const {data:meData} = useMe();
  
  const updateCreatePetLogComment:MutationUpdaterFunction<createPetLogComment, createPetLogCommentVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    const resultData = result.data.createPetLogComment;
    if(resultData.ok) {
      // 캐시변경
      // const uploadedPetLogCommentId = resultData.id;

      // let prevCommentNumber;

      // cache.modify({
      //   id:`PetLog:${petLogId}`,
      //   fields:{
      //     commentNumber(prev){
      //       prevCommentNumber = prev;
      //       return prev+1;
      //     },
      //   },
      // });

      // const newCacheData: seePetLogComments_seePetLogComments_comments = {
      //   __typename: "PetLogComment",
      //   createdAt: new Date().getTime() + "",
      //   id: uploadedPetLogCommentId,
      //   isLiked: false,
      //   isMine: true,
      //   payload: comment,
      //   user: meData.me,
      //   totalLikes: 0,
      //   totalCommentOfComments: 0,
      // };

      const totalCommentsNumber = resultData.totalCommentsNumber;

      cache.modify({
        id:`PetLog:${petLogId}`,
        fields:{
          commentNumber(){
            return resultData.totalCommentsNumber;
          },
        },
      });

      const offsetComments = resultData.offsetComments;
      const uploadedPetLogCommentId = offsetComments[offsetComments.length-1].id;

      // ref 를 직접 넣으니까 뭐 이상하게 됨. 데이터를 넣으니까 알아서 ref 로 변함. 신기하네
      // const madePetLogCommentRef = {"__ref":`PetLogComment:${uploadedPetLogCommentId}`};

      // 댓글 캐시에 작성
      // 이러니까 댓글을 안읽어온 상태에서 작성하면 처음게 refetch 되는듯. 캐시를 읽어와서 없으면 새로 만들까?
      // const queryName = `seePetLogComments({offset:0,petLogId:${petLogId}})`;
      // const readCache = cache.readFragment({
      //   id:"ROOT_QUERY",
      //   fragment: gql`
      //     fragment SeePetLogComments on Query {
      //       # 안됨 readQuery 써야 할듯
      //       # ${queryName}
      //     }
      //   `
      // });
      // const readCache = cache.readQuery({
      //   query: SEE_PETLOG_COMMENTS,
      //   variables: {
      //     offset:0,
      //     petLogId,
      //   },
      // });

      // console.log("readCache")
      // console.log(readCache)

      // if(readCache) {
        updateSeePetLogCommentsQuery({
          action:"createComment",
          petLogCommentId: uploadedPetLogCommentId,
          forCreateComment:{
            offsetComments,
            setNowCommentsBundleNumber,
            totalCommentsNumber,
          },
        });
      // } else {
      //   const writeQuery = cache.writeQuery({
      //     query: gql`
      //       query seePetLogComments(
      //         $petLogId:Int!,
      //         $offset:Int!
      //       ) {
      //         seePetLogComments(
      //           petLogId: $petLogId,
      //           offset: $offset,
      //         ) {
      //           id
      //           user {
      //             id
      //             userName
      //             avatar
      //           }
      //           payload
      //           createdAt
      //           isMine
      //           totalLikes
      //           totalCommentOfComments
      //           isLiked
      //         }
      //       }`,
      //     data: { // Contains the data to write
      //       seePetLogComments: offsetComments,
      //     },
      //     variables: {
      //       petLogId,
      //       offset:totalCommentsNumber - totalCommentsNumber%10,
      //     }
      //   });
      //   // 화면 렌더링이 안되네;;;
      //   console.log("writeQuery")
      //   console.log(writeQuery)
      // }
      
      setComment("");
    }
  };

  const [createPetLogComment] = useMutation<createPetLogComment,createPetLogCommentVariables>(CREATE_PETLOG_COMMENT,{
    update:updateCreatePetLogComment,
  });

  const onPressCreateComment = async() => {
    if(!comment) {
      return Alert.alert("댓글을 작성해 주세요.");
    }
    await createPetLogComment({
      variables:{
        petLogId,
        payload:comment,
      },
    });
  };


  return (
    <CreateCommentContainer disabled={disabled}>
      <CommentInput
        placeholder={placeholder}
        value={comment}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(text)=>setComment(text)}
        editable={!disabled}
        isAndroid={isAndroid}
      />
      <CreateCommentBtn
        isAndroid={isAndroid}
        disabled={disabled}
        onPress={onPressCreateComment}
      >
        <CreateCommentBtnText isAndroid={isAndroid}>작성</CreateCommentBtnText>
      </CreateCommentBtn>
    </CreateCommentContainer>
  );
};

export default CreateComment;
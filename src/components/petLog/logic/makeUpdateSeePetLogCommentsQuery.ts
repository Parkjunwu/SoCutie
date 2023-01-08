import { WatchQueryOptions } from "@apollo/client";
import { seePetLogComments, seePetLogCommentsVariables, seePetLogComments_seePetLogComments } from "../../../__generated__/seePetLogComments";
import { UpdateSeePetLogCommentsQueryType } from "../type/updateQueryType";


type UpdateSeePetLogCommentsQueryFnType = <TVars = seePetLogCommentsVariables>(mapFn: (previousQueryResult: seePetLogComments, options: Pick<WatchQueryOptions<TVars, seePetLogComments>, "variables">) => seePetLogComments) => void


// 함수 반환 함수. updateQuery 받아서 로직 실행하는 애 반환
const makeUpdateSeePetLogCommentsQuery = (
  updateSeePetLogCommentsQuery: UpdateSeePetLogCommentsQueryFnType
) => {
  // 얘를 반환
  return ({action,petLogCommentId,editPayload,forCreateComment}:UpdateSeePetLogCommentsQueryType) => {
    updateSeePetLogCommentsQuery((prev)=>{

      const { seePetLogComments:prevComments } = prev;

      let newComments: seePetLogComments_seePetLogComments[];

      switch(action) {
          
        case 'createComment': // 받은 애로 캐시 덮어 씌움
          const {offsetComments,setNowCommentsBundleNumber,totalCommentsNumber} = forCreateComment;
          newComments = offsetComments;
          const bundleNumber = Math.ceil(totalCommentsNumber/10);
          setNowCommentsBundleNumber(bundleNumber);
          break;

        case 'editComment':  // 댓글 변경
          newComments = prevComments.map(comment => {
            if(comment.id === petLogCommentId) {
              const newComment = {...comment};
              newComment.payload = editPayload;
              return newComment;
            } else {
              return {...comment};
            }
          });
          break;

        case 'deleteComment': // 댓글 삭제
          newComments = prevComments.filter(comment => comment.id !== petLogCommentId);
          break;
        
        case 'createCommentOfComment': // 댓글의 총 대댓글 수 증가
          newComments = prevComments.map(comment => {
            if(comment.id === petLogCommentId) {
              const newComment = {...comment};
              const prevTotalCommentOfComments = newComment.totalCommentOfComments;
              newComment.totalCommentOfComments = prevTotalCommentOfComments + 1;
              return newComment;
            } else {
              return {...comment};
            }
          });
          break;

        case 'deleteCommentOfComment': // 댓글의 총 대댓글 수 감소
          newComments = prevComments.map(comment => {
            if(comment.id === petLogCommentId) {
              const newComment = {...comment};
              const prevTotalCommentOfComments = newComment.totalCommentOfComments;
              newComment.totalCommentOfComments = prevTotalCommentOfComments - 1;
              return newComment;
            } else {
              return {...comment};
            }
          });
          break;

        // default:
        //   break;
      }

      // const updateResult = {
      //   seePetLogComments: {
      //     comments:newComments,
      //     isNotFetchMore:true,
      //     ...prevRest,
      //   }
      // };
      const updateResult = {
        seePetLogComments: newComments,
      };

      return updateResult;
    });
  };
};


// 얘는 따로 쓰진 않아서 걍 뺌. 위에가 헷갈리면 SingleCommentLayout 에 이거 보면 이해 될듯.

// type UpdateSeePetLogCommentOfCommentsQueryFnType = <seePetLogCommentOfCommentsVariables>(mapFn: (previousQueryResult: seePetLogCommentOfComments, options: Pick<WatchQueryOptions<seePetLogCommentOfCommentsVariables, seePetLogCommentOfComments>, "variables">) => seePetLogCommentOfComments) => void;

// // 똑같이 함수 반환 함수. updateQuery 받아서 로직 실행하는 애 반환
// const makeUpdateSeePetLogCommentOfCommentsQuery = (updateSeePetLogCommentOfCommentsQuery:UpdateSeePetLogCommentOfCommentsQueryFnType) => {
//   // updateQuery 받아서 얘를 반환
//   return ({action,petLogCommentOfCommentId,editPayload,newCacheData,prevCommentNumber,numberNow}:UpdateSeePetLogCommentOfCommentsQueryType) => {
//     updateSeePetLogCommentOfCommentsQuery((prev)=>{

//       if(action === 'createCommentOfComment') {

//         const __typename:"SeePetLogCommentOfCommentsResponse" = "SeePetLogCommentOfCommentsResponse";
//         const hasNextPage = prevCommentNumber === 0 ? false : true;
//         const now = numberNow +"";

//         const newSeeCommentOfComments = {
//           seePetLogCommentOfComments: {
//             __typename,
//             commentOfComments:[newCacheData],
//             cursorId: petLogCommentOfCommentId,
//             error: null,
//             hasNextPage,
//             isNotFetchMore: null,
//             fetchedTime: now,
//           },
//         };

//         // 댓글보기를 안했거나 이전 댓글이 없으면 기존 캐시가 없어. 그런 경우 새로 생성
//         if(prev.seePetLogCommentOfComments === undefined ) {
//           return newSeeCommentOfComments;
//         }

//         const {seePetLogCommentOfComments:{ commentOfComments:prevCommentOfComments, isNotFetchMore, fetchedTime, ...prevRest }} = prev;

//         // 기존의 캐시가 너무 오래 지났으면 이전 캐시 안받고 새로 생성
//         const passedByTime = numberNow - Number(fetchedTime);
//         // 5분 이상 지남.
//         if ( passedByTime > 60000*5 ) {
//           return newSeeCommentOfComments;
//         }

//         // 캐시 변경
//         const updateResult = {
//           seePetLogCommentOfComments: {
//             commentOfComments:[newCacheData,...prevCommentOfComments],
//             isNotFetchMore:true,
//             fetchedTime,
//             ...prevRest,
//           }
//         };

//         return updateResult;
//       };

//       // 그외
//       const {seePetLogCommentOfComments:{ commentOfComments:prevCommentOfComments, isNotFetchMore, ...prevRest }} = prev;

//       let newCommentOfComments;

//       switch(action) {
          
//         case 'editCommentOfComment':  // 댓글 변경
//           newCommentOfComments = prevCommentOfComments.map(commentOfComment => {
//             if(commentOfComment.id === petLogCommentOfCommentId) {
//               const newCommentOfComment = {...commentOfComment};
//               newCommentOfComment.payload = editPayload;
//               return newCommentOfComment;
//             } else {
//               return {...commentOfComment};
//             }
//           });
//           break;

//         case 'deleteCommentOfComment': // 댓글 삭제
//           newCommentOfComments = prevCommentOfComments.filter(commentOfComment => commentOfComment.id !== petLogCommentOfCommentId);
//           break;

//         // default:
//         //   break;
//       }

//       const updateResult = {
//         seePetLogCommentOfComments: {
//           commentOfComments:newCommentOfComments,
//           isNotFetchMore:true,
//           ...prevRest,
//         }
//       };

//       return updateResult;
//     });
//   };
// };

export { 
  makeUpdateSeePetLogCommentsQuery,
  // makeUpdateSeePetLogCommentOfCommentsQuery,
};
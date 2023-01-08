import { ApolloClient, InMemoryCache, makeVar, split, fromPromise } from "@apollo/client";
import EncryptedStorage from 'react-native-encrypted-storage';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition, offsetLimitPagination } from "@apollo/client/utilities";
import {onError} from "@apollo/client/link/error"
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave, cursorPaginationForSeeComments, cursorPaginationNeedDataFieldNameAndKeyArgsIfHave, forSeeBlockUsers } from "./cursorPagination";
import { Alert } from "react-native";
import Config from "react-native-config";

// 토큰 상수
export const REFRESH_TOKEN = "refreshToken"

// 유저 로그인 여부
export const isLoggedInVar = makeVar(false);
// 토큰의 여부
export const accessTokenVar = makeVar<string>("");

// 로컬 이미지 uri
// noUserUriVar 는 { uri: avatar ? "~~" : noUserUriVar() } 처럼 써야되서 { uri: "~~" } 형식 말고 그냥 통일되게 string 형식으로 저장
export const logoUriVar = makeVar<string>("");
export const noUserUriVar = makeVar<string>("");

export const moveDeleteAccountComplete = makeVar<boolean>(false);

// upload 쓸 때 httpLink
const uploadHttpLink = createUploadLink({
  uri: Config.BACKEND_URL,
})


// 신버전 subscription Link
const wsLink = new GraphQLWsLink(createClient({
  url: Config.BACKEND_WEB_SOCKET_URL,
  connectionParams: () => ({
    // http 헤더는 대문자로 보내도 소문자로 받아짐.
    accesstoken: accessTokenVar(),
  }),
}));


// 인증, 로그인을 위한 Link
const authLink = setContext((_,{headers})=>{
  return {
    headers:{
      ...headers,
      // http 헤더는 대문자로 보내도 소문자로 받아짐. accessToken 으로 보내면 서버의 헤더에선 accesstoken 로 받아짐. 그래서 그냥 안헷갈리게 accesstoken 로 써
      accesstoken:accessTokenVar(),
    }
  }
});


// 쿠키 말고 header 로 쓰면 이렇게 받아야 하나봄.
const getNewToken = async () => {
  try {
    const fetchUrl = Config.REFRESH_URL;
    
    return await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        // Authorization: `Bearer ${getAccessToken()}`,
        'refreshtoken': await EncryptedStorage.getItem(REFRESH_TOKEN)
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log("fetch result");
      console.log(res);
      accessTokenVar(res);
      console.log("accessTokenVar()")
      console.log(accessTokenVar())
      return res
    });

  } catch (error) {
    console.log(error);
  }
};


// 에러 링크. 에러 종류에 따라 콘솔에 표시
const onErrorLink = onError(({graphQLErrors, networkError, operation, forward})=>{
  if (graphQLErrors) {
    console.log("Network Error ",graphQLErrors);
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case "UNAUTHENTICATED":
          return fromPromise(
            getNewToken().catch((error) => {
              // Handle token refresh errors e.g clear stored tokens, redirect to login
              console.error("refreshtoken 에러 : "+error);
              return;
            })
          )
            .filter((value) => Boolean(value))
            .flatMap((accessToken) => {
              console.log("getNewAccessToken")
              console.log(accessToken)
              const oldHeaders = operation.getContext().headers;
              // modify the operation context with a new token
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  accessToken
                },
              });
              // console.log("안 된 쿼리")
              // console.log(operation.query.definitions)
              return forward(operation);
            });
      }
    }
  }
  if(networkError){
    console.error("Network Error ",networkError)
    Alert.alert("네트워크 연결을 확인해 주시기 바랍니다.")
  }
});


// 캐시
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeNewPostFeed: offsetLimitPagination(),
        seeFollowersFeed: offsetLimitPagination(),
        // 얘는 Pagination 필요 없을 듯
        // seePetLogComments: offsetLimitPagination(["petLogId"]),
        // isNotFetchMore 있는 애. 다른 쿼리 들어올 수 있는 애
        getRoomMessages: cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("messages","roomId"),
        seeRooms:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("rooms"),
        seePostLikes:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("likeUsers","id"),
        seeCommentLikes:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("likeUsers","commentId"),
        seeCommentOfCommentLikes:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("likeUsers","commentOfCommentId"),
        seeFollowers:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("followers","id"),
        seeFollowing:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("following","id"),
        seeUserNotificationList:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("notification"),
        // 얘는 이유는 모르겠는데 refetch 가 existing 을 받음. 그래서 따로 만듦
        seeComments:cursorPaginationForSeeComments(),
        seeCommentOfComments:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("commentOfComments","commentId"),
        // offsetPagination 으로
        // seePetLogComments:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("comments","petLogId"),
        seeNewPetLogList:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("petLogs"),
        seePetLogCommentOfComments:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("commentOfComments","petLogCommentId"),
        getMePetLogs:cursorPaginationCanGetAnotherQueryNeedDataFieldNameAndKeyArgsIfHave("petLogs"),

        // 이걸로 바꾸고 local only field 넣어. 근데 그냥 쓰던거 쓰는게 나을듯.
        seeBlockUsers:forSeeBlockUsers("users"),

        // isNotFetchMore 없는 애. 다른 쿼리 못들어옴
        getUserPosts:cursorPaginationNeedDataFieldNameAndKeyArgsIfHave("posts","userId"),
        getUserPetLogs:cursorPaginationNeedDataFieldNameAndKeyArgsIfHave("petLogs","userId"),
        getMePosts:cursorPaginationNeedDataFieldNameAndKeyArgsIfHave("posts"),
        // getMePetLogs:cursorPaginationNeedDataFieldNameAndKeyArgsIfHave("petLogs"),
        seeHashTag:cursorPaginationNeedDataFieldNameAndKeyArgsIfHave("posts","name"),
        searchPosts:cursorPaginationNeedDataFieldNameAndKeyArgsIfHave("posts","keyword"),
      }
    }
  }
});

// 링크들을 묶어서 하나로
const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink)

// subscription 인지 아닌지에 따라 링크 선택해주는 애
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLinks,
);

// client
const client = new ApolloClient({
  link:splitLink,
  cache,
});

export default client;
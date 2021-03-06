import { ApolloClient, InMemoryCache, makeVar, split } from "@apollo/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition, offsetLimitPagination } from "@apollo/client/utilities";
import {onError} from "@apollo/client/link/error"
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// 토큰 상수
const TOKEN = "token"

// 유저 로그인 여부
export const isLoggedInVar = makeVar(false);
// 토큰의 여부
export const tokenVar = makeVar<string|null>("");

// 로그인 로직
export const logUserIn = async(token:string) => {
  // 토큰을 AsyncStorage 에서 가져옴
  await AsyncStorage.setItem(TOKEN,(token));
  isLoggedInVar(true);
  tokenVar(token);
};

// 로그아웃 로직
export const logUserOut = async() => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
  // 캐시 삭제
  client.resetStore();
};
// logUserOut();

// upload 안쓰면 일반 Link
// const httpLink = createHttpLink({
//   // uri: "http://localhost:4000/graphql",
//   uri:"http://bc72-58-140-221-249.ngrok.io/graphql",
// });

// upload 쓸 때 Link
const uploadHttpLink = createUploadLink({
  uri:"http://localhost:4000/graphql",
  // uri:"http://022d-58-140-221-249.ngrok.io/graphql"
})

// 신버전 subscription Link
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  // url:"ws://022d-58-140-221-249.ngrok.io/graphql",
  connectionParams: () => ({
    token: tokenVar(),
  }),
}));

// 인증, 로그인을 위한 Link
const authLink = setContext((_,{headers})=>{
  return {
    headers:{
      ...headers,
      token:tokenVar(),
    }
  }
});

// 에러 링크. 에러 종류에 따라 콘솔에 표시
const onErrorLink = onError(({graphQLErrors,networkError})=>{
  if(graphQLErrors){
    console.log("GraphQL Error ",graphQLErrors)
  }
  if(networkError){
    console.log("Network Error ",networkError)
  }
});

// const cursorPagination = () => {
  const cursorPagination = {
  // return {
    merge(existing, incoming, { readField }) {
      return existing ? [...existing,...incoming] : [...incoming]
      ;
    },
    read(existing) {
      if (existing) {
        return [...existing]
      }
    },
  // }
}
// 캐시
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
        getRoomMessages: {
          // keyArgs 를 지정하면 각 방마다 캐시 저장할 수 있음. 안하면 마지막에 들어갔던 방만 유지.
          keyArgs: ["roomId"],
          merge(existing, incoming) {
            // 무조건 type 형식이 맞아야함.... ㅅㅂ 안되서 개삽질했네. ...incomingRest 이걸로 맞춰라 바꿀꺼 빼고
            const { messages:incomingMessages, ...incomingRest } = incoming;
            const messages = existing?.messages ? [ ...existing.messages, ...incomingMessages ] : [ ...incomingMessages ];
            return {
              messages,
              ...incomingRest,
            };
          },

          // read(existing) {
          //   if (existing) {
          //     return { ...existing };
          //   }
          // },
        }
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
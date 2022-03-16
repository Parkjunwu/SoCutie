import { ApolloClient, InMemoryCache, makeVar, split } from "@apollo/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition, offsetLimitPagination } from "@apollo/client/utilities";
import {onError} from "@apollo/client/link/error"
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from '@apollo/client/link/ws';

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
})

// subscription 을 위한 web socket Link
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: tokenVar(),
    }),
  }
});

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

// 캐시
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination()
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
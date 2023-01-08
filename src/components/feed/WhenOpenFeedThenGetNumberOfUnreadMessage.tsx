import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { getNumberOfUnreadMessage } from "../../__generated__/getNumberOfUnreadMessage";
import { FeedStackProps } from "../type";
import { Ionicons } from "@expo/vector-icons"
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../logic/subscribeToMoreExcuteOnlyOnce";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { justAlertThereIsNewMessage } from "../../__generated__/justAlertThereIsNewMessage";
import { isLoggedInVar } from "../../apollo";
 
const GET_NUMBER_OF_UNREAD_MESSAGE = gql`
  query getNumberOfUnreadMessage {
    getNumberOfUnreadMessage
  }
`;

const JUST_ALERT_THERE_IS_NEW_MESSAGE = gql`
  subscription justAlertThereIsNewMessage {
    justAlertThereIsNewMessage
  }
`;

const UnreadMessageContainer = styled.View`
  position: absolute;
  right: -10px;
  top: -6px;
  z-index: 10;
  padding: 0px 4px;
  background-color: red;
  border-radius: 20px;
  
`;
const UnreadMessageText = styled.Text`
  color: white;
`;

type Props = NativeStackScreenProps<FeedStackProps, 'Feed'>;

// 안드로이드에서 오류나. 그래서 Feed 안에 집어 넣을 거임.

// Feed 들어올 때 안읽은 메세지 갯수 받고 헤더 오른쪽에 메세지 버튼 생성함.
const WhenOpenFeedThenGetNumberOfUnreadMessageAndSetHeaderMessage = () => {

  // 로그인 여부 확인, 로그인/로그아웃 시에 헤더 재설정을 할라면 useReactiveVar 로 써야함.
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  // const isLoggedIn = isLoggedInVar();

  // 로그인 안하면 안받음.
  const { data:numberOfUnreadMessage, subscribeToMore } = useQuery<getNumberOfUnreadMessage>(GET_NUMBER_OF_UNREAD_MESSAGE,{
    fetchPolicy: 'network-only',
    skip:!isLoggedIn,
  });

  const updateQuery:UpdateQueryFn<getNumberOfUnreadMessage, null, justAlertThereIsNewMessage> | undefined = (prev, {subscriptionData}) => {
    if (!subscriptionData.data) return prev;
    
    return Object.assign({}, prev, {
      getNumberOfUnreadMessage: prev.getNumberOfUnreadMessage + 1
    });
  };

  // subscribe + 캐시 변경 (메세지 개수 + 1)
  const wholeSubscribeToMoreFn = () => {
    console.log("subscribe!!")
    subscribeToMore({
      document:JUST_ALERT_THERE_IS_NEW_MESSAGE,
      updateQuery,
      // onError:(err) => console.error("error is "+err),
      onError:(err) => {
        console.error("subscribe error is "+err)
        console.error(err.cause)
        console.error(err.message)
        console.error(err.name)
        console.error(err.stack)
      },
    });
  };

  // subscription 한번만 실행되게 하기 위함
  subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData(wholeSubscribeToMoreFn,numberOfUnreadMessage?.getNumberOfUnreadMessage);

  const navigation = useNavigation<Props['navigation']>();

  const onPressBtn = () => {
    console.log("isLoggedIn : "+isLoggedIn)
    if(!isLoggedIn) {
      return Alert.alert("채팅은 로그인 후 이용 가능합니다.","로그인 페이지로 이동하시겠습니까?",[
        {
          text:"이동",
          onPress:()=>navigation.navigate("AuthNav")
        },
        {
          text:"취소",
        }
      ]);
    } else {
      navigation.navigate("Messages")
    }
  };

  const MessageBtn = ({tintColor}:{tintColor?:string| undefined}) => {
    return (
      <TouchableOpacity style={{marginRight:10,marginTop:1}} onPress={onPressBtn}>
        {numberOfUnreadMessage?.getNumberOfUnreadMessage ? <UnreadMessageContainer>
          <UnreadMessageText>{numberOfUnreadMessage.getNumberOfUnreadMessage}</UnreadMessageText>
        </UnreadMessageContainer> : null}
        <Ionicons name="paper-plane" size={25} color={tintColor} />
      </TouchableOpacity>
    )
  };

  // 헤더 생성. 데이터 받으면 안읽은 메세지 갯수 변경
  useEffect(()=>{
    navigation.setOptions({
      headerRight:MessageBtn
    })
  },[numberOfUnreadMessage,isLoggedIn]);

};

export default WhenOpenFeedThenGetNumberOfUnreadMessageAndSetHeaderMessage;
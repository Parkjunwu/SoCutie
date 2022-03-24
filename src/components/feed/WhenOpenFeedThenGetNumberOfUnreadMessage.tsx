import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { getNumberOfUnreadMessage } from "../../__generated__/getNumberOfUnreadMessage";
import { FeedStackProps } from "../type";
import { Ionicons } from "@expo/vector-icons"
import subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData from "../../logic/subscribeToMoreExcuteOnlyOnce";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import { justAlertThereIsNewMessage } from "../../__generated__/justAlertThereIsNewMessage";
 
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

// Feed 들어올 때 안읽은 메세지 갯수 받고 헤더 오른쪽에 메세지 버튼 생성함.
const WhenOpenFeedThenGetNumberOfUnreadMessageAndSetHeaderMessage = () => {
  const { data:numberOfUnreadMessage, refetch:refetchNumberOfUnreadMessage, subscribeToMore } = useQuery<getNumberOfUnreadMessage>(GET_NUMBER_OF_UNREAD_MESSAGE);
  // 처음 실행했을 때 안읽은 메세지 갯수 받음
  useEffect(()=>{
    refetchNumberOfUnreadMessage();
  },[]);

  const updateQuery:UpdateQueryFn<getNumberOfUnreadMessage, null, justAlertThereIsNewMessage> | undefined = (prev, {subscriptionData}) => {
    
    if (!subscriptionData.data) return prev;
    return Object.assign({}, prev, {
      getNumberOfUnreadMessage: prev.getNumberOfUnreadMessage + 1
    });
  };

  // subscribe + 캐시 변경 (메세지 개수 + 1)
  const wholeSubscribeToMoreFn = () => {
    subscribeToMore({
      document:JUST_ALERT_THERE_IS_NEW_MESSAGE,
      updateQuery,
      onError:(err) => console.error("error is "+err),
    });
  };
  
  // subscription 한번만 실행되게 하기 위함
  subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData(wholeSubscribeToMoreFn,numberOfUnreadMessage?.getNumberOfUnreadMessage);

  const navigation = useNavigation<Props['navigation']>();
  const MessageBtn = ({tintColor}:{tintColor?:string| undefined}) => {
    return (
      <TouchableOpacity style={{marginRight:10,marginTop:1}} onPress={()=>
      navigation.navigate("Messages") }>
        {(numberOfUnreadMessage?.getNumberOfUnreadMessage || numberOfUnreadMessage.getNumberOfUnreadMessage !== 0) &&<UnreadMessageContainer>
          <UnreadMessageText>{numberOfUnreadMessage.getNumberOfUnreadMessage}</UnreadMessageText>
        </UnreadMessageContainer>}
        <Ionicons name="paper-plane" size={25} color={tintColor} />
      </TouchableOpacity>
    )
  };
  // 헤더 생성. 데이터 받으면 안읽은 메세지 갯수 변경
  useEffect(()=>{
    navigation.setOptions({
      headerRight:MessageBtn
    })
  },[numberOfUnreadMessage]);
};

export default WhenOpenFeedThenGetNumberOfUnreadMessageAndSetHeaderMessage;
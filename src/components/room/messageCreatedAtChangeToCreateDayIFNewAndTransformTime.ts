import { transformedMessages } from "../../screens/loggedInNav/messageAndUploadNav/messageNav/transformedMessages";
import { getRoomMessages_getRoomMessages_messages } from "../../__generated__/getRoomMessages";
import getCreatedTimeAndDayByTimestamp from "./logic/getCreatedTimeAndDayByTimestamp";

type tType = (messages:getRoomMessages_getRoomMessages_messages[]) => transformedMessages 

// 날짜가 바뀔 때 바로 이전 데이터에 바뀌기 전의 날짜를 넣어줌. 좀 복잡함.
// 데이터에 날짜를 넣고 다음 데이터가 이전 데이터의 날짜랑 같으면 이전 데이터에 날짜를 지우고 다음 데이터에 날짜를 넣는 방식. 날짜 다르면 이전 데이터 날짜 유지.
// createdAt 은 시:분 으로 변환
const messageCreatedAtChangeToCreateDayIFNewAndTransformTime:tType = (messages:getRoomMessages_getRoomMessages_messages[]) => {

  // 최종적으로 날짜를 넣은 반환할 데이터
  const transformedMessages:transformedMessages = [];


  messages.forEach((message,index) => {

    const firstData = index === 0;
    const lastData = index === messages.length-1;
    const previousData = !firstData ? transformedMessages[index-1] : undefined;

    // 날짜랑 변환된 시간을 받음.
    const { createdDay, transformedTime } = getCreatedTimeAndDayByTimestamp(message.createdAt);

    const {createdAt,...rest} = message;

    // 변환된 시간 기본으로 넣음. 이름도 createdAt 은 헷갈리니까 createdDay 로 바꿈.
    const newMessage = { createdDay:createdAt, ...rest, transformedTime };
    // const newMessage = {...message,transformedTime};
    
    // 처음 데이터는 일단 날짜 넣어
    if(firstData) {
      newMessage.createdDay = createdDay;
    // 마지막 데이터인데 이전거랑 날짜가 달라. 그러면 마지막에도 날짜 넣어
    } else if (lastData && previousData.createdDay !== createdDay) {
      newMessage.createdDay = createdDay;
    // 이전 데이터와 날짜가 같으면 이전 데이터 날짜 지우고 현재 데이터에 날짜 넣음.
    } else if (previousData.createdDay === createdDay){
      previousData.createdDay = null;
      newMessage.createdDay = createdDay;
    // 이전 데이터와 날짜가 디르면 현재 데이터에 날짜 넣음. 날짜 확인하는 배열에 날짜 넣음.
    } else {
      newMessage.createdDay = createdDay;
    }

    // 반환할 데이터 배열에 넣음.
    transformedMessages.push(newMessage);
  }); // transformedMessages

  return transformedMessages;
};

export default messageCreatedAtChangeToCreateDayIFNewAndTransformTime;
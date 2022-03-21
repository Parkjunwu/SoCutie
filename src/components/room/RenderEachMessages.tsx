import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import getCreatedTimeAndDayByTimestamp from "./logic/getCreatedTimeAndDayByTimestamp";

const NewDayContainer = styled.View`
`;
const NewDayText = styled.Text<{darkMode:string}>`
  color: ${props => props.theme.textColor};
  text-align: center;
  margin-bottom: 20px;
`;
const MessageContainer = styled.View<{isMessageMine:boolean}>`
  flex-direction: ${props => props.isMessageMine ? "row-reverse" : "row"};
  padding: 0px 10px;
  align-items: flex-end;
`;
const Author = styled.View`
`;
const Avatar = styled.Image`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  `;
const Message = styled.Text<{darkMode:string}>`
  /* 다크모드에 따라 색상 바뀜. */
  color: ${props => props.theme.textColor};
  margin: 0px 10px;
  background-color: ${props => props.darkMode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.5)"};
  padding: 5px 20px;
  border-radius: 10px;
  overflow: hidden;
  font-size: 16px;
`;
const SendTime = styled.Text<{darkMode:string}>`
  /* 다크모드에 따라 색상 바뀜. */
  color: ${props => props.theme.textColor};
  font-size: 11px;
`;


// 처음 날짜 + 날짜가 바뀌는 때에만 날짜 보여줌
// 날짜 확인을 위한 배열
const dayArray: string[] = [];

const RenderEachMessages = ({item:message,talkingTo}) => {
  const darkModeSubscription = useColorScheme();
  if(!message){
    return null;
  }
  const isMessageMine = message?.user?.userName === talkingTo.userName

  const { createDay, transformedTime } = getCreatedTimeAndDayByTimestamp(message.createdAt);

  // 날짜가 이미 있는지 확인
  let isNewDay = false;
  if(!dayArray.includes(createDay)){
    dayArray.push(createDay);
    isNewDay = true;
  }

  return (
    <>
      {isNewDay && <NewDayContainer>
        <NewDayText darkMode={darkModeSubscription}>{createDay}</NewDayText>  
      </NewDayContainer>}
      <MessageContainer isMessageMine={isMessageMine}>
        <Author>
          <Avatar source={{uri: isMessageMine ? message?.user?.avatar : talkingTo.avatar}}/>
        </Author>
        <Message darkMode={darkModeSubscription}>{message.payload}</Message>
        <SendTime darkMode={darkModeSubscription}>{transformedTime}</SendTime>
      </MessageContainer>
    </>
  )
};
export default RenderEachMessages;
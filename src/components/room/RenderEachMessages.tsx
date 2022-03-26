import { useColorScheme } from "react-native";
import styled from "styled-components/native";

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
  width: 30px;
  height: 30px;
  border-radius: 15px;
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


const RenderEachMessages = ({item:message,talkingTo}) => {
  if(!message){
    return null;
  }
  const darkModeSubscription = useColorScheme();

  const isMessageMine = message.user?.userName !== talkingTo?.userName

  const createdDay = message.createdDay;
  const transformedTime = message.transformedTime;
  const avatar = message.user.avatar;
  const avatarUriIfNullThenSetNoUser = avatar ? { uri: avatar } : require("../../../assets/no_user.png");
  // { uri: avatar, cache:'force-cache' }

  return (
    <>
      <MessageContainer isMessageMine={isMessageMine}>
        <Author>
          <Avatar source={avatarUriIfNullThenSetNoUser}/>
        </Author>
        <Message darkMode={darkModeSubscription}>{message.payload}</Message>
        <SendTime darkMode={darkModeSubscription}>{transformedTime}</SendTime>
      </MessageContainer>
      {createdDay && <NewDayContainer>
        <NewDayText darkMode={darkModeSubscription}>{createdDay}</NewDayText>  
      </NewDayContainer>}
    </>
  )
};
export default RenderEachMessages;
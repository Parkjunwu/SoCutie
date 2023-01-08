import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import FastImage from 'react-native-fast-image'
import image from "../../image";
import { noUserUriVar } from "../../apollo";


const MessageContainer = styled.View<{isMessageMine:boolean}>`
  flex-direction: ${props => props.isMessageMine ? "row-reverse" : "row"};
  padding: 0px 10px;
`;
const Container = styled.View<{isMessageMine:boolean}>`
  max-width: 60%;
  flex-direction: ${props => props.isMessageMine ? "row-reverse" : "row"};
  align-items: flex-end;
`;
const Author = styled.View`
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
const InfoContainer = styled.View`
  align-items: flex-end;
`;
const SendTime = styled.Text<{darkMode:string}>`
  /* 다크모드에 따라 색상 바뀜. */
  color: ${props => props.theme.textColor};
  font-size: 10px;
`;
const NotRead = styled.Text<{darkMode:string}>`
  /* 다크모드에 따라 색상 바뀜. */
  color: ${props => props.theme.textColor};
  font-size: 9px;
  text-align: center;
`;
const NewDayContainer = styled.View`
`;
const NewDayText = styled.Text<{darkMode:string}>`
  /* 다크모드에 따라 색상 바뀜. */
  color: ${props => props.theme.textColor};
  text-align: center;
  margin-bottom: 20px;
`;


const RenderEachMessages = ({item:message,opponentUserName}) => {
  if(!message){
    return null;
  }
  const darkModeSubscription = useColorScheme();

  const isMessageMine = message.user?.userName !== opponentUserName
  // const isMessageMine = message.user?.userName !== talkingTo?.userName

  const notRead = isMessageMine && !message.read;
  const createdDay = message.createdDay;
  const transformedTime = message.transformedTime;
  const avatar = message.user?.avatar;
  // const avatarUriIfNullThenSetNoUser = avatar ? { uri: avatar } : require("../../../assets/no_user.png");
  const avatarUriIfNullThenSetNoUser = { uri: avatar ? avatar : noUserUriVar() };

  return (
    <>
      <MessageContainer isMessageMine={isMessageMine}>
        <Container isMessageMine={isMessageMine}>
        <Author>
          <FastImage
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
              }}
              source={avatarUriIfNullThenSetNoUser}
          />
        </Author>
        <Message darkMode={darkModeSubscription}>{message.payload}</Message>
        <InfoContainer>
          <SendTime darkMode={darkModeSubscription}>{transformedTime}</SendTime>
          {notRead && <NotRead darkMode={darkModeSubscription}>안읽음</NotRead>}
          </InfoContainer>
        </Container>
      </MessageContainer>
      {createdDay && <NewDayContainer>
        <NewDayText darkMode={darkModeSubscription}>{createdDay}</NewDayText>  
      </NewDayContainer>}
    </>
  )
};
export default RenderEachMessages;
import React from "react";
import styled from "styled-components/native";
import FastImage from 'react-native-fast-image'
import { colors } from "../../../color";
import { Platform } from "react-native";
import image from "../../../image";
import { noUserUriVar } from "../../../apollo";

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Column = styled.View<{isChosenOrNothingChosen:Boolean}>`
  flex-direction: row;
  align-items: center;
  padding: 5px 15px;
  opacity: ${props=>props.isChosenOrNothingChosen ? 1 : 0.4};
`;
const UserContainer = styled.View`

`;
const Username = styled.Text`
  color: ${props=>props.theme.textColor};
  font-weight: 600;
  font-size: 17px;
`;
const SendBtn = styled.TouchableOpacity`
  margin-right: 30px;
  border-radius: 4px;
  background-color: ${colors.yellow};
`;
const SendBtnText = styled.Text<{isAndroid:boolean}>`
  padding: 6px 12px;
  font-weight: ${props=>props.isAndroid ? 'bold' : 600};
`;

type Prop = {
  id: number;
  userName: string;
  avatar: string;
  chosenUserId: number | null;
  setChosenUserId: Function;
};

const UserRowCanSendMessage = ({id,avatar,userName,chosenUserId,setChosenUserId}:Prop) => {
  const isChosenOrNothingChosen = (id === chosenUserId) || (chosenUserId !== null);
  const onPressColumn = () => {
    setChosenUserId(prev=>{
      if(prev===id){
        return null;
      } else {
        return id;
      }
    });
  };

  const isAndroid = Platform.OS === "android"

  return (
    <Container onPress={onPressColumn} >
      <UserContainer>
        {/* opacity 를 style 에 말고, 글고 View 에 넣어줘야 자식들까지 투명해짐. */}
        {/* style 에 넣어도 되는거 같은데? style 에 넣음. 혹시 안되면 다시 변경 */}
        {/* <Column isChosenOrNothingChosen={isChosenOrNothingChosen} opacity={isChosenOrNothingChosen ? 1 : 0.4}> */}
        <Column isChosenOrNothingChosen={isChosenOrNothingChosen} >
          <FastImage
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginRight: 10,
            }}
            // source={ avatar ? { uri: avatar } : image.no_user }
            source={{ uri: avatar ? avatar : noUserUriVar() }}
          />
          <Username>{userName}</Username>
        </Column>
      </UserContainer>
      {isChosenOrNothingChosen && <SendBtn>
        <SendBtnText isAndroid={isAndroid} >작성</SendBtnText>
      </SendBtn>}
    </Container>
  );
}
export default UserRowCanSendMessage;
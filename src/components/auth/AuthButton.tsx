import React from "react";
import styled from "styled-components/native";
import { ActivityIndicator, GestureResponderEvent, Platform } from "react-native";
import { colors } from "../../color";

const Button = styled.TouchableOpacity<{isAndroid:boolean}>`
  background-color: ${colors.yellow};
  padding: 15px 10px;
  padding: ${props=>props.isAndroid ? "13px 10px" : "15px 10px;"};
  border-radius: 5px;
  width: 100%;
  opacity: ${prop => prop.disabled?0.5:1};
`;
const ButtonText = styled.Text<{isAndroid:boolean}>`
  /* color: white; */
  color: ${colors.darkYellow};
  font-size: 16px;
  font-weight: ${props=>props.isAndroid ? 'bold' : 600};
  text-align: center;
`;

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  disabled: boolean;
  text: string;
  loading: boolean;
};

const AuthButton: React.FC<Props> = ({onPress,disabled,text,loading}) => {
  const isAndroid = Platform.OS === "android"
  return (
    <Button isAndroid={isAndroid} disabled={disabled} onPress={onPress}>
      {!loading?<ButtonText isAndroid={isAndroid}>{text}</ButtonText>:
      <ActivityIndicator color="white"/>}
    </Button>
  )
};

export default AuthButton;
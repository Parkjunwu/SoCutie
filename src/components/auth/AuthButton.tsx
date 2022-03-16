import React from "react";
import styled from "styled-components/native";
import { ActivityIndicator, GestureResponderEvent } from "react-native";
import { colors } from "../../color";

const Button = styled.TouchableOpacity`
  background-color: ${colors.blue};
  padding: 15px 10px;
  border-radius: 5px;
  width: 100%;
  opacity: ${prop => prop.disabled?0.5:1};
`;
const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  disabled: boolean;
  text: string;
  loading: boolean;
};

const AuthButton: React.FC<Props> = ({onPress,disabled,text,loading}) => {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {!loading?<ButtonText>{text}</ButtonText>:
      <ActivityIndicator color="white"/>}
    </Button>
  )
};

export default AuthButton;
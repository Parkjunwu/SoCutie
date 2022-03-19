import styled from "styled-components/native";

interface IInputProps {
  lastOne?:boolean;
}

export const Input = styled.TextInput<IInputProps>`
  background-color: ${props=>props.theme.textInputBackgroundColor};
  padding: 15px 8px;
  border-radius: 20px;
  color: ${props=>props.theme.textColor};
  margin-bottom: ${props=>props.lastOne ? 17 : 8}px;
  width: 100%;
`;

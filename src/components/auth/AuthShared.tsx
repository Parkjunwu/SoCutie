import styled from "styled-components/native";

interface IInputProps {
  lastOne?:boolean;
}

export const Input = styled.TextInput<IInputProps>`
  background-color: rgba(255,255,255,0.15);
  padding: 15px 8px;
  border-radius: 20px;
  color: white;
  margin-bottom: ${props=>props.lastOne ? 17 : 8}px;
  width: 100%;
`;

import styled from "styled-components/native";
import usePlaceHolderColor from "../../hooks/usePlaceHolderColor";

const Input = styled.TextInput<{opacityForAnimation:boolean}>`
  /* background-color: yellow; */
  color: ${props=>props.theme.textColor};
  padding: 20px 10px;
  font-size: 16px;
  font-weight: bold;
  border-bottom-color: rgba(140,140,140,0.5);
  border-bottom-width: 1px;
  opacity: ${props=>props.opacityForAnimation ? 0 : 1};
`;

type TitleInputType = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  opacityForAnimation?: boolean;
};

const TitleInput = ({value,setValue,opacityForAnimation}:TitleInputType) => {

  const placeholderTextColor = usePlaceHolderColor();

  return (
    <Input
      value={value}
      onChangeText={setValue}
      placeholder="제목"
      // keyboardType="email-address"
      returnKeyType="done"
      autoCapitalize="none"
      autoCorrect={false}
      // ref={emailRef}
      // onSubmitEditing={onEmailSubmit}
      blurOnSubmit={false}
      placeholderTextColor={placeholderTextColor}
      multiline={true}
      opacityForAnimation={opacityForAnimation}
    />
  );
};

export default TitleInput;
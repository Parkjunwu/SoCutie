import styled from "styled-components/native";
import { RadioButtons } from 'react-native-radio-buttons'
import { TouchableWithoutFeedback } from "react-native";

const GenderButtonContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

const GenderButton = styled.View<{index:number}>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-right-width: ${props=> props.index === 0 ? "1px" : 0};
  border-right-color: grey;
  margin-top: 2px;
  margin-bottom: 2px;
`;

const GenderText = styled.Text<{selected:boolean}>`
  font-weight: ${props => props.selected ? 900 : 300};
  color: ${props=>props.selected ? props.theme.linkTextColor :props.theme.textColor};
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: ${props=>props.selected ? props.theme.textInputBackgroundColor : props.theme.backgroundColor};
`;


const GenderChooseBtn = ({selectedGender,onPressGender}) => {
  
  const options = [
    "남",
    "여"
  ];
  
  const setGender = (gender) => {
    onPressGender(gender);
  };

  const renderOption = (option, selected, onSelect, index) => {
    return (
      <TouchableWithoutFeedback onPress={onSelect} key={index} >
        <GenderButton index={index}>
              <GenderText selected={selected}>{option}</GenderText>
        </GenderButton>
      </TouchableWithoutFeedback>
    );
  };
 
  const renderContainer = (optionNodes:React.ReactNode) => {
    return <GenderButtonContainer>{optionNodes}</GenderButtonContainer>;
  };

  return (
    <RadioButtons
      options={ options }
      onSelection={ setGender }
      selectedOption={ selectedGender }
      renderOption={ renderOption }
      renderContainer={ renderContainer }
    />
  );
};

export default GenderChooseBtn;
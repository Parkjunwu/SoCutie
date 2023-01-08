import styled from "styled-components/native";
import { isAndroid } from "../../utils";

const SeeAllCaption = styled.TouchableOpacity`
  
`;
const SeeAllCaptionText = styled.Text<{isAndroid:boolean}>`
  color: ${props=>props.theme.textColor};
  /* 높이가 안맞아서 어거지로 맞춤 */
  padding-top: ${props=>props.isAndroid ? "0px" : "2px"};
`;

const SeeAllCaptionBtn = ({setSeeAllCaption}:{setSeeAllCaption:React.Dispatch<React.SetStateAction<boolean>>}) => {

  return (
    <SeeAllCaption onPress={()=>setSeeAllCaption(true)}>
      <SeeAllCaptionText isAndroid={isAndroid}> 전체 보기</SeeAllCaptionText>
    </SeeAllCaption>
  );
};

export default SeeAllCaptionBtn;
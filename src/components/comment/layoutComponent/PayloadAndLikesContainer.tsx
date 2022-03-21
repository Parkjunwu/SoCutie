import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "react-native";

const ContentContainer = styled.View`
  flex: 1;
`;
const Payload = styled.Text`
  font-size: 15px;
  color: ${props => props.theme.textColor};
`;
const TotalContainer = styled.View`
  flex-direction: row;
`;
const ToLikeLink = styled.TouchableOpacity`
  flex-direction: row;
`;
const TotalLikes = styled.Text`
  color: ${props => props.theme.textColor};
`;

type Props = {
  payload: string;
  onPressLike: () => void;
  isLiked: boolean;
  totalLikes: number;
}

// 컴포넌트 두개가 거의 똑같은데 밑에거는 대댓글 불러오는 children 을 넣을 수 있음.
// 위에 놈은 대댓글 레이아웃, 아래 놈은 댓글 레이아웃.

const PayloadAndLikesContainer = ({payload,onPressLike,isLiked,totalLikes}:Props) => {
  const darkModeSubscription = useColorScheme();
  return (
    <ContentContainer>
      <Payload>{payload}</Payload>
      <TotalContainer>
        <ToLikeLink onPress={onPressLike}>
          <Ionicons name={isLiked?"heart":"heart-outline"} color={isLiked ? "tomato" : darkModeSubscription === "light" ? "black" : "white"} size={16}/>
        </ToLikeLink>
        <TotalLikes>  {totalLikes}   </TotalLikes>
      </TotalContainer>
    </ContentContainer>
  );
};

// children 에 대댓글 보기 넣음. 그외엔 위와 동일.

const PayloadAndLikesAndSeeMoreCommentContainer: React.FC<Props> = ({payload,onPressLike,isLiked,totalLikes,children}) => {
  const darkModeSubscription = useColorScheme();
  return (
    <ContentContainer>
      <Payload>{payload}</Payload>
      <TotalContainer>
        <ToLikeLink onPress={onPressLike}>
          <Ionicons name={isLiked?"heart":"heart-outline"} color={isLiked ? "tomato" : darkModeSubscription === "light" ? "black" : "white"} size={16}/>
        </ToLikeLink>
        <TotalLikes>  {totalLikes}   </TotalLikes>
        {children}
      </TotalContainer>
    </ContentContainer>
  );
};

export { PayloadAndLikesContainer, PayloadAndLikesAndSeeMoreCommentContainer };
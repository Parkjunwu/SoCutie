import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { colors } from "../../color";
import { isAndroid } from "../../utils";
import { seeNewPostFeed_seeNewPostFeed_user } from "../../__generated__/seeNewPostFeed";
import { FeedStackProps } from "../type";
import CaptionUserName from "./CaptionUserName";

const HashTagTouchable = styled.TouchableOpacity`
  
`;
const HashTagText = styled.Text<{isAndroid:boolean}>`
  color: ${colors.purple};
  font-weight: 700;
  /* 높이가 안맞아서 어거지로 맞춤 */
  padding-top: ${props=>props.isAndroid ? "0px" : "2px"};
`;
const TextTouchable = styled.TouchableWithoutFeedback`

`;
const TextOnly = styled.Text<{isAndroid:boolean}>`
  color: ${props=>props.theme.textColor};
  /* 높이가 안맞아서 어거지로 맞춤 */
  padding-top: ${props=>props.isAndroid ? "0px" : "3px"};
`;

// // View 가 아니고 Text 에 넣으면 긴게 뒤에 오는데 높이를 못맞춤. 걍 View 쓰는게 나을듯. 전체보기도 넘어가는데 어쩔 수 없네;
// const TextWithUser = styled.Text`
// /* 높이가 안맞아서 어거지로 맞춤 */
//   padding-top: 2px;
// `;
const ViewWithUser = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  align-items: center;
`;

// 너무 많은데
type CaptionWithHashTagProps = {
  splitCaptionArr: string[];
  user: seeNewPostFeed_seeNewPostFeed_user;
  postId: number;
  lastSplitRenderCaptionIndex?: number;
  splitCaptionArrToLink?: string[];
}

const CaptionWithHashTag = ({
  splitCaptionArr,
  user,
  postId,
  lastSplitRenderCaptionIndex,
  splitCaptionArrToLink,
}:CaptionWithHashTagProps) => {

  const navigation = useNavigation<NativeStackNavigationProp<FeedStackProps, "Photo">>();

  const onPressHashTag = (text:string) => {
    const name = text.substring(1,text.length);
    navigation.navigate("HashTag", { name });
  };

  const onPressText = () => {
    navigation.navigate("Comments", { postId });
  };

  return (
    <>
      {splitCaptionArr.map((text,index) => {

        if(text.startsWith('#')){

          if(index === 0) {
            return (
              <ViewWithUser key={index}>
                <CaptionUserName user={user}/>
                <HashTagTouchable onPress={()=>onPressHashTag(text)}>
                  <HashTagText isAndroid={isAndroid}>{text} </HashTagText>
                </HashTagTouchable>
              </ViewWithUser>
            );
          }

          // 마지막이 해시태그인데 잘린 경우 원래 해시태그에 연결해줘
          if(index === lastSplitRenderCaptionIndex) {
            return (
              <HashTagTouchable key={index} onPress={()=>onPressHashTag(splitCaptionArrToLink[lastSplitRenderCaptionIndex])}>
                <HashTagText isAndroid={isAndroid}>{text} </HashTagText>
              </HashTagTouchable>
            );
          }

          return (
            <HashTagTouchable key={index} onPress={()=>onPressHashTag(text)}>
              <HashTagText isAndroid={isAndroid}>{text} </HashTagText>
            </HashTagTouchable>
          );

        } else {

          if(index === 0) {
            return (
              // isAndroid ? 
                <ViewWithUser key={index}>
                  <CaptionUserName user={user} cssTopIfNeed={isAndroid ? 0 : 1}/>
                  <TextTouchable onPress={onPressText}>
                    <TextOnly isAndroid={isAndroid}>{text} </TextOnly>
                  </TextTouchable>
                </ViewWithUser>
              // :
              //  Text 에 넣으면 높이를 못맞춤. 걍 긴거 넘어가는건 버려야할듯
              //   <TextWithUser key={index}>
              //     <CaptionUserName user={user} cssTopIfNeed={3}/>

              //     <TextTouchable onPress={onPressText}>
              //       <FirstTextOnly>{text} </FirstTextOnly>
              //     </TextTouchable>

              //   </TextWithUser>
            );
          }

          return (
            <TextTouchable key={index} onPress={onPressText}>
              <TextOnly isAndroid={isAndroid}>{text} </TextOnly>
            </TextTouchable>
          );
        }
      })}
    </>
  );
};

export default CaptionWithHashTag;
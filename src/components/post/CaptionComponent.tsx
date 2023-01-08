import styled from "styled-components/native";
import { seeNewPostFeed_seeNewPostFeed_user } from "../../__generated__/seeNewPostFeed";
import CaptionUserName from "./CaptionUserName";
import { useState } from "react";
import CaptionWithHashTag from "./CaptionWithHashTag";
import SeeAllCaptionBtn from "./SeeAllCaptionBtn";

const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: 8px;
  margin-left: 22px;
  position: relative;
  align-items: center;
  /* 높이가 안맞아서 어거지로 맞춤 */
  margin-top: -3px;
`;

type CaptionComponentProps = {
  user: seeNewPostFeed_seeNewPostFeed_user;
  caption: string;
  postId: number;
};


const CaptionComponent = ({user,caption,postId}:CaptionComponentProps) => {
  
  const userNameLength = user.userName.length;
  const captionLength = caption?.length ?? 0;
  const wholeStringLength = userNameLength + captionLength;
  const maxLength = 53;

  const [seeAllCaption,setSeeAllCaption] = useState(wholeStringLength < maxLength);

  if(!caption) return (
    <Container>
      <CaptionUserName user={user}/>
    </Container>
  );

  // 화면에 보여질 caption 너무 길면 자름
  const renderCaption = caption?.substring(0,maxLength-userNameLength-3);
  const splitCaptionArray = caption.split(" ");
  const splitRenderCaptionArray = renderCaption.split(" ");

  const splitCaptionArr = seeAllCaption ? splitCaptionArray : splitRenderCaptionArray;
  const lastSplitRenderCaptionIndex = seeAllCaption ? null :  splitRenderCaptionArray.length-1;
  const splitCaptionArrToLink = seeAllCaption ? null : splitCaptionArray;

  return (
    <Container>
      <CaptionWithHashTag
        splitCaptionArr={splitCaptionArr}
        user={user}
        postId={postId}
        lastSplitRenderCaptionIndex={lastSplitRenderCaptionIndex}
        splitCaptionArrToLink={splitCaptionArrToLink}
      />
      {!seeAllCaption && <SeeAllCaptionBtn setSeeAllCaption={setSeeAllCaption}/>}
    </Container>
  );
};

export default CaptionComponent;
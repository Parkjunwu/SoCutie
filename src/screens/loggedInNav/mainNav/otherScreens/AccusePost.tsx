// import React, { useEffect, useState } from "react";
// import { Alert, Keyboard, Platform, TouchableOpacity } from "react-native";
// import styled from "styled-components/native";
// import { Ionicons } from "@expo/vector-icons"
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import { colors } from "../../../../color";
import React from "react";
import { gql, useMutation } from "@apollo/client";
import { accusePost, accusePostVariables } from "../../../../__generated__/accusePost";
// import useIsDarkMode from "../../../../hooks/useIsDarkMode";
import AccuseLayout from "../../../../components/AccuseLayout";

const ACCUSE_POST = gql`
  mutation accusePost($id:Int!,$reason:Int!,$detail:String) {
    accusePost(id:$id,reason:$reason,detail:$detail) {
      ok
      error
    }
  }
`;

// const DismissKeyboardContainer = styled.TouchableWithoutFeedback`
//   flex: 1;
//   background-color: ${props=>props.theme.backgroundColor};
// `;
// const Container = styled.View`
//   background-color: ${props=>props.theme.backgroundColor};
//   flex: 1;
// `;
// const Title = styled.Text`
//   margin-top: 25px;
//   margin-bottom: 10px;
//   text-align: center;
//   color: ${props=>props.theme.textColor};
// `;
// const ReasonContainer = styled.TouchableOpacity`
//   border-bottom-width: 1px;
//   border-bottom-color: grey;
//   justify-content: space-between;
//   flex-direction: row;
//   padding: 8px 20px;
// `;
// const ReasonText = styled.Text<{isAndroid:boolean}>`
//   font-size: 20px;
//   color: ${props=>props.theme.textColor};
//   font-weight: ${props=>props.isAndroid ? 'bold' : 600};
// `;
// const DetailContainer = styled.View`
//   height: 120px;
//   border-bottom-color: grey;
//   border-bottom-width: 1px;
// `;
// const Detail = styled.TextInput`
//   color: ${props=>props.theme.textColor};
//   padding: 20px;
//   font-size: 18px;
// `;
// const SubmitContainer = styled.View`
//   flex-direction: row;
//   justify-content: space-between;
//   padding: 10px 100px;
// `;
// const SubmitBtn = styled.TouchableOpacity`
//   background-color: ${colors.yellow};
//   padding: 9px 20px;
//   border-radius: 5px;
// `;
// const SubmitBtnText = styled.Text<{isAndroid:boolean}>`
//   color:${colors.darkYellow};
//   font-weight: ${props=>props.isAndroid ? 'bold' : 600};
//   font-size: 15px;
// `;

// 문제 없으면 주석 다 지워도 됨.
const AccusePost = ({navigation,route}) => {

  const postId = route.params.postId;
  
  // useEffect(()=>{
  //   navigation.setOptions({
  //     headerLeft:({tintColor})=><TouchableOpacity onPress={()=>navigation.goBack()}>
  //       <Ionicons name="chevron-back" color={tintColor} size={30} />
  //     </TouchableOpacity>
  //   });
  // },[]);

  // const reasons = [
  //   "성적인 내용",
  //   "혐오스러운 내용",
  //   "사기, 거짓 정보",
  //   "지식 재산권 침해",
  //   "과도한 홍보성 내용",
  //   "기타"
  // ];

  // const [reasonIndex,setReasonIndex] = useState<number>(null);
  // const [detail,setDetail] = useState<string>("");

  // const onPressReason = (reason:string,index:number) => {
  //   Keyboard.dismiss();
  //   if(reason === "기타") {
  //     setReasonIndex(0);
  //   } else {
  //     setReasonIndex(index+1);
  //   }
  // };

  // // const darkModeSubscription = useColorScheme();
  // // const isDarkMode = darkModeSubscription === "dark";
  // const isDarkMode = useIsDarkMode();
  // const isAndroid = Platform.OS === "android"

  // const RenderReasonList = () => {
  //   return (
  //     <>
  //       {reasons.map((reason,index) => <ReasonContainer key={index} onPress={()=>onPressReason(reason,index)}>
  //         <ReasonText isAndroid={isAndroid}>{reason}</ReasonText>
  //         {(reasonIndex === index+1 || (reasonIndex === 0 && reason === "기타")) && <Ionicons name="ios-checkmark-sharp" size={22} color={isDarkMode?"white":"black"} />}
  //       </ReasonContainer>
  //       )}
  //     </>
  //   );
  // };

  // const [accusePost] = useMutation<accusePost,accusePostVariables>(ACCUSE_POST,{
  //   onCompleted:(data)=>{
  //     if(data.accusePost.ok) {
  //       Alert.alert("해당 포스팅에 대한 신고가 접수되었습니다.");
  //       navigation.goBack();
  //     }
  //   },
  // });

  const [accusePost] = useMutation<accusePost,accusePostVariables>(ACCUSE_POST);

  // const onPressSubmit = () => {
  //   if(reasonIndex === null) {
  //     return Alert.alert("신고하시는 이유 항목을 선택해 주세요.");
  //   }
  //   Alert.alert("작성한 내용으로 해당 게시물을 신고하시겠습니까?",null,[
  //     {
  //       text:"신고",
  //       onPress:async() => {
  //         await accusePost({
  //           variables:{
  //             id:route.params.postId,
  //             reason:reasonIndex,
  //             ...(detail && {detail}),
  //           },
  //         });
  //       },
  //     },
  //     {
  //       text:"취소",
  //       style:"cancel",
  //     }
  //   ]);
  // };

  // const onPressCancel = () => {
  //   Alert.alert("취소 하시겠습니까?",null,[
  //     {
  //       text:"예",
  //       onPress:async() => {
  //         navigation.goBack();
  //       }
  //     },
  //     {
  //       text:"아니오",
  //       style:"cancel",
  //     }
  //   ]);
    
  // };

  return (
    // <DismissKeyboardContainer
    //   onPress={() => Keyboard.dismiss()}
    //   accessible={false}
    // >
    //   <Container>
    //     <KeyboardAwareScrollView>
    //       <Title>신고하시는 이유를 선택해 주세요.</Title>
    //       <RenderReasonList/>
    //       <DetailContainer>
    //       <Detail
    //         placeholder="사유를 60자 이내로 작성해 주세요"
    //         placeholderTextColor={isDarkMode?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.4)"}
    //         autoCapitalize="none"
    //         autoCorrect={false}
    //         multiline={true}
    //         maxLength={60}
    //         numberOfLines={3}
    //         value={detail}
    //         onChangeText={(text)=>setDetail(text)}
    //       />
    //       </DetailContainer>
    //       <SubmitContainer>
    //         <SubmitBtn onPress={onPressSubmit}>
    //           <SubmitBtnText isAndroid={isAndroid}>제출</SubmitBtnText>
    //         </SubmitBtn>
    //         <SubmitBtn onPress={onPressCancel}>
    //           <SubmitBtnText isAndroid={isAndroid}>취소</SubmitBtnText>
    //         </SubmitBtn>
    //       </SubmitContainer>
    //     </KeyboardAwareScrollView>
    //   </Container>
    // </DismissKeyboardContainer>
    <AccuseLayout
      accuseFn={accusePost}
      accuseThingId={postId}
    />
  )
};

export default AccusePost;
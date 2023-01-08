// 문제 없으면 걍 삭제

// import { useEffect } from "react";
// import styled from "styled-components/native";
// import VideoView from "../../../../components/upload/VideoView";

// const EditCompleteBtn = styled.TouchableOpacity`
  
// `;
// const EditCompleteBtnText = styled.Text`
//   color: ${props=>props.theme.textColor};
//   font-weight: bold;
// `;

// const CheckEditVideo = ({navigation,route}) => {

//   console.log("route.params")
//   console.log(route.params)
//   const pureVideoFile = route.params.pureVideoFile;
//   const newVideoFile = route.params.newVideoFile;
//   const forIOSThumbNailUri = route.params.forIOSThumbNailUri;
  

//   const onPressEditComplete = () => {
//     navigation.navigate("UploadForm",{
//       pureVideoFile,
//       newVideoFile,
//       forIOSThumbNailUri,
//     });
//   };

//   useEffect(()=>{
//     navigation.setOptions({
//       headerRight:()=>(
//         <EditCompleteBtn onPress={onPressEditComplete}>
//           <EditCompleteBtnText>변경완료</EditCompleteBtnText>
//         </EditCompleteBtn>
//       )
//     });
//   },[]);

//   return (
//     <VideoView uri={newVideoFile} />
//   );
// };

// export default CheckEditVideo;
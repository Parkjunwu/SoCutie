import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import styled from "styled-components/native";
import { CommentsNavProps } from "../../../types/comment";

const NavigatePhotoBtn = styled.TouchableOpacity`

`;
const NavigatePhotoBtnText = styled.Text`
  color: ${props=>props.theme.textColor};
`;

// 헤더 우측에 포스팅 이동
const useHeaderRightNavigateToPostIfCommentId = (postId:number,commentId:number) => {
  
  const navigation = useNavigation<CommentsNavProps["navigation"]>();
  const navigateToPost = () => navigation.navigate("Photo",{
    photoId: postId
  });

  useEffect(()=>{
    if(commentId){
      navigation.setOptions({
        headerRight:()=>(
          <NavigatePhotoBtn onPress={navigateToPost}>
            <NavigatePhotoBtnText>포스팅 보기</NavigatePhotoBtnText>
          </NavigatePhotoBtn>
        )
      })
    }
  },[]);

};

export default useHeaderRightNavigateToPostIfCommentId;
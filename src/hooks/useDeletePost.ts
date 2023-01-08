import { gql, useMutation } from "@apollo/client";
import { Alert } from "react-native";
import { deletePost, deletePostVariables } from "../__generated__/deletePost";

const DELETE_POST = gql`
  mutation deletePost($id:Int!) {
    deletePost(id:$id) {
      ok
      error
    }
  }
`;

const useDeletePost = (postId:number) => {
  const [deletePost] = useMutation<deletePost,deletePostVariables>(DELETE_POST,{
    variables:{
      id:postId,
    },
    update:(cache,data)=>{
      if(data.data?.deletePost.ok){
        cache.evict({ id: `Post:${postId}` });
        // cache.gc();
        Alert.alert("삭제가 완료되었습니다.",null,[
          {
            text:"확인",
          }
        ]);
      } else if (data.data?.deletePost.error === "post not found") {
        Alert.alert("존재하지 않는 게시물입니다.","같은 오류가 지속적으로 발생 시 문의 주시면 감사드리겠습니다.",[
          {
            text:"확인",
          }
        ]);
      } else if (data.data?.deletePost.error === "Not authorized") {
        Alert.alert("다른 유저의 게시물을 삭제할 수 없습니다.",null,[
          {
            text:"확인",
          }
        ]);
      }
    }
  });

  return deletePost;
};

export default useDeletePost;
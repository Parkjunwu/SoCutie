import { gql, useMutation, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import CommentLayout from "../components/comment/CommentLayout";
import { FeedStackProps } from "../components/type";
import useMe from "../hooks/useMe";
import { createComment, createCommentVariables } from "../__generated__/createComment";
import { seeComments, seeCommentsVariables, seeComments_seeComments } from "../__generated__/seeComments";

const SEE_COMMENTS = gql`
  query seeComments($postId:Int!,$cursorId:Int) {
    seeComments(postId:$postId,cursorId:$cursorId) {
      id
      user{
        id
        userName
        avatar
      }
      payload
      createdAt
      isMine
      totalLikes
      totalCommentOfComments
      isLiked
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation createComment($payload: String!, $postId: Int!) {
    createComment(payload: $payload, postId: $postId) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  background-color: black;
  flex:1;
`;
const CommentFlatList = styled.FlatList`
  flex:10;
  /* background-color: yellow; */
`;
const CreateCommentContainer = styled.View`
  flex: 1;
  /* background-color: blue; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
`;
const CommentInput = styled.TextInput`
  padding: 10px;
  background-color: white;
  border-radius: 3px;
  width: 85%;
`;
const CreateCommentBtn = styled.TouchableOpacity`
  border-radius: 3px;
   background-color: red;
`;
const CreateCommentBtnText = styled.Text`
  padding: 10px;
  font-size: 15px;
`;

type Props = NativeStackScreenProps<FeedStackProps, 'Comments'>;

const Comments = ({navigation,route}:Props) => {
  const {data,refetch} = useQuery<seeComments,seeCommentsVariables>(SEE_COMMENTS,{
    variables:{
      postId:route.params.postId
    },
  });
  console.log(data)
  ///
  // useEffect(()=>{
  //   refetch();
  // },[])
  ///

  const [value,setValue] = useState("");
  console.log(value);

  const [createComment,{data:createCommentData}] = useMutation<createComment,createCommentVariables>(CREATE_COMMENT);

  const {data:meData} = useMe();
  const renderItem = ({item}:{item:seeComments_seeComments}) => {
    return <CommentLayout comment={item}/>;
  }
  const onPressCreateComment = () => {
    createComment({
      variables:{
        payload:value,
        postId:route.params.postId
      },
      // 댓글 올리고 나서 캐시 업로드
      update:(cache, mutationResult) => {
        if(mutationResult.data.createComment.ok){
          // 댓글 캐시 만들고. id 받아야 하나? 필요 없지 않나? refetch 할거면. 걍 랜덤으로 만들어
          const nowTime = new Date().getTime()
          const data = {
            id:nowTime,
            user:{
              id:meData.me.id,
              userName:meData.me.userName,
              avatar:meData.me.avatar,
            },
            payload:value,
            createdAt:nowTime,
            isMine:true,
            totalLikes:0,
            totalCommentOfComments:0,
            isLiked:false,
          }
          const result = cache.writeFragment({
            id: `Comment:${nowTime}`,
            fragment: gql`
              fragment MyTodo on Comment {
                id
                user{
                  id
                  userName
                  avatar
                }
                payload
                createdAt
                isMine
                totalLikes
                totalCommentOfComments
                isLiked
              }
            `,
            data,
          })
          // seeComments({"postId":36}) 음... 어떻게 넣어야 되나..
          // post 에 댓글 ref 넣어. seeComments 에 넣어야 되는건가?
          // const modifyResult = cache.modify({
          //   id:`ROOT_QUERY`,
          //   fields:{
          //     seeComments({"postId":36})(prev){
          //       return [...prev,result]
          //     }
          //   }
          // })
        }
      }
    });
  }
  return <Container>
    <CommentFlatList 
      data={data?.seeComments}
      renderItem={renderItem}
      // renderItem={({item})=><CommentLayout data={item}/>}
      keyExtractor={(item) => item.id+""}
      ListEmptyComponent={()=><View style={{justifyContent:"center",alignItems:"center"}}><Text style={{color:"white"}}>댓글이 없습니다.</Text></View>}
    />
    <CreateCommentContainer>
      <CommentInput placeholder="댓글을 작성해 주세요." value={value} onChangeText={(text)=>setValue(text)}/>
      <CreateCommentBtn onPress={onPressCreateComment}>
        <CreateCommentBtnText>작성</CreateCommentBtnText>
      </CreateCommentBtn>
    </CreateCommentContainer>
  </Container>;
}
export default Comments;
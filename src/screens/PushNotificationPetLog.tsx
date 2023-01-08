import { gql, useLazyQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ListRenderItem, useWindowDimensions } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import BodyText from "../components/petLog/BodyText";
import PetLogHeaderComponent from "../components/petLog/PetLogHeaderComponent";
import PetLogVideoOrImage from "../components/petLog/PetLogVideoOrImage";
import PushNotificationPetLogFooterComponent from "../components/pushNotificationPetLog/PushNotificationPetLogFooterComponent";
import PushNotificationPetLogListEmptyComponent from "../components/pushNotificationPetLog/PushNotificationPetLogListEmptyComponent";
import useIsDarkMode from "../hooks/useIsDarkMode";
import RootNavStackParamsList from "../types/rootNavStackParamsList";

const GET_NOTIFIED_PETLOG = gql`
  query getNotifiedPetLog(
    $petLogId:Int!
  ) {
    getNotifiedPetLog(
      petLogId:$petLogId
    ) {
      petLog {
        id
        user {
          id
          userName
          avatar
        }
        title
        body
        file
        createdAt
        # 얘네를 여기서 받아야 캐시 업데이트가 됨. route 로 받으면 받고 나서 업데이트 안됨.
        isMine
        likes
        commentNumber
        isLiked
      }
      error
    }
  }
`;

// UI 는 petLog 랑 비슷
const PushNotificationPetLog = ({navigation,route}:NativeStackScreenProps<RootNavStackParamsList,"PushNotificationPetLog">) => {

  const petLogId = route.params.petLogId;
  const commentId = route.params.commentId;
  const commentOfCommentId = route.params.commentOfCommentId;

  const [getNotifiedPetLog,{data:petLogData,loading,refetch:petLogRefetch}] = useLazyQuery(GET_NOTIFIED_PETLOG,{
    variables:{
      petLogId,
    },
    fetchPolicy:"network-only",
  });

  useEffect(()=>{
    if(!commentId){
      getNotifiedPetLog();
    }
  },[petLogId]);

  const { width:windowWidth } = useWindowDimensions();

  const isDarkMode = useIsDarkMode();

  const sortedData = petLogData && petLogData.getNotifiedPetLog.petLog.body.map((bodyString,index) => ({body:bodyString,file:petLogData.getNotifiedPetLog.petLog.file[index]}));

  const renderItem:ListRenderItem<{body?:string,file?:string}> = ({item}) => {
    const file = item.file;
    const body = item.body;
    const fileWidth = windowWidth - 20;
    return (
      <>
        {body !== "" && <BodyText>{body}</BodyText>}
        {file && <PetLogVideoOrImage uri={file} fileWidth={fileWidth} />}
      </>
    );
  };

  return (
    <KeyboardAwareFlatList
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "black" : "white",
        padding: 10,
      }}
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={(item,index)=>index+""}
        // ListFooterComponent 만 빼기 그래서 걍 다 props에 집어넣음
        ListEmptyComponent={
          <PushNotificationPetLogListEmptyComponent
            loading={loading}
            petLogRefetch={petLogRefetch}
          />
        }
        ListHeaderComponent={
          petLogData ?
            <PetLogHeaderComponent {...petLogData.getNotifiedPetLog.petLog}/>
          :
            null
        }
        // ListFooterComponent 를 따로 빼내면 게시물 보기 누를때 댓글이 날라감.
        ListFooterComponent={
          <PushNotificationPetLogFooterComponent
            petLogId={petLogId}
            commentId={commentId}
            commentOfCommentId={commentOfCommentId}
            {...petLogData?.getNotifiedPetLog.petLog}
          />
        }
    />
  );
};

export default PushNotificationPetLog;
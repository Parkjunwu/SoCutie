import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavStackParamsList from "../types/rootNavStackParamsList";
import useReadAllMessage from "./useReadAllMessage";

const useOnPressPushNotification = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavStackParamsList>>();
  
  const { readAllMessage } = useReadAllMessage();

  const notificationNavigate = (data) => {
    const channelId = data.channelId;
    console.log("channelId "+channelId);
    switch (channelId) {
      // RootNav 의 컴포넌트를 보여줄거임.
      case 'follow':
        return navigation.navigate("PushNotificationUser",{
          id: Number(data.userId),
          userName: data.userName
        });
      // case 'upload':
      case 'uploadPost':
      case 'postLike':
        return navigation.navigate("PushNotificationPost",{
          // photoId 를 보내야하는거 주의. data 는 postId 로 들어옴.
          photoId:Number(data.postId)
        });
      case 'postComment':
      case 'commentLike':
      case 'commentComment':
      case 'commentCommentLike':
        return navigation.navigate("PushNotificationComment",{
          postId: Number(data.postId),
          ...(data.commentId && {commentId: Number(data.commentId)}),
          ...(data.commentOfCommentId && {commentOfCommentId: Number(data.commentOfCommentId)})
        });


      case 'uploadPetLog':
      case 'petLogLike':
      case 'petLogComment':
      case 'petLogCommentLike':
      case 'petLogCommentComment':
      case 'petLogCommentCommentLike':
        return navigation.navigate("PushNotificationPetLog",{
          petLogId:Number(data.petLogId),
          // 아마 commentId 랑 commentOfCommentId 로 받을듯. petLogcommentId 로 받으면 변경
          ...(data.commentId && {commentId: Number(data.commentId)}),
          ...(data.commentOfCommentId && {commentOfCommentId: Number(data.commentOfCommentId)})
        });
        // 아 어차피 PetLog 로 가겠네 그럼 이렇게 보낼 필요가 없어
        // return navigation.navigate("PushNotificationPetLogComment",{
        //   petLogId: Number(data.petLogId),
        //   // 아마 commentId 랑 commentOfCommentId 로 받을듯. petLogcommentId 로 받으면 변경
        //   ...(data.commentId && {commentId: Number(data.commentId)}),
        //   ...(data.commentOfCommentId && {commentOfCommentId: Number(data.commentOfCommentId)})
        // });
      

      // message 는 현재 로그인 유저 확인. 글고 혹시 상대유저가 탈퇴한 경우도 체크해야할듯
      // 현재 HomeNav 에서 체크함.
      case 'message':
        const roomId = Number(data.roomId);
        // async 안해도 알아서 되겠지?
        readAllMessage({
          variables:{
            roomId
          }
        });
        return navigation.navigate("PushNotificationRoom",{
          id: Number(data.roomId),
          opponentUserName: data.senderUserName,
        });
      default:
        console.log("알 수 없는 체널입니다.");
        return "Unknown Channel";
    }
  };

  return notificationNavigate;
};

export default useOnPressPushNotification;
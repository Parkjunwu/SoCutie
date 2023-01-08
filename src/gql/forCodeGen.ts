import { gql } from "@apollo/client";

// 얘는 isNotFetchMore 만
const SEE_BLOCK_USERS = gql`
  query seeBlockUsers($cursorId:Int) {
    seeBlockUsers(cursorId:$cursorId) {
      cursorId
      hasNextPage
      users{
        id
        userName
        avatar
      }
      error
      isNotFetchMore @client
    }
  }
`;

const USER_NOTIFICATION_UPDATE = gql`
  subscription userNotificationUpdate {
    userNotificationUpdate {
      id
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload:String!,$roomId:Int,$userId:Int) {
    sendMessage(payload:$payload,roomId:$roomId,userId:$userId) {
      ok
      error
      roomId
    }
  }
`;

const ROOM_UPDATE = gql`
  subscription roomUpdate ($id:Int){
    roomUpdate (id:$id) {
      id
      payload
      user {
        id
        userName
        avatar
      }
      roomId
    }
  }
`;

export { USER_NOTIFICATION_UPDATE, SEE_BLOCK_USERS, SEND_MESSAGE_MUTATION, ROOM_UPDATE, }
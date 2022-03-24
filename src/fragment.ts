import { gql } from "@apollo/client";

export const ROOM_FRAGMENT = gql`
  fragment RoomParts on Room {
    id
    talkingTo {
      id
      userName
      avatar
    }
    lastMessage {
      id
      payload
      createdAt
    }
    unreadTotal
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    payload
    user{
      id
      userName
      avatar
    }
    read
    createdAt
    # roomId
  }
`;
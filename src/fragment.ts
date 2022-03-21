import { gql } from "@apollo/client";

export const ROOM_FRAGMENT = gql`
  fragment RoomParts on Room {
    id
    users {
      id
      userName
      avatar
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
  }
`;
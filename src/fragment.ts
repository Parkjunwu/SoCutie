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
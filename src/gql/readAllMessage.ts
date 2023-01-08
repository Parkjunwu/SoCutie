import { gql } from "@apollo/client";

const READ_ALL_MESSAGE = gql`
  mutation readAllMessage($roomId:Int!) {
    readAllMessage(roomId:$roomId) {
      ok
      numberOfRead
      error
    }
  }
`;

export default READ_ALL_MESSAGE;
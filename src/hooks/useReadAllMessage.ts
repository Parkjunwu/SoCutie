import { useMutation } from "@apollo/client";
import READ_ALL_MESSAGE from "../gql/readAllMessage";
import { readAllMessage, readAllMessageVariables } from "../__generated__/readAllMessage";

// 해당 방의 메세지 모두 읽음 처리

const useReadAllMessage = () => {
  const [readAllMessage] = useMutation<readAllMessage,readAllMessageVariables>(READ_ALL_MESSAGE,{
    update: (cache, data, { variables }) => {
      if(data.data.readAllMessage.ok) {
        cache.modify({
          id: "ROOT_QUERY",
          fields: {
            getNumberOfUnreadMessage(prev){
              return prev - data.data.readAllMessage.numberOfRead;
            },
          }
        });
        cache.modify({
          id: `Room:${variables.roomId}`,
          fields: {
            unreadTotal(){
              return 0;
            },
          }
        });
      }
    },
  });
  return { readAllMessage };
};

export default useReadAllMessage;
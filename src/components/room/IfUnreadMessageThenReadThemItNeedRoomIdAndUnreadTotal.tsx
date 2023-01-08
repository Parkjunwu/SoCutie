import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import READ_ALL_MESSAGE from "../../gql/readAllMessage";
import { readAllMessage, readAllMessageVariables } from "../../__generated__/readAllMessage";


// 안읽은 메세지 있으면 들어왔을 때 읽음 처리
const IfUnreadMessageThenReadThemItNeedRoomIdAndUnreadTotal = (roomId:number,unreadTotal:number) => {
  const [readAllMessage] = useMutation<readAllMessage,readAllMessageVariables>(READ_ALL_MESSAGE,{
    variables: {
      roomId,
    },
    update: (cache,data) => {
      if(data.data.readAllMessage.ok) {
        cache.modify({
          id: "ROOT_QUERY",
          fields: {
            getNumberOfUnreadMessage(prev){
              return prev - unreadTotal;
            },
          }
        });
        cache.modify({
          id: `Room:${roomId}`,
          fields: {
            unreadTotal(){
              return 0;
            },
          }
        });
      }
    },
  });
  useEffect(()=>{
    if(unreadTotal){
      readAllMessage();
    };
  },[]);
};

export default IfUnreadMessageThenReadThemItNeedRoomIdAndUnreadTotal;
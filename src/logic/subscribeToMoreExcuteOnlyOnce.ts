import { useEffect, useState } from "react";

// data 로 넣지 말고 data?.getRoomMessages 식으로 넣어야 함
const subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData = (wholeSubscribeToMoreFn,queryData) => {
  const [subscribed, setSubscribed] = useState(false)
  useEffect(()=>{
    if(queryData !== null && !subscribed){
      wholeSubscribeToMoreFn();
      setSubscribed(true);
    }
  },[queryData,subscribed])
};

export default subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData;




// 원래는 이거. 혹시 안되면 다시 써
// const [subscribed, setSubscribed] = useState(false)
// useEffect(()=>{
//   if(data?.getRoomMessages && !subscribed){
//     subscribeToMore({
//       document:ROOM_UPDATES,
//       variables:{
//         id:roomId
//       },
//       updateQuery,
//       onError:(err) => console.error("error is "+err),
//     });
//     setSubscribed(true);
//   }
// },[data,subscribed])
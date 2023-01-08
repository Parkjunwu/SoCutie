import { useEffect, useState } from "react";

// data 로 넣지 말고 data?.getRoomMessages 식으로 넣어야 함
const subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData = (wholeSubscribeToMoreFn,queryData) => {
  const [subscribed, setSubscribed] = useState(false)
  useEffect(()=>{
    // undefined 는 로그인 안했을 때 확인. null 은?
    if(queryData !== undefined && queryData !== null && !subscribed){
      wholeSubscribeToMoreFn();
      setSubscribed(true);
    }
  },[queryData,subscribed])
};

export default subscribeToMoreExecuteOnlyOnceNeedWholeSubscribeToMoreFnAndQueryData;
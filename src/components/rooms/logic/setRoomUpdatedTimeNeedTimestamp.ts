// setRoomUpdatedTime 보다 setMessageUpdatedTime 가 좋을라나?
// 최근 메세지 받은 시간 받음
const setRoomUpdatedTimeNeedTimestamp = (timestamp:string) => {
  // timestamp 형식에 따라 다르게 계산
  const date = new Date(timestamp.substring(timestamp.length-1, timestamp.length) === "Z" ? timestamp : Number(timestamp));

  const now = new Date()
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const nowDay = now.getDate();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if(nowYear === year && nowMonth === month && nowDay === day) {
    const transformHour = () => {
      const hour = date.getHours();
      if (hour === 0) {
        return "오전 12:"
      } else if (hour < 12) {
        return `오전 ${hour}:`
      } else {
        return `오후 ${hour-12}:`
      }
    };
    const minute = String(date.getMinutes()).padStart(2,"0");
    const transformedTime = transformHour()+minute;
    return transformedTime;
  } else if (nowYear !== year) {
    return `${year}.${month}.${day}`
  } else {
    return `${month}월 ${day}일`
  }
};

export default setRoomUpdatedTimeNeedTimestamp;
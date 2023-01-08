const getCreatedTimeAndDayByTimestamp = (timestamp:string) => {
  // timestamp 형식에 따라 다르게 계산
  const date = new Date(timestamp.substring(timestamp.length-1, timestamp.length) === "Z" ? timestamp : Number(timestamp));

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const createdDay = `${year}년 ${month}월 ${day}일`

  const transformHour = () => {
    const hour = date.getHours();
    if (hour === 0) {
      return "오전 12:"
    } else if (hour < 12) {
      return `오전 ${hour}:`
    } else if (hour === 12){
      return "오후 12:"
    } else {
      return `오후 ${hour-12}:`
    }
  };
  const minute = String(date.getMinutes()).padStart(2,"0");
  const transformedTime = transformHour()+minute;
  
  return { createdDay, transformedTime }
};

export default getCreatedTimeAndDayByTimestamp;
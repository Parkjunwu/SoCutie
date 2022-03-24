
export const setHasNextPageNeedTakeOnceLength = (takeOnceLength:number) => {
  let hasNextPage = true;
  const isFetchDataLengthLessThanTakeOnceLength = (fetchDataLength:number) => {
    // console.log(fetchDataLength);
    if(fetchDataLength !== takeOnceLength) {
      hasNextPage = false;
    };
    console.log("hasNextPage is "+hasNextPage);
    return hasNextPage;
  };
  return {hasNextPage,isFetchDataLengthLessThanTakeOnceLength};
};
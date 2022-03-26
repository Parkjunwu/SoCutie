import { Image } from "react-native";

// 지금은 Image.prefetch(url); 씀. 근데 너무 느려. 현재 Rooms 랑 MainNav 에 있음.

const cacheImage = async(url?:string) => {
  if(url){
    console.log("aa~")
    const result = await Image.prefetch(url);
    console.log("prefetchImage " +result);
  }
};

export default cacheImage;
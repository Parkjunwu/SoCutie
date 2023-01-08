import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import Swiper from "react-native-swiper";
import FastImage from 'react-native-fast-image';
import VideoWithScreenTouch from "./VideoWithScreenTouch";
import VideoWithScreenTouchNotFeed from "./VideoWithScreenTouchNotFeed";
import isImage from "../../logic/isImage";

type PhotoSwiperType = {
  fileUriArr: string[],
  isVideoPlayingPost: boolean,
  onPressVideo?: Function | null;
  isFeed: boolean;
};

const PhotoSwiper = ({fileUriArr,isVideoPlayingPost,onPressVideo,isFeed}:PhotoSwiperType) => {
  const {width} = useWindowDimensions();

  // const isImage = (uri:string) => {
  //   // 일단 확장자로 동영상인지 구분. 근데 이거는 여러개일 수 있어서 파일 타입이 video 인지로 구분해야 할듯. DB 에도 저장해야 함.
  //   const length = uri.length;
  //   const type = uri.substring(length-3,length);
  //   return type === "mp4" ? false : true;
  // };

  const [onScreenIndex,setOnScreenIndex] = useState(0);

  const onIndexChanged = (index: number) => {
    setOnScreenIndex(index);
  };

  // const isVideoPaused = (index:number) => {
  //   if(!isVideoPlayingPost) {
  //     return true;
  //   }
  //   return onScreenIndex !== index;
  // };

  return (
    <Swiper
      width={width}
      height={width}
      loop={false}
      // loadMinimal={true}
      // loadMinimalSize={2}
      onIndexChanged={onIndexChanged}
    >
      {/* {fileUriArr.map((uri,index) => <FastImage
        key={index}
        source={{
          uri,
          // 처음 이미지를 제일 먼저 받아
          priority: index === 0 ? FastImage.priority.high : FastImage.priority.low
        }}
        style={{ flex: 1 }}
      />)} */}
      {fileUriArr.map((uri,index) => 
        isImage(uri) ?
          <FastImage
            key={index}
            source={{
              uri,
              // 처음 이미지를 제일 먼저 받아
              priority: index === 0 ? FastImage.priority.high : FastImage.priority.low
            }}
            style={{ flex: 1 }}
          />
        :
          // <Video
          //   key={index}
          //   source={{uri}}
          //   style={{ flex: 1 }}
          //   // repeat={ true }
          //   paused={isVideoPaused(index)}
          //   resizeMode="contain"
          //   // muted={true}
          //   // onEnd={onEndVideo}
          // />
          isFeed ? <VideoWithScreenTouch
            key={index}
            isVideoPlayingPost={isVideoPlayingPost}
            uri={uri}
            index={index}
            onScreenIndex={onScreenIndex}
            onPressVideo={onPressVideo}
          /> : <VideoWithScreenTouchNotFeed 
            key={index}
            uri={uri}
            index={index}
            onScreenIndex={onScreenIndex}
          />
      )}
    </Swiper>
  )
}

export default PhotoSwiper;
    
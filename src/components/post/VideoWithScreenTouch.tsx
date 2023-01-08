import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import VideoIconWithDarkMode from '../video/VideoIconWithDarkMode';
import convertToProxyURL from 'react-native-video-cache';
// import { ProcessingManager } from 'react-native-video-processing';

const TouchContainer = styled.Pressable`
  position: relative;
  flex: 1;
`;

type VideoWithScreenTouchType = {
  isVideoPlayingPost:boolean;
  uri:string;
  index:number;
  onScreenIndex:number;
  onPressVideo: Function | null;
};

// 타입 없어서 걍 내가 넣음
// const AnimatedVideoIcon = Animated.createAnimatedComponent(VideoIconWithDarkMode);
const AnimatedVideoView = Animated.View;
const AnimatedPauseAndPlayIcon = Animated.View;

const VideoWithScreenTouch = ({isVideoPlayingPost,uri,index,onScreenIndex,onPressVideo:onPressVideoGotOnBaseFeed}:VideoWithScreenTouchType) => {

  // useEffect(()=>{
  //   ProcessingManager.getVideoInfo(uri)
  //     .then(videoInfo=>{
  //       console.log("videoInfo")
  //       console.log(videoInfo)
  //     });
  // },[]);

  const [paused,setPaused] = useState(true);

  useEffect(()=>{
    if(!isVideoPlayingPost) {
      return setPaused(true);
    }
    return setPaused(onScreenIndex !== index);
  },[isVideoPlayingPost,onScreenIndex])

  const pauseAndPlayIconOpacity = useRef(new Animated.Value(0)).current;

  const videoViewOpacity = pauseAndPlayIconOpacity.interpolate({
    inputRange:[0,0.7,1],
    outputRange:[1,1,0.7],
  });

  const videoIconOpacity = useRef(new Animated.Value(1)).current;

  // 얘는 useEffect 에 넣어야 맞게 작동
  useEffect(()=>{
    if(paused) {
      videoIconOpacity.setValue(1);
    } else {
      Animated.timing(videoIconOpacity,{
        toValue: 0,
        useNativeDriver:true,
        duration: 300,
        delay: 200,
      }).start();
    }
  },[paused])

  const runOpacityAnimation = () => {
    pauseAndPlayIconOpacity.setValue(1);
    Animated.timing(pauseAndPlayIconOpacity,{
      toValue:0,
      useNativeDriver:true,
      duration: 500,
    }).start();
  };

  const onPress = () => {
    onPressVideoGotOnBaseFeed();
    runOpacityAnimation();
    setPaused(prev=>{
      if(!isVideoPlayingPost) {
        return false;
      } else {
        return !prev;
      }
    });
  };
  
  const onEndVideo = () => {
    console.log("onEndVideo")
    setPaused(true);
  };

  // const onLoad = ({naturalSize}) => {
  //   console.log("uri")
  //   console.log(uri)
  //   console.log("naturalSize")
  //   console.log(naturalSize)
  // }
  return (
    <TouchContainer onPress={onPress} >
      {/* android 는 이래 쓰면 안되서 걍 Animated.View 에 넣음 */}
      {/* <AnimatedVideoIcon iconSize={25} top="2%" left="3%" style={{
        opacity: videoIconOpacity,
      }} /> */}
      <Animated.View style={{
        opacity: videoIconOpacity,
      }}>
        <VideoIconWithDarkMode iconSize={25} top="2%" left="3%" />
      </Animated.View>
      <AnimatedVideoView
        style={{
          opacity: videoViewOpacity,
          flex: 1,
        }}
      >
        <Video
          source={{ uri: convertToProxyURL(uri) }}
          style={{ flex: 1 }}
          repeat={ true }
          paused={ paused }
          // muted={true}
          resizeMode="contain"
          // onEnd 안드로이드 안됨.
          onEnd={ onEndVideo }
          // onLoad={onLoad}
        />
      </AnimatedVideoView>
      <AnimatedPauseAndPlayIcon
        style={{
          opacity: pauseAndPlayIconOpacity,
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={paused ? "ios-pause" : "ios-play"} size={70} color="white" />
      </AnimatedPauseAndPlayIcon>
    </TouchContainer>
  )
};

export default VideoWithScreenTouch;
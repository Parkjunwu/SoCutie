import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import VideoIconWithDarkMode from '../video/VideoIconWithDarkMode';
import convertToProxyURL from 'react-native-video-cache';
import { logoUriVar } from '../../apollo';

const TouchContainer = styled.Pressable`
  position: relative;
`;

type PetLogVideoWithScreenTouchType = {
  // isVideoPlayingPost:boolean;
  uri: string;
  // index:number;
  // onScreenIndex:number;
  // onPressVideo: Function | null;
  fileWidth: number;
};

// 타입 없어서 걍 내가 넣음
// const AnimatedVideoIcon = Animated.createAnimatedComponent(VideoIconWithDarkMode);
const AnimatedVideoView = Animated.View;
const AnimatedPauseAndPlayIcon = Animated.View;

const PetLogVideoWithScreenTouch = ({uri,fileWidth,}:PetLogVideoWithScreenTouchType) => {

  const [paused,setPaused] = useState(true);

  const [fileHeight,setImageHeight] = useState(fileWidth);

  const onLoadVideo = ({naturalSize: { height,width }}) => {
    // 걍 비디오 아이콘 보이게 80 뺏는데 
    const resizedHeight = (fileWidth) / width * height;
    setImageHeight(resizedHeight);
  };

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
    runOpacityAnimation();
    setPaused(prev=> !prev);
  };
  
  const onEndVideo = () => {
    setPaused(true);
  };

  return (
    <TouchContainer onPress={onPress} >
      {/* android 는 이래 쓰면 안되서 걍 Animated.View 에 넣음 */}
      {/* <AnimatedVideoIcon iconSize={25} top="2%" left="3%" style={{
        opacity: videoIconOpacity,
      }} /> */}
      <Animated.View style={{
        opacity: videoIconOpacity,
        zIndex: 1,
      }}>
        <VideoIconWithDarkMode iconSize={25} top={10} left="3%" />
      </Animated.View>
      <AnimatedVideoView
        style={{
          opacity: videoViewOpacity,
          flex: 1,
        }}
      >
        <Video
          source={{ uri: convertToProxyURL(uri) }}
          onLoad={onLoadVideo}
          style={{
            width: fileWidth,
            height: fileHeight,
          }}
          repeat={ true }
          paused={ paused }
          resizeMode="contain"
          onEnd={ onEndVideo }
          // 로딩중일때. 이미지밖에 안됨
          // fileHeight === 0 일때 loading 컴포넌트 이런 식으로 하면 얘의 onLoad 가 안되서 이래함.
          poster={logoUriVar()}
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

export default PetLogVideoWithScreenTouch;
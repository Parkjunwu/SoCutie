import React from "react";
import { useWindowDimensions } from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";

const File = styled.Image`
  flex: 1;
`;

const PhotoSwiper = ({fileUriArr}:{fileUriArr:string[]}) => {
  const {width} = useWindowDimensions();

  return (
    <Swiper width={width} height={width}>
      {fileUriArr.map((uri,index) => <File key={index} source={{uri}}/>)}
    </Swiper>
  )
}

export default PhotoSwiper;
    
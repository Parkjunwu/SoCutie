// import React, { useState } from "react";
// import { Image, useWindowDimensions } from "react-native";
// import styled from "styled-components/native";

// type ImageProp = {
//   width:number;
//   height:number;
// }

// const File = styled.Image<ImageProp>`
//   width: ${props => props.width}px;
//   height: ${props => props.height}px;
// `;

// const Photo = ({uri}:{uri:string}) => {
//   const {width:getWidth} = useWindowDimensions();
//   const [height,setHeight] = useState(getWidth)
//   Image.getSize(uri,(width,height)=>setHeight(getWidth*height/width),(error)=>console.error(error))

//   return <File source={{uri}} width={getWidth} height={height} resizeMode="contain"/>
// }

// export default Photo;




import React, { useEffect, useState } from "react";
import { Image, useWindowDimensions } from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";

type ImageProp = {
  width:number;
  height:number;
}

// const File = styled.Image<ImageProp>`
//   width: ${props => props.width}px;
//   height: ${props => props.height}px;
// `;
const File = styled.Image`
  flex: 1;
`;

const PhotoSwiper = ({fileUriArr}:{fileUriArr:string[]}) => {
  const {width:getWidth} = useWindowDimensions();
  const [height,setHeight] = useState(getWidth)
  // const [photoIndex,setPhotoIndex] = useState(0);
  // useEffect(() => {
    // Image.getSize(file[photoIndex],(width,height)=>setHeight(getWidth*height/width),(error)=>console.error(error))
  // },[photoIndex])
  // Image.getSize(uri,(width,height)=>setHeight(getWidth*height/width),(error)=>console.error(error))
  

  return (
    <Swiper width={getWidth} height={height}>
      {fileUriArr.map((uri,index) => <File key={index} source={{uri}}/>)}
    </Swiper>
  )
}

export default PhotoSwiper;
    
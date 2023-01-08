import { useEffect } from 'react';
import HeaderBackBtn from '../../../../components/me/loggedInUserView/aboutAccountNav/component/HeaderBackBtn';
import VideoView from '../../../../components/upload/VideoView';

const FullScreenVideo = ({navigation,route}) => {
  
  const uri:string = route.params.uri;
  const paramTitle = route.params.title;

  console.log("route")
  console.log(route)
  
  useEffect(()=>{
    const title = paramTitle ?? "선택한 동영상";
    navigation.setOptions({
      title:title,
      headerLeft:({tintColor})=><HeaderBackBtn tintColor={tintColor} />
    });
  },[route]);

  return (
    <VideoView uri={uri} />
  );
};

export default FullScreenVideo;
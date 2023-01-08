import { ProcessingManager } from 'react-native-video-processing';
import resizeImageNeedUriWidthHeight from './resizeImage';

const getOrResizeThumbNail = async(file:{uri:string,thumbNail?:string}) => {
  const uri = file.uri;
  const thumbNail = file.thumbNail;

  let result;

  if(thumbNail) {
    result = await resizeImageNeedUriWidthHeight(thumbNail,200,200);
  } else {
    result = (await ProcessingManager.getPreviewForSecond(
      uri,
      0,
      { width: 200, height: 200 }
      , "JPEG"
    )).uri;
  }
  
  return result;
};

export default getOrResizeThumbNail;
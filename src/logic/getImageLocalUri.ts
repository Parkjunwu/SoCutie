import { Asset } from 'expo-asset';
import image from '../image';

const getImageLocalUri = async(localImage:any) => {
  
  const [{ localUri }] = await Asset.loadAsync(localImage);

  return localUri as string;
};

const getLogoImageLocalUri = async() => {
  return await getImageLocalUri(image.logo);
};

const getNoUserImageLocalUri = async() => {
  return await getImageLocalUri(image.no_user);
};

// const getAvatarUri = async(avatar:string) => {
//   return avatar ? avatar : await getImageLocalUri(image.no_user);
// };

export { getLogoImageLocalUri, getNoUserImageLocalUri, };
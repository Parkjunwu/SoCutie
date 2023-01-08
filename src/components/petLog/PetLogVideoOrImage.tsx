import isImage from "../../logic/isImage";
import PetLogFastImageWithRealHeight from "./PetLogFastImageWithRealHeight";
import PetLogVideoWithScreenTouch from "./PetLogVideoWithScreenTouch";

type PetLogVideoOrImageProps = {
  uri: string;
  fileWidth: number;
}

const PetLogVideoOrImage = ({uri,fileWidth}:PetLogVideoOrImageProps) => {
  const isFileImage = isImage(uri);
  return (
    isFileImage ? 
      <PetLogFastImageWithRealHeight uri={uri} fileWidth={fileWidth} />
    :
      <PetLogVideoWithScreenTouch
        uri={uri}
        fileWidth={fileWidth}
      />
  );
};

export default PetLogVideoOrImage;
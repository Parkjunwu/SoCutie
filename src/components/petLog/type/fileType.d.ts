type FileInfo = {
  uri: string,
  isVideo: boolean,
  thumbNail?: string,
};

type CopiedFileInfo = {
  animatedIndex:boolean,
  isEditingFile?:boolean
} & FileInfo;

export { FileInfo, CopiedFileInfo };
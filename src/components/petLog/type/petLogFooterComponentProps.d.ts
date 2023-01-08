export type PetLogFooterComponentProps = {
  id: number;
  // userId: number;
  user: {
    id: number,
    userName: string,
    avatar: string,
  };
  isLiked: boolean;
  likes: number;
  commentNumber: number;
};
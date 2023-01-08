import { gql, useMutation } from "@apollo/client";
import { Alert } from "react-native";

const TOOGLE_PETLOG_LIKE = gql`
  mutation togglePetLogLike($id:Int!) {
    togglePetLogLike(id:$id) {
      ok
      error
    }
  }
`;

const useTogglePetLogLike = (petLogId:number) => {
  const [togglePetLogLike] = useMutation(TOOGLE_PETLOG_LIKE,{
    variables:{
      id:petLogId,
    },
    update:(cache,result) => {
      const resultData = result.data?.togglePetLogLike;
      const ok = resultData.ok;
      const error = resultData.error;
      if(result.data?.togglePetLogLike.ok) {
        const id = `PetLog:${petLogId}`;

        const prevPetLogCache: {isLiked:boolean,likes:number} =
        cache.readFragment({
          id,
          fragment: gql`
            fragment PrevPetLog on PetLog {
              isLiked
              likes
            }
          `
        });

        const prevLikes = prevPetLogCache.likes;
        const prevIsLiked = prevPetLogCache.isLiked;

        cache.modify({
          id,
          fields:{
            isLiked() {
              return !prevIsLiked;
            },
            likes() {
              return prevIsLiked ? prevLikes-1 : prevLikes+1;
            },
          },
        });
      } else {
        return Alert.alert(error);
      }
    },
  });

  return togglePetLogLike;
};

export default useTogglePetLogLike;
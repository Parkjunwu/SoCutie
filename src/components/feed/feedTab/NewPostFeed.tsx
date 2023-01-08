import { gql, useLazyQuery } from "@apollo/client";
import { seeNewPostFeed, seeNewPostFeedVariables } from "../../../__generated__/seeNewPostFeed";
import BaseFeed from "./feedBase/BaseFeed";

const SEE_FEED_QUERY = gql`
  query seeNewPostFeed($offset: Int!) {
    seeNewPostFeed(offset: $offset){
      id
      user{
        id
        userName
        avatar
      }
      file
      caption
      createdAt
      likes
      commentNumber
      isMine
      isLiked
      bestComment {
        id
        payload
        user {
          # id
          userName
          # avatar
        }
      }
    }
  }
`;

const NewPostFeed = ({setFeedOptions}:{setFeedOptions?:any}) => {

  const [seeNewPostFeed,{data,loading,refetch,fetchMore}] = useLazyQuery<seeNewPostFeed,seeNewPostFeedVariables>(SEE_FEED_QUERY,{
    variables:{
      offset:0
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: "cache-first",
  });
  console.log("seeNewPostFeed")

  return <BaseFeed data={data} loading={loading} refetch={refetch} fetchMore={fetchMore} setFeedOptions={setFeedOptions} />
};

export default NewPostFeed;
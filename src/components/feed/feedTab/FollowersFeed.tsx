import { gql, useLazyQuery } from "@apollo/client";
import { seeFollowersFeed, seeFollowersFeedVariables } from "../../../__generated__/seeFollowersFeed";
import BaseFeed from "./feedBase/BaseFeed";

const SEE_FEED_QUERY = gql`
  query seeFollowersFeed($offset: Int!) {
    seeFollowersFeed(offset: $offset){
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


const FollowersFeed = ({setFeedOptions}) => {

  const [seeFollowersFeed,{data,loading,refetch,fetchMore}] = useLazyQuery<seeFollowersFeed,seeFollowersFeedVariables>(SEE_FEED_QUERY,{
    variables:{
      offset:0
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: "cache-first",
  });
  console.log("FollowersFeed")

  return <BaseFeed data={data} loading={loading} refetch={refetch} fetchMore={fetchMore} setFeedOptions={setFeedOptions} />
};

export default FollowersFeed;
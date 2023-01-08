import { gql, useApolloClient } from "@apollo/client";

const getUnreadNumberOfNotificationOnCache = () => {
  const client = useApolloClient();
  
  const getUnreadNumberOnCache: {getNumberOfUnreadNotification:number} = client.cache.readFragment({
    id: "ROOT_QUERY",
    fragment: gql`
      fragment Number on Query {
        getNumberOfUnreadNotification
      }
    `
  });
  
  return getUnreadNumberOnCache?.getNumberOfUnreadNotification ?? 0;
}

export default getUnreadNumberOfNotificationOnCache;
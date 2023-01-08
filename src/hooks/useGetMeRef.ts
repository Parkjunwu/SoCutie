// import { gql } from "@apollo/client";
// import client from "../apollo";

// const useGetMeRef = () => {
//   const meRef:{me:{__ref}} = client.cache.readFragment({
//     id:"ROOT_QUERY",
//     fragment: gql`
//       fragment MeRef on Query {
//         me
//       }
//     `
//   });

//   return meRef.me;
// };

// export default useGetMeRef;

// codegen 걸림. 글고 지금은 쓸데 없어서 뺌.
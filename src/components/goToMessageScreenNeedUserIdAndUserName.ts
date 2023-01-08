import { gql, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { isAlreadyRoom, isAlreadyRoomVariables } from "../__generated__/isAlreadyRoom";

const IS_ALREADY_ROOM = gql`
  query isAlreadyRoom($userId:Int!){
    isAlreadyRoom(userId:$userId) {
      state
      room{
        id
        talkingTo{
          id
          userName
          avatar
        }
        unreadTotal
      }
    }
  }
`;

// // 해당 유저와의 방이 기존에 있는 지에 따라 TemporaryRoom 혹은 Room 으로 navigate
// export const goToMessageScreenNeedUserIdAndUserName = (userId:number,userName:string) => {
//   const navigation = useNavigation();
//   // 메세지 이동 할때 어디 Screen 으로 갈지 정하기 위함
//   const {data:isAlreadyRoomData} = useQuery<isAlreadyRoom,isAlreadyRoomVariables>(IS_ALREADY_ROOM,{
//     variables:{
//       userId,
//     }
//   });
  
//   console.log("isAlreadyRoomData");
//   console.log(isAlreadyRoomData);

//   const checkIsRoomThenNavigateOrAlertError = () => {
//     const state = isAlreadyRoomData.isAlreadyRoom.state;
//     const room = isAlreadyRoomData.isAlreadyRoom.room;
//     if(state === "NOT_HAVE") {
//       // 얘는 왜 자동완성 안되는지 모르겠음. 근데 됨.
//       navigation.push( "HomeNav", {
//         screen: 'Messages',
//         params: {
//           screen: 'TemporaryRoom',
//           params: {
//             userId,
//             userName,
//           }
//         }
//       });
//     } else if (state === "HAVE") {
//       navigation.push( "HomeNav", {
//         screen: 'Messages',
//         params: {
//           screen: 'Room',
//           params: {
//             id:room.id,
//             // talkingTo:room.talkingTo,
//             opponentUserName:room.talkingTo.userName,
//             unreadTotal:room.unreadTotal,
//           }
//         }
//       });
//     } else if (state === "NO_USER"){
//       Alert.alert("존재하지 않는 유저입니다.",null,[
//         {
//           text:"확인"
//         }
//       ]);
//     } else {
//       Alert.alert("잘못된 접근입니다.",null,[
//         {
//           text:"확인"
//         }
//       ]);
//     }
//   };
//   return { isAlreadyRoomData, checkIsRoomThenNavigateOrAlertError };
// };

export const profileGoToMessageScreenNeedUserIdAndUserName = (userId:number,userName:string) => {
  const navigation = useNavigation();
  // 메세지 이동 할때 어디 Screen 으로 갈지 정하기 위함
  const [isAlreadyRoom] = useLazyQuery<isAlreadyRoom,isAlreadyRoomVariables>(IS_ALREADY_ROOM,{
    variables:{
      userId,
    },
    fetchPolicy:"network-only",
    // 얘가 없으면 두번째부터 onCompleted 가 안됨. 트릭이라고는 하는데 일단 얘로
    notifyOnNetworkStatusChange: true,
    onCompleted:(data)=>{
      console.log("isAlreadyRoom")
      if(!data) {
        return Alert.alert("잘못된 접근입니다.","지속적으로 같은 문제 발생 시 문의 주시면 감사드리겠습니다.",[
          {
            text:"확인"
          }
        ]);
      }
      const state = data.isAlreadyRoom.state;
      const room = data.isAlreadyRoom.room;

      if(state === "NOT_HAVE") {
        // 얘는 왜 자동완성 안되는지 모르겠음. 근데 됨.
        navigation.push( "HomeNav", {
          screen: 'Messages',
          params: {
            screen: 'TemporaryRoom',
            params: {
              userId,
              userName,
            }
          }
        });
      } else if (state === "HAVE") {
        navigation.push( "HomeNav", {
          screen: 'Messages',
          params: {
            screen: 'Room',
            params: {
              id:room.id,
              // talkingTo:room.talkingTo,
              opponentUserName:room.talkingTo.userName,
              unreadTotal:room.unreadTotal,
            }
          }
        });
      } else if (state === "NO_USER"){
        Alert.alert("존재하지 않는 유저입니다.",null,[
          {
            text:"확인"
          }
        ]);
      } else {
        Alert.alert("잘못된 접근입니다.",null,[
          {
            text:"확인"
          }
        ]);
      }
    }
  });

  return isAlreadyRoom;
};



// navigation. push 아니고 navigate 씀. 얘는 messageNav 안이라서.
export const userListGoToMessageScreenNeedUserIdAndUserName = (userId:number,userName:string) => {
  const navigation = useNavigation();
  // 메세지 이동 할때 어디 Screen 으로 갈지 정하기 위함
  const [isAlreadyRoom] = useLazyQuery<isAlreadyRoom,isAlreadyRoomVariables>(IS_ALREADY_ROOM,{
    variables:{
      userId,
    },
    fetchPolicy:"network-only",
    // 얘가 없으면 두번째부터 onCompleted 가 안됨. 트릭이라고는 하는데 일단 얘로
    notifyOnNetworkStatusChange: true,
    onCompleted:(data)=>{
      if(!data) {
        return Alert.alert("잘못된 접근입니다.","지속적으로 같은 문제 발생 시 문의 주시면 감사드리겠습니다.",[
          {
            text:"확인"
          }
        ]);
      }
      const state = data.isAlreadyRoom.state;
      const room = data.isAlreadyRoom.room;

      if(state === "NOT_HAVE") {
        navigation.navigate("TemporaryRoom",{
          userId,userName
        });
      } else if (state === "HAVE") {
        navigation.navigate("Room",{
          id:room.id,
          talkingTo:room.talkingTo,
          unreadTotal:room.unreadTotal,
        });
      } else if (state === "NO_USER"){
        Alert.alert("존재하지 않는 유저입니다.",null,[
          {
            text:"확인"
          }
        ]);
      } else {
        Alert.alert("잘못된 접근입니다.",null,[
          {
            text:"확인"
          }
        ]);
      }
    }
  });

  return isAlreadyRoom;
};
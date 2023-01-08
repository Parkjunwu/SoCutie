import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import React from "react";
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { blockUser, blockUserVariables } from "../../../__generated__/blockUser";
import { unblockUser, unblockUserVariables } from "../../../__generated__/unblockUser";
import BLOCK_USER from "../../../gql/blockUser";
import UN_BLOCK_USER from "../../../gql/unblockUser";

const blockDropdown = [
  {
    value: '차단',
  }
];
const unblockDropdown = [
  {
    value: '차단 해제',
  }
];

const BlockUserDropdown = ({userId,tintColor,isBlock}) => {

  const updateBlockUser: MutationUpdaterFunction<blockUser,blockUserVariables, DefaultContext, ApolloCache<any>>= (cache,result) => {
    const ok = result.data?.blockUser.ok;
    const beforeUnreadTotal = result.data?.blockUser.beforeUnreadTotal;
    if(ok) {
      const cacheId = `isBlockUser({"id":${userId}})`;
      cache.modify({
        id:"ROOT_QUERY",
        fields:{
          [cacheId](){
            return true;
          },
        },
      });
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          getNumberOfUnreadMessage(prev){
            return prev - beforeUnreadTotal;
          },
        }
      });
    }
  };

  const updateUnblockUser: MutationUpdaterFunction<unblockUser,unblockUserVariables, DefaultContext, ApolloCache<any>>= (cache,result) => {
    const ok = result.data?.unblockUser.ok;
    if(ok) {
      const cacheId = `isBlockUser({"id":${userId}})`;
      cache.modify({
        id:"ROOT_QUERY",
        fields:{
          [cacheId](){
            return false;
          },
        },
      });
    }
  };

  const [blockUser] = useMutation<blockUser,blockUserVariables>(BLOCK_USER,{
    variables:{
      id:userId,
    },
    update:updateBlockUser
  });

  const [unblockUser] = useMutation<unblockUser,unblockUserVariables>(UN_BLOCK_USER,{
    variables:{
      id:userId,
    },
    update:updateUnblockUser
  });

  const onChangeText = (value: string, index: number, data: any) => {
    if (value === "차단") {
      Alert.alert("해당 유저를 차단하시겠습니까?","상대방은 차단 여부를 알 수 없으며 메세지를 받을 수 없습니다.",[
        {
          text:"차단",
          onPress:async() => {
            await blockUser();
          }
        },
        {
          text:"취소",
          style:"cancel",
        }
      ]);
    } else if (value === "차단 해제") {
      Alert.alert("해당 유저를 차단 해제하시겠습니까?","해당 유저로부터 메세지를 받을 수 있습니다.",[
        {
          text:"해제",
          onPress:async() => {
            await unblockUser();
          }
        },
        {
          text:"취소",
          style:"cancel",
        }
      ]);
    }
  };

  const renderBase = () => {
    return <View style={{left:5}}>
      <Ionicons name="ellipsis-vertical-outline" size={24} color={tintColor} />
    </View>
  }
  // const isBlock = isBlockUserData?.isBlockUser;
  return (
    <Dropdown
      data={isBlock ? unblockDropdown : blockDropdown}
      pickerStyle={{borderRadius:10,width:isBlock ? 90 : 60}}
      renderBase={renderBase}
      dropdownOffset={{left:isBlock ? -35 : -5,top:5}} 
      onChangeText={onChangeText}
    />
  )
};
 export default BlockUserDropdown;
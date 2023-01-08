import { useQuery } from "@apollo/client";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { seeProfile, seeProfileVariables } from "../../__generated__/seeProfile";
import { FeedStackProps } from "../type";
import BaseLayout from "./BaseLayout";
import SEE_PROFILE from "./logic/seeProfile";

type Props = {
  route: RouteProp<FeedStackProps, 'Profile'>,
}

const ProfileForNotLogInUser = ({route}:Props) => {
  const {data:userData,refetch} = useQuery<seeProfile,seeProfileVariables>(SEE_PROFILE,{
    variables:{
      id:route.params.id
    },
  });

  const userName = route.params.userName;
  const navigation = useNavigation();

  // 헤더에 이름 넣음
  useEffect(()=>{
    navigation.setOptions({
      title:`${userName} 님의 프로필`,
    });
  },[]);

  useEffect(()=>{
    refetch();
  },[]);

  return <BaseLayout userData={userData} />
};

export default ProfileForNotLogInUser;
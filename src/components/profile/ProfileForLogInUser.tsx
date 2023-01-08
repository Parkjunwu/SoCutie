import { useQuery } from "@apollo/client";
import { RouteProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import { seeProfile, seeProfileVariables } from "../../__generated__/seeProfile";
import { FeedStackProps } from "../type";
import BaseLayout from "./BaseLayout";
import ComponentForLogIn from "./ComponentForLogIn";
import SEE_PROFILE from "./logic/seeProfile";

type Props = {
  route:RouteProp<FeedStackProps, 'Profile'>,
}

const ProfileForLogInUser = ({route}:Props) => {
  console.log("route")
  console.log(route)
  const userId = route.params.id;
  const userName = route.params.userName;

  const {data:userData,refetch} = useQuery<seeProfile,seeProfileVariables>(SEE_PROFILE,{
    variables:{
      id:userId,
    },
  });

  useEffect(()=>{
    refetch();
  },[]);
  
  return <BaseLayout userData={userData} >
    <ComponentForLogIn userId={userId} userName={userName} userData={userData} />
  </BaseLayout>
};

export default ProfileForLogInUser;
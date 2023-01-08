import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FeedStackProps } from "../../../../components/type";
import { isLoggedInVar } from "../../../../apollo";
import ProfileForLogInUser from "../../../../components/profile/ProfileForLogInUser";
import ProfileForNotLogInUser from "../../../../components/profile/ProfileForNotLogInUser";

type Props = NativeStackScreenProps<FeedStackProps, 'Profile'>;

const Profile = ({route}:Props) => {

  const isLoggedIn = isLoggedInVar();

  return (
    isLoggedIn ?
      <ProfileForLogInUser route={route} />
    :
      <ProfileForNotLogInUser route={route} />
  )
}
export default Profile;
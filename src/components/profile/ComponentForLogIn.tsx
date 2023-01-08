import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";
import FOLLOW_USER from "../../gql/followUser";
import UNFOLLOW_USER from "../../gql/unfollowUser";
import { followUser, followUserVariables } from "../../__generated__/followUser";
import { unfollowUser, unfollowUserVariables } from "../../__generated__/unfollowUser";
import { profileGoToMessageScreenNeedUserIdAndUserName } from "../goToMessageScreenNeedUserIdAndUserName";
import { Feather } from "@expo/vector-icons"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FeedStackProps } from "../type";
import { seeProfile } from "../../__generated__/seeProfile";
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { isBlockUser, isBlockUserVariables } from "../../__generated__/isBlockUser";
import BlockUserDropdown from "./componentForLogIn/BlockUserDropdown";
import useMe from "../../hooks/useMe";

const FollowBtn = styled.TouchableOpacity`
  padding: 5px 0px;
  width: 100%;
  background-color: ${colors.blue};
  border-radius: 3px;
`;
const FollowBtnText = styled.Text`
  text-align: center;
  color: white;
  font-weight: 700;
`;

type Props = NativeStackScreenProps<FeedStackProps, 'Profile'>;

type ComponentForLogInProps = {
  userId: number,
  userName: string,
  userData: seeProfile,
};

const IS_BLOCK_USER = gql`
  query isBlockUser($id:Int!) {
    isBlockUser(id:$id)
  }
`;

const ComponentForLogIn = ({userId,userName,userData}:ComponentForLogInProps) => {

  const navigation = useNavigation<Props["navigation"]>();

  // 방이 있는지에 따라 TemporaryRoom 혹은 Room 으로, 에러시 alert 도 함.
  const isAlreadyRoom = profileGoToMessageScreenNeedUserIdAndUserName(userId,userName);

  const {data:isBlockUserData} = useQuery<isBlockUser,isBlockUserVariables>(IS_BLOCK_USER,{
    variables:{
      id:userId,
    },
  });

  const isBlock = isBlockUserData?.isBlockUser;

  const headerRight = ({tintColor}: HeaderButtonProps) => (
    userData.seeProfile.user.isMe ? null : <>
      {!isBlock && <TouchableOpacity onPress={()=>{
        isAlreadyRoom()}}>
        <Feather name="send" size={24} color={tintColor} />
      </TouchableOpacity>}
      {/* BlockUserDropdown 에서 isBlock 캐시 변경함. */}
      <BlockUserDropdown tintColor={tintColor} userId={userId} isBlock={isBlock} />
    </>
  );
  
  // 헤더 오른쪽에 메세지 navigate, 차단버튼 지정
  useEffect(()=>{
    if(userData){
      navigation.setOptions({
        headerRight,
        title: userData.seeProfile.user.isMe ? "내 프로필" : `${userName} 님의 프로필`,
      });
    }
  },[userData,isBlockUserData]);

  const {data:meData} = useMe();

  // 팔로우 언팔로우
  const [followUser,{loading:followUserLoading}] = useMutation<followUser,followUserVariables>(FOLLOW_USER);
  const [unfollowUser,{loading:unfollowUserLoading}] = useMutation<unfollowUser,unfollowUserVariables>(UNFOLLOW_USER);

  // 팔로우, 언팔로우 / 유저 자신이면 프로필 변경으로 넘어감
  const onPressFollowOrEditProfile = async() => {
    // 로딩중일 때는 그냥 넘어감
    if(followUserLoading || unfollowUserLoading) return;

    const postUserId = `User:${userId}`;
    const meUserId = `User:${meData?.me.id}`;

    // 유저 본인이면 프로필 변경 화면으로 이동
    if(userData?.seeProfile?.user?.isMe){
      navigation.navigate("EditProfile")

    // 팔로잉 이미 한 사람일 경우
    } else if (userData?.seeProfile?.user?.isFollowing) {
      // 언팔로우 실행
      await unfollowUser({
        variables:{
          id:userId
        },
        // 캐시 변경
        update:(cache,result) => {
          const ok = result.data?.unfollowUser?.ok;
          if(ok) {
            
            cache.modify({
              id:postUserId,
              fields:{
                isFollowing(prev) {
                  return !prev;
                },
                totalFollowers(prev) {
                  return prev-1;
                },
              },
            });
            
            cache.modify({
              id:meUserId,
              fields:{
                totalFollowing(prev) {
                  return prev-1;
                },
              },
            });

          }
        }
      });
      
    // 팔로잉 안 한 사람일 경우
    } else {
      await followUser({
        variables:{
          id:userId
        },
        // 캐시 변경
        update:(cache,result) => {
          const ok = result.data?.followUser?.ok;
          if(ok) {
            
            cache.modify({
              id:postUserId,
              fields:{
                isFollowing(prev) {
                  return !prev;
                },
                totalFollowers(prev) {
                  return prev+1;
                },
              },
            });

            cache.modify({
              id:meUserId,
              fields:{
                totalFollowing(prev) {
                  return prev+1;
                },
              },
            });
            
          }
        }
      });
    }
  };


  return (
    <FollowBtn onPress={onPressFollowOrEditProfile}>
      <FollowBtnText>{userData?.seeProfile?.user?.isMe? "프로필 편집" : userData?.seeProfile?.user?.isFollowing ? "팔로우 해제" : "팔로우 하기"}</FollowBtnText>
    </FollowBtn>
  );
};
export default ComponentForLogIn;
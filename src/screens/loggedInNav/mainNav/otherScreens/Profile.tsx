import { gql, useMutation, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Image, ListRenderItem, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../../../color";
import { FeedStackProps } from "../../../../components/type";
import { followUser, followUserVariables } from "../../../../__generated__/followUser";
import { seeProfile, seeProfileVariables, seeProfile_seeProfile_posts_post } from "../../../../__generated__/seeProfile";
import { unfollowUser, unfollowUserVariables } from "../../../../__generated__/unfollowUser";

const SEE_PROFILE = gql`
  query seeProfile($id:Int!,$cursorId:Int){
    seeProfile(id:$id){
      id
      userName
      bio
      avatar
      totalFollowing
      totalFollowers
      isFollowing
      isMe
      posts(
        cursorId:$cursorId
      ){
        post{
          id
          file
        }
        cursorId
      }
    }
  }
`;

const FOLLOW_USER = gql`
  mutation followUser($id: Int!) {
    followUser(id: $id){
      ok
      error
    }
  }
`;

const UNFOLLOW_USER = gql`
  mutation unfollowUser($id: Int!) {
    unfollowUser(id: $id){
      ok
      error
    }
  }
`;

const Container = styled.View`
  background-color: ${props => props.theme.backgroundColor};
  flex:1;
`;
const UserInformationContainer = styled.View`

`;
const UpperContainer = styled.View`
  flex-direction: row;
`;
const LeftContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Avatar = styled.Image`
  height: 80px;
  width: 80px;
  border-radius: 40px;
  margin: 20px 0px;
`;
const RightContainer = styled.View`
  flex: 2;
`;
const UserNameContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const UserName = styled.Text`
  color:${props => props.theme.textColor};
  text-align: center;
  font-weight: 600;
  font-size: 18px;
`;
const FollowContainer = styled.View`
  width: 100%;
  flex:1;
  flex-direction: row;
`;
const FollowLink = styled.TouchableOpacity`
  align-items: center;
  flex:1;
`;
const FollowText = styled.Text`
  color:${props => props.theme.textColor};
  font-weight: 600;
  font-size: 19px;
`;
const TotalFollower = styled(FollowText)``;
const TotalFollowing = styled(FollowText)``;
const FollowInfoText = styled.Text`
  color:${props => props.theme.textColor};
  font-size: 15px;
`;
const FollowBtnContainer = styled.View`
  flex:1;
  justify-content: center;
`;
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
const LowerContainer = styled.View`
`;
const Bio = styled.Text`
  color:${props => props.theme.textColor};
  text-align: center;
  padding: 5px 10px 20px 10px;
  font-size: 20px;
`;
const PostContainer = styled.FlatList`
  flex:1;
`;
type Props = NativeStackScreenProps<FeedStackProps, 'Profile'>;

const Profile = ({navigation, route}:Props) => {
  // ????????? ?????? ??????
  useEffect(()=>{
    if(route?.params?.userName) {
      navigation.setOptions({
        title:route.params.userName,
      })
    }
  },[]);
  // ????????? ?????????
  const {data,refetch,fetchMore} = useQuery<seeProfile,seeProfileVariables>(SEE_PROFILE,{
    variables:{
      id:route?.params?.id
    }
  });
  // ????????? ????????????
  const [followUser,{data:followUserData,loading:followUserLoading}] = useMutation<followUser,followUserVariables>(FOLLOW_USER);
  const [unfollowUser,{data:unfollowUserData,loading:unfollowUserLoading}] = useMutation<unfollowUser,unfollowUserVariables>(UNFOLLOW_USER);
  
  // ?????? ??? ?????? ????????? ?????? ??????
  const numColumns = 3;
  // ?????? ?????? ??????
  const {width} = useWindowDimensions();
  // ????????? ?????? ??????/??????
  const imageWidth = width/numColumns;

  // ?????????, ???????????? / ?????? ???????????? ????????? ???????????? ?????????
  const onPressFollowOrEditProfile = async() => {
    // ???????????? ?????? ?????? ?????????
    if(followUserLoading || unfollowUserLoading) return;

    // ?????? ???????????? ????????? ?????? ???????????? ??????
    if(data?.seeProfile?.isMe){
      navigation.navigate("EditProfile")

    // ????????? ?????? ??? ????????? ??????
    } else if (data?.seeProfile?.isFollowing) {
      // ???????????? ??????
      const result = await unfollowUser({
        variables:{
          id:route?.params?.id
        },
        // ?????? ??????
        update:(cache,result) => {
          const ok = result.data?.unfollowUser?.ok;
          if(ok) {
            const postId = `User:${route?.params?.id}`;
            cache.modify({
              id:postId,
              fields:{
                isFollowing(prev) {
                  return !prev;
                },
                totalFollowing(prev) {
                  return prev-1;
                }
              }
            });
          }
        }
      });
      
    // ????????? ??? ??? ????????? ??????
    } else {
      const result = await followUser({
        variables:{
          id:route?.params?.id
        },
        // ?????? ??????
        update:(cache,result) => {
          const ok = result.data?.followUser?.ok;
          if(ok) {
            const postId = `User:${route?.params?.id}`;
            cache.modify({
              id:postId,
              fields:{
                isFollowing(prev) {
                  return !prev;
                },
                totalFollowing(prev) {
                  return prev+1;
                }
              }
            });
          }
        }
      });
    }
  };

  const renderItem:ListRenderItem<seeProfile_seeProfile_posts_post> = ({item}) => {
    return (
      <TouchableOpacity onPress={()=>navigation.navigate("Photo",{photoId:item.id})}>
        <Image source={{uri:item.file[0]}} style={{width:imageWidth,height:imageWidth}}/>
      </TouchableOpacity>
    );
  };
  
  return (
    <Container>
    <UserInformationContainer>
      <UpperContainer>
        <LeftContainer>
          <Avatar source={data?.seeProfile?.avatar?{uri:data.seeProfile.avatar}:require("../../../../../assets/no_user.png")}/>
        </LeftContainer>
        <RightContainer>
          <UserNameContainer>
            <UserName>{data?.seeProfile?.userName}</UserName>
          </UserNameContainer>
          <FollowContainer>
          <FollowLink>
            <FollowInfoText>Follower</FollowInfoText>
            <TotalFollower>{data?.seeProfile?.totalFollowers}</TotalFollower>
          </FollowLink>
          <FollowLink>
            <FollowInfoText>Following</FollowInfoText>
            <TotalFollowing>{data?.seeProfile?.totalFollowing}</TotalFollowing>
          </FollowLink>
          </FollowContainer>
          <FollowBtnContainer>
            <FollowBtn onPress={onPressFollowOrEditProfile}>
              <FollowBtnText>{data?.seeProfile?.isMe? "????????? ??????" : data?.seeProfile?.isFollowing ? "????????? ??????" : "????????? ??????"}</FollowBtnText>
            </FollowBtn>
          </FollowBtnContainer>
        </RightContainer>
      </UpperContainer>
      <LowerContainer>
        <Bio>{data?.seeProfile?.bio}aaa</Bio>
      </LowerContainer>
    </UserInformationContainer>
    <PostContainer
      data={data?.seeProfile?.posts.post}
      renderItem={renderItem}
      keyExtractor={(item:seeProfile_seeProfile_posts_post)=>item.id + ""}
      numColumns={numColumns}
    />
  </Container>
  )
}
export default Profile;
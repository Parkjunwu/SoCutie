import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Image, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { colors } from "../color";
import { MeStackProps } from "../components/type";
import useMe from "../hooks/useMe";

const Container = styled.View`
  background-color: black;
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
  color:white;
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
  color:white;
  font-weight: 600;
  font-size: 19px;
`;
const TotalFollower = styled(FollowText)``;
const TotalFollowing = styled(FollowText)``;
const FollowInfoText = styled.Text`
  color:white;
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
  color:white;
  text-align: center;
  padding: 5px 10px 20px 10px;
  font-size: 20px;
`;
const PostContainer = styled.FlatList`
  flex:1;
`;

type Prop = NativeStackScreenProps<MeStackProps,"Me">

// Profile.tsx 랑 합치는 게 나을듯

const Me = ({navigation,route}:Prop) => {
  const {data,fetchMore} = useMe();
  useEffect(()=>{
    if(data?.me?.userName){
      navigation.setOptions({
        title:data.me.userName
      })
    }
  },[])
  console.log(data.me.posts.post);
  const numColumns = 3;
  const {width} = useWindowDimensions();
  // 각각의 사진 높이/넓이
  const imageWidth = width/numColumns;

  const onPressEditProfile = () => {
    navigation.navigate("EditProfile")
  };
  const onPressFollowers = () => {
    navigation.navigate("Followers",{userId:data.me.id});
  };
  const onPressFollowing = () => {
    navigation.navigate("Following",{userId:data.me.id});
  };
  return <Container>
    <UserInformationContainer>
      <UpperContainer>
        <LeftContainer>
          <Avatar source={data.me.avatar?{uri:data.me.avatar}:require("../../assets/no_user.png")}/>
        </LeftContainer>
        <RightContainer>
          <UserNameContainer>
            <UserName>{data.me.userName}</UserName>
          </UserNameContainer>
          <FollowContainer>
          <FollowLink onPress={onPressFollowers}>
            <FollowInfoText>Follower</FollowInfoText>
            <TotalFollower>{data.me.totalFollowers}</TotalFollower>
          </FollowLink>
          <FollowLink onPress={onPressFollowing}>
            <FollowInfoText>Following</FollowInfoText>
            <TotalFollowing>{data.me.totalFollowing}</TotalFollowing>
          </FollowLink>
          </FollowContainer>
          <FollowBtnContainer>
            <FollowBtn onPress={onPressEditProfile}>
              <FollowBtnText>프로필 편집</FollowBtnText>
            </FollowBtn>
          </FollowBtnContainer>
        </RightContainer>
      </UpperContainer>
      <LowerContainer>
        <Bio>{data.me.bio}aaa</Bio>
      </LowerContainer>
    </UserInformationContainer>
    <PostContainer
      data={data.me.posts.post}
      renderItem={({item})=><TouchableOpacity><Image source={{uri:item.file[0]}} style={{width:imageWidth,height:imageWidth}}/></TouchableOpacity>}
      keyExtractor={(item)=>item.id + ""}
      numColumns={numColumns}
    />
  </Container>;
}
export default Me;
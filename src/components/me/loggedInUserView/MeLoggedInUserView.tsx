import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import FastImage from 'react-native-fast-image'
import { colors } from "../../../color";
import { MeStackProps } from "../../type";
import useMe from "../../../hooks/useMe";
import HamburgerBtn from "../HamburgerBtn";
import { noUserUriVar } from "../../../apollo";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import useIsDarkMode from "../../../hooks/useIsDarkMode";
import { isAndroid } from "../../../utils";
import PetLogFlatList from "./aboutAccountNav/component/PetLogFlatList";
import PostFlatList from "./aboutAccountNav/component/PostFlatList";

const Container = styled.View`
  background-color: ${props => props.theme.backgroundColor};
  flex: 1;
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
const RightContainer = styled.View`
  flex: 2;
  margin-right: 10px;
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
  font-size: 16px;
`;
const FollowContainer = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
`;
const FollowLink = styled.TouchableOpacity`
  align-items: center;
  flex:1;
`;
const FollowText = styled.Text<{isAndroid:boolean}>`
  color:${props => props.theme.textColor};
  font-weight: 600;
  font-size: ${props=>props.isAndroid ? "15px" : "19px"};
`;
const TotalFollower = styled(FollowText)``;
const TotalFollowing = styled(FollowText)``;
const FollowInfoText = styled.Text<{isAndroid:boolean}>`
  color:${props => props.theme.textColor};
  font-size: ${props=>props.isAndroid ? "14px" : "15px"};
  margin-bottom: ${props=>props.isAndroid ? "0px" : "2px"};
`;
const FollowBtnContainer = styled.View`
  flex: 1;
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
  margin-bottom: 4px;
`;
const Bio = styled.Text`
  color:${props => props.theme.textColor};
  padding: 0px 10px 5px 20px;
  font-size: 15px;
`;
const TabTitle = styled.Text<{isAndroid:boolean,color:string}>`
  font-weight: ${props=>props.isAndroid ? 'bold' : 600};
  color: ${props=>props.color};
`;
// const NavContainer = styled.View`
//   flex: 1;
//   background-color: yellow;
// `;

const Tab = createMaterialTopTabNavigator();

type Prop = NativeStackScreenProps<MeStackProps,"Me">

// Profile.tsx 랑 합치는 게 나을듯

const MeLoggedInUserView = ({navigation}:Prop) => {

  useEffect(()=>{
    navigation.setOptions({
      headerTitleAlign:"center",
      headerRight:({tintColor})=><HamburgerBtn tintColor={tintColor}/>
    })
  },[]);

  const {data:meData} = useMe();

  useEffect(()=>{
    navigation.setOptions({
      title:"내 프로필",
      ...(isAndroid && {
        headerTitleStyle: {
          fontSize: 15,
          fontWeight: "bold",
        },
      }),
    });
  },[]);

  const onPressEditProfile = () => {
    navigation.navigate("EditProfile");
  };
  const onPressFollowers = () => {
    navigation.navigate("Followers",{userId:meData.me.id});
  };
  const onPressFollowing = () => {
    navigation.navigate("Following",{userId:meData.me.id});
  };

  const isDarkMode = useIsDarkMode();

  return (
    <Container>
      <UserInformationContainer>
        <UpperContainer>
          <LeftContainer>
            <FastImage
              style={{
                height: 80,
                width: 80,
                borderRadius: 40,
                marginVertical: 20,
                marginHorizontal: 0,
              }}
              source={{
                uri: meData?.me.avatar ? meData.me.avatar : noUserUriVar()
              }}
            />
          </LeftContainer>
          <RightContainer>
            <UserNameContainer>
              <UserName>{meData?.me.userName}</UserName>
            </UserNameContainer>
            <FollowContainer>
              <FollowLink onPress={onPressFollowers}>
                <FollowInfoText isAndroid={isAndroid} >팔로워</FollowInfoText>
                <TotalFollower isAndroid={isAndroid} >{meData?.me.totalFollowers}</TotalFollower>
              </FollowLink>
              <FollowLink onPress={onPressFollowing}>
                <FollowInfoText isAndroid={isAndroid} >팔로잉</FollowInfoText>
                <TotalFollowing isAndroid={isAndroid} >{meData?.me.totalFollowing}</TotalFollowing>
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
          {meData?.me.bio && <Bio>{meData.me.bio}</Bio>}
        </LowerContainer>
      </UserInformationContainer>
      {/* <PostContainer
        data={mePostData?.getMePosts.posts}
        renderItem={renderItem}
        keyExtractor={(item:getMePosts_getMePosts_posts)=>item.id + ""}
        numColumns={numColumns}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      /> */}
      {/* <NavContainer> */}
        <Tab.Navigator
          tabBarPosition='top'
          screenOptions={{
            tabBarStyle:{
              height: 30,
              backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)",
            },
            tabBarLabelStyle:{
              // color:isDarkMode?"white":"black",
              fontSize: 14,
              fontWeight: isAndroid ? 'bold' : "600"
            },
            tabBarContentContainerStyle:{
              height: 30,
              alignItems:"center"
            },
            tabBarActiveTintColor: isDarkMode ? colors.yellow : colors.darkYellow,
            tabBarInactiveTintColor: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
            tabBarIndicatorStyle:{
              backgroundColor: isDarkMode ? colors.yellow : colors.darkYellow,
            },
            // swipeEnabled: isAndroid ? false : true,
          }}
        >
          <Tab.Screen
            name="PostFlatList"
            // component={PostFlatList}
            options={{
              tabBarLabel:({color})=><TabTitle isAndroid={isAndroid} color={color}>포스팅</TabTitle>
            }}
          >
            {()=><PostFlatList/>}
          </Tab.Screen>
          <Tab.Screen
            name="PetLogFlatList"
            // component={PetLogFlatList}
            options={{
              tabBarLabel:({color})=><TabTitle isAndroid={isAndroid} color={color}>펫로그</TabTitle>
            }}
          >
            {()=><PetLogFlatList/>}
          </Tab.Screen>
        </Tab.Navigator>
      {/* </NavContainer> */}
    </Container>
  );
}
export default MeLoggedInUserView;
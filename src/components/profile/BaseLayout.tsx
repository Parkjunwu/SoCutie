import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Alert, LayoutChangeEvent } from "react-native";
import styled from "styled-components/native";
import { seeProfile } from "../../__generated__/seeProfile";
import { FeedStackProps } from "../type";
import FastImage from 'react-native-fast-image'
import { noUserUriVar } from "../../apollo";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PostFlatList from "./PostFlatList";
import PetLogFlatList from "./PetLogFlatList";
import { isAndroid } from "../../utils";
import useIsDarkMode from "../../hooks/useIsDarkMode";
import { colors } from "../../color";


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
const RightContainer = styled.View`
  flex: 2;
  /* background-color: yellow; */
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
  flex:1;
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

type BaseLayoutProps = {
  userData: seeProfile,
};

type NavigateProps = NativeStackScreenProps<FeedStackProps, 'Profile'>;

const Tab = createMaterialTopTabNavigator();

const BaseLayout:React.FC<BaseLayoutProps> = ({userData,children}) => {

  const navigation = useNavigation<NavigateProps["navigation"]>();
  const route = useRoute<NavigateProps["route"]>();
  const userId = route.params.id;

  useEffect(()=>{
    if(userData?.seeProfile.error) {
      Alert.alert(userData?.seeProfile.error,null,[{text:"확인"}]);
      navigation.goBack();
    }
  },[userData])

  const onPressFollowers = () => {
    if(userData) {
      navigation.navigate("Followers",{userId:userData?.seeProfile.user.id});
    }
  };
  const onPressFollowing = () => {
    if(userData) {
      navigation.navigate("Following",{userId:userData?.seeProfile.user.id});
    }
  };

  const isDarkMode = useIsDarkMode();

  // const [layoutHeight,setLayoutHeight] = useState(0);

  // const onLayoutGetHeight = ({nativeEvent:{layout:{height}}}:LayoutChangeEvent) => {
  //   // console.log("height")
  //   setLayoutHeight(height);
  // };

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
                marginVertical:20,
                marginHorizontal:0,
              }}
              source={{
                uri : userData?.seeProfile?.user?.avatar
                ?
                  userData.seeProfile.user.avatar
                :
                  noUserUriVar()
              }}
            />
          </LeftContainer>
          <RightContainer>
            <UserNameContainer>
              <UserName>{userData?.seeProfile?.user?.userName}</UserName>
            </UserNameContainer>
            <FollowContainer>
            <FollowLink onPress={onPressFollowers}>
              <FollowInfoText isAndroid={isAndroid} >팔로워</FollowInfoText>
              <TotalFollower isAndroid={isAndroid} >{userData?.seeProfile?.user?.totalFollowers}</TotalFollower>
            </FollowLink>
            <FollowLink onPress={onPressFollowing}>
              <FollowInfoText isAndroid={isAndroid} >팔로잉</FollowInfoText>
              <TotalFollowing isAndroid={isAndroid} >{userData?.seeProfile?.user?.totalFollowing}</TotalFollowing>
            </FollowLink>
            </FollowContainer>
            <FollowBtnContainer>
              {/* 로그인 유저는 팔로우 / 언팔로우 / 프로필편집 버튼 들어옴 */}
              {children}
            </FollowBtnContainer>
          </RightContainer>
        </UpperContainer>
        <LowerContainer>
          {userData?.seeProfile?.user?.bio && <Bio>{userData.seeProfile.user.bio}</Bio>}
        </LowerContainer>
      </UserInformationContainer>
      {/* <PostContainer
        data={userPostData?.getUserPosts.posts}
        renderItem={renderItem}
        keyExtractor={(item:getUserPosts_getUserPosts_posts)=>item.id + ""}
        numColumns={numColumns}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      /> */}
      {/* <NavContainer onLayout={onLayoutGetHeight}> */}
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
              height:30,
              alignItems:"center"
            },
            tabBarActiveTintColor: isDarkMode ? colors.yellow : colors.darkYellow,
            tabBarInactiveTintColor: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
            tabBarIndicatorStyle:{
              backgroundColor: isDarkMode ? colors.yellow : colors.darkYellow,
            },
            // swipeEnabled: isAndroid ? false : true,
          }}
          // sceneContainerStyle={{
          //   backgroundColor:"yellow"
          // }}
          initialRouteName="PetLogFlatList"
        >
          <Tab.Screen
            name="PostFlatList"
            // component={PostFlatList}
            options={{
              tabBarLabel:({color})=><TabTitle isAndroid={isAndroid} color={color}>포스팅</TabTitle>
            }}
          >
            {()=><PostFlatList userId={userId} />}
          </Tab.Screen>
          <Tab.Screen
            name="PetLogFlatList"
            // component={PetLogFlatList}
            options={{
              tabBarLabel:({color})=><TabTitle isAndroid={isAndroid} color={color}>펫로그</TabTitle>
            }}
          >
            {()=><PetLogFlatList user={userData?.seeProfile.user} />}
          </Tab.Screen>
        </Tab.Navigator>
      {/* </NavContainer> */}
    </Container>
  )
}
export default BaseLayout;
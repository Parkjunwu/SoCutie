import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedStackProps } from "../../../type";
import { seeNewPostFeed_seeNewPostFeed } from "../../../../__generated__/seeNewPostFeed";
import { seeFollowersFeed_seeFollowersFeed } from "../../../../__generated__/seeFollowersFeed";
import Post from "../../../Post";
import ScreenLayout from "../../../ScreenLayout";
import styled from "styled-components/native";
import { logoUriVar } from "../../../../apollo";

const ListEmptyComponents = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 400px;
  background-color: ${props=>props.theme.backgroundColor};
`;
const ListEmptyComponentText = styled.Text`
  color: ${props=>props.theme.textColor};
  font-size: 15px;
  text-align: center;
`;


type Props = {
  data:any,
  loading:any,
  refetch:any,
  fetchMore:any,
  setFeedOptions:any
};

type TypeNavigation = NativeStackNavigationProp<FeedStackProps, 'Feed'>;

const BaseFeed = ({data,loading,refetch,fetchMore,setFeedOptions}:Props) => {
  const navigation = useNavigation<TypeNavigation>();

  // 처음 들어올 때 / 로그인 시 refetch 함.
  useEffect(()=>{
    refetch();
  },[]);

  // data 가 없을 때도 false 일텐데 상관 없을라나?
  const isSeeNewPostFeed = data && "seeNewPostFeed" in data;

  const [videoPlayingPost,setVideoPlayingPost] = useState<number|null>(null);
  
  const renderPost: ListRenderItem<seeNewPostFeed_seeNewPostFeed | seeFollowersFeed_seeFollowersFeed | null> | null = ({item:post}) => {

    const onPressVideo = () => setVideoPlayingPost(post.id);

    return (
      post ?
        <Post {...post} videoPlayingPost={videoPlayingPost} onPressVideo={onPressVideo} isFeed={true} />
      :
        null
    );
  };

  // isSeeNewPostFeed 가 data 없어도 false 임. 혹시 문제시 확인.
  const onEndReached = async() => {
    await fetchMore({
      variables:{
        offset: isSeeNewPostFeed ? data.seeNewPostFeed.length : data.seeFollowersFeed.length,
      },
    });
  };
  
  const [refreshing,setRefreshing] = useState(false);

  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // 헤더 누르면 맨위로
  const flatListRef = useRef<FlatList<seeNewPostFeed_seeNewPostFeed | seeFollowersFeed_seeFollowersFeed>>();
  
  const onPressHeader = () => {
    // data 가 없을 수 있음. 그럼 FlatList 없으니
    flatListRef.current?.scrollToOffset({offset:0});
  };

  const headerHeight = useHeaderHeight();
  const iosSafeAreaHeight = useSafeAreaInsets();
  const headerTitleHeight = headerHeight - iosSafeAreaHeight.top;
  
  const isFocused = useIsFocused();

  useEffect(()=>{
    // isFocused return 해야됨. true -> false 된거도 변한거니까 new follow 둘 다 실행되고 follow 가 무조건 나중에 실행되서 new 가 씹힘.
    if(!isFocused) return;
    // 로그인 한 경우 하나 위에 header 바꿔야 함.
    if(setFeedOptions) {
      setFeedOptions({
        headerTitleAlign:"center",
        headerTitle:()=><TouchableOpacity onPress={onPressHeader}>
          <FastImage
            style={{
              height: headerTitleHeight,
              width: headerTitleHeight,
            }}
            // source={require("../../../../../assets/logo.png")}
            // source={image.logo}
            source={{uri:logoUriVar()}}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      })
    // 로그인 안한 경우
    } else {
      navigation.setOptions({
        headerTitleAlign:"center",
        headerTitle:()=><TouchableOpacity onPress={onPressHeader}>
          <FastImage
            style={{
              height: headerTitleHeight,
              width: headerTitleHeight,
            }}
            // source={require("../../../../../assets/logo.png")}
            // source={image.logo}
            source={{uri:logoUriVar()}}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      });
    }
  },[isFocused]);

  // 걍 따로 뺌. 같이 놓으면 헷갈리니까. focus 아닐 때 비디오 재생 안되도록
  useEffect(()=>{
    if(!isFocused) {
      setVideoPlayingPost(null);
    }
  },[isFocused]);
  
  const ListEmptyComponent = () => (
    <ListEmptyComponents>
      <ListEmptyComponentText>
        {`나의 취향에 맞는 유저를

팔로우 하고 소식을 받아보세요!`}
      </ListEmptyComponentText>
    </ListEmptyComponents>
  );

  // 비디오 하나만 재생되도록
  const onViewableItemsChanged = ({ changed, viewableItems}) => {
    const viewableItemsKeyList:number[] = viewableItems.map(list=>list.key);
    setVideoPlayingPost(prev=>{
      // 얘는 처음에 마운팅? 되서 나중에 state 바뀌어도 적용 안됨. 바깥에서 적용해
      // if(!isFocused) return null;
      if(viewableItemsKeyList.includes(prev)) {
        return prev;
      } else {
        const changedKeyList:number[] = changed.map(list=>list.key);
        const listLength = changedKeyList.length;
        if(listLength === 0) {
          return null;
        } else if (listLength === 1) {
          return Number(changedKeyList[0]);
        } else {
          return Number(changedKeyList[1]);
        }
      }
    })
  };

  const viewabilityConfig = {
    minimumViewTime: 300,
    itemVisiblePercentThreshold: 70,
  };

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);


  return (
    <ScreenLayout loading={loading}>
      <>
        {data?.seeNewPostFeed && <FlatList
          data={data.seeNewPostFeed}
          renderItem={renderPost}
          keyExtractor={(item)=>item?.id + ""}
          style={{width:"100%"}}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ref={flatListRef}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        />}
        {data?.seeFollowersFeed && <FlatList
          data={data.seeFollowersFeed}
          renderItem={renderPost}
          keyExtractor={(item)=>item?.id + ""}
          style={{width:"100%"}}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ref={flatListRef}
          ListEmptyComponent={()=><ListEmptyComponent />}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        />}
      </>
    </ScreenLayout>
  );
}
export default BaseFeed;
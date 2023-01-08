import { useReactiveVar } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { isLoggedInVar } from "../../../apollo";
import NewPostFeed from "../../../components/feed/feedTab/NewPostFeed";
import { FeedStackProps } from "../../../components/type";
import LogInFeedNav from "../../../navigator/LogInFeedNav";
import GoToSearchPostAndUserBtn from "../../../components/feed/GoToSearchPostAndUserBtn";

type TypeNavigation = NativeStackScreenProps<FeedStackProps, 'Feed'>;

const Feed = ({navigation}:TypeNavigation) => {

  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [feedOptions,setFeedOptions] = useState(null);
  
  useEffect(()=>{
    navigation.setOptions({
    // SearchTab 말고 Search 따로 빼서 거기로 가게
      headerLeft:({tintColor})=><GoToSearchPostAndUserBtn
        tintColor={tintColor}
        navigation={navigation}
      />
    })
  },[]);
  
  useEffect(()=>{
    if(feedOptions){
      navigation.setOptions(feedOptions);
    }
  },[feedOptions]);
  
  console.log("Feed setFeedOptions")
  console.log(setFeedOptions)
  
  return (
    isLoggedIn ? <LogInFeedNav setFeedOptions={setFeedOptions}/> : <NewPostFeed />
  );
};

export default Feed;

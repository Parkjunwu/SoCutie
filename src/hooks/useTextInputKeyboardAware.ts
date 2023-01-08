import { useEffect, useState } from "react";
import { EmitterSubscription, Keyboard, KeyboardEvent, Platform, ScrollView, StatusBar, } from "react-native";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

let ref:EmitterSubscription;

// 댓글 작성 키보드 움직임을 위한.. FlatList 바깥의 TextInput 이동.
const useTextInputKeyboardAware = (scrollRef:React.MutableRefObject<ScrollView>) => {
  
  const [keyboardHeight,setKeyboardHeight] = useState(0);
  const [createCommentOnFocused,setCreateCommentOnFocused] = useState(false);
  const [firstCreateCommentOnFocused,setFirstCreateCommentOnFocused] = useState(true);

  const onKeyboardShow = (e:KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;

  let tabBarHeight = 0;
  try {
    // bottom tab navigation tabBarHeight
    tabBarHeight = useBottomTabBarHeight();
  } catch {
    console.log("notification 으로 들어옴");
  }
  const keyboardOffSetHeight = keyboardHeight-tabBarHeight-statusBarHeight;

  useEffect(() => {
    // 댓글 등록 눌렀을 때
    if(createCommentOnFocused) {
      // 근데 처음인 경우 키보드 높이 받아야함. 높이 받으면 높이 useEffect 에서 움직이도록
      if(firstCreateCommentOnFocused) {
        if (Platform.OS === 'ios') {
          ref = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
        } else if (Platform.OS === 'android') {
          ref = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
        }
        setFirstCreateCommentOnFocused(false);
      // 그외엔 키보드만큼 이동
      } else {
        scrollRef.current?.scrollTo({x: 0, y: keyboardOffSetHeight, animated: true});
      }
    // 외부 누르면 다시 돌아감
    } else {
      return scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
    }
  }, [createCommentOnFocused]);

  useEffect(()=>{
    // keyboardHeight 가 변경 되었을 때.
    if(keyboardHeight !== 0){
      if(createCommentOnFocused){
        scrollRef.current?.scrollTo({x: 0, y: keyboardOffSetHeight, animated: true});
      }
      return ref?.remove();
    }
  },[keyboardHeight]);

  useEffect(()=>{
    // ref 혹시 있으면 삭제
    return () => {
      ref?.remove();
    };
  },[]);

  return { setCreateCommentOnFocused };
};

export default useTextInputKeyboardAware;
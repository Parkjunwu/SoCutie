import { useWindowDimensions, StatusBar, Platform } from "react-native";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const useGetInnerLayoutHeight = () => {
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();

  // navigation headerHeight
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top);

  const { height : wholeScreenHeight } = useWindowDimensions();

  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;

  let tabBarHeight = 0;
  try {
    // bottom tab navigation tabBarHeight
    tabBarHeight = useBottomTabBarHeight();
  } catch {
    console.log("notification 으로 들어옴");
  }
  // 헤더, 탭 제외한 스크린 크기
  const innerLayoutHeight = wholeScreenHeight - tabBarHeight - headerHeight - statusBarHeight;

  return innerLayoutHeight;
};

export default useGetInnerLayoutHeight;
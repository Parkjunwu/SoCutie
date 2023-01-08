import { useReactiveVar } from "@apollo/client";
import { moveDeleteAccountComplete } from "../apollo";
import DeleteAccountCompletedView from "../screens/DeleteAccountCompletedView";
import RootNav from "./RootNav";

// 로그아웃도 얘로 바꾸거나 하는게 나을라나?
// DeleteAccountCompletedView 가 캐시 삭제하는 애임.
const RootView = () => {
  const isDeleteAccountComplete = useReactiveVar(moveDeleteAccountComplete);
  return isDeleteAccountComplete ? <DeleteAccountCompletedView/> : <RootNav />
};

export default RootView;
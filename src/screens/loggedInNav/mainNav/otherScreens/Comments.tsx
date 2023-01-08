import React from "react";
import { Platform } from "react-native";
import { isLoggedInVar } from "../../../../apollo";
import AndroidCommentForLogInUser from "../../../../components/comment/AndroidCommentForLogInUser";
import CommentForLogInUser from "../../../../components/comment/CommentForLogInUser";
import CommentForNotLogInUser from "../../../../components/comment/CommentForNotLogInUser";
import { CommentsNavProps } from "../../../../types/comment";

const Comments = ({route}:CommentsNavProps) => {

  const isLoggedIn = isLoggedInVar();
  const isAndroid = Platform.OS === "android";
  return (
    isLoggedIn ?
      isAndroid ? 
        <AndroidCommentForLogInUser route={route}/>
      :
        <CommentForLogInUser route={route}/>
    :
      <CommentForNotLogInUser route={route}/>
  );
};

export default Comments;
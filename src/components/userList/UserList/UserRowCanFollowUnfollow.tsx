import { ApolloCache, DefaultContext, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../../../color";
import FOLLOW_USER from "../../../gql/followUser";
import UNFOLLOW_USER from "../../../gql/unfollowUser";
import { followUser, followUserVariables } from "../../../__generated__/followUser";
import { unfollowUser, unfollowUserVariables } from "../../../__generated__/unfollowUser";
import { FeedStackProps } from "../../type";
import FastImage from 'react-native-fast-image';
import { noUserUriVar } from "../../../apollo";
import useMe from "../../../hooks/useMe";


const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const Username = styled.Text`
  color: ${props=>props.theme.textColor};
  font-weight: 600;
  font-size: 17px;
`;
const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
`;
const FollowOrUnFollowBtn = styled.TouchableOpacity`
  background-color: ${colors.blue};
  justify-content: center;
  padding: 5px 10px;
  border-radius: 5px;
`;
const FollowOrUnFollowText = styled.Text`
  color:white;
  font-weight: 600;
`;


// updateQuery 타입 추가 | 로
interface Props {
  avatar: string;
  userName: string;
  isFollowing: boolean;
  isMe: boolean;
  id: number;
  // 타입 체크 안하는게 나을듯. 오류가 너무 많이 뜸.
  // updateQuery: <TVars = seePostLikesVariables>(mapFn: (previousQueryResult: seePostLikes, options: Pick<WatchQueryOptions<TVars, seePostLikes>, "variables">) => seePostLikes) => void
  updateQuery:Function;
}



const UserRowCanFollowUnfollow= ({avatar,userName,isFollowing,isMe,id,updateQuery}:Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackProps,"PostLikes">>();

  // 팔로우 언팔로우
  const [followUser,{loading:followUserLoading}] = useMutation<followUser,followUserVariables>(FOLLOW_USER);
  const [unfollowUser,{loading:unfollowUserLoading}] = useMutation<unfollowUser,unfollowUserVariables>(UNFOLLOW_USER);


  const {data:meData} = useMe();

  const updateIsFollowing:MutationUpdaterFunction<unfollowUser|followUser,unfollowUserVariables|followUserVariables,DefaultContext,ApolloCache<any>> = (cache,result)=>{
    
    
    const key = Object.keys(result.data)[0];
    const ok = result.data[key].ok;
    
    if(ok) {

      const userId = `User:${meData?.me.id}`;

      // 유저 본인 totalFollowing 수 변경
      cache.modify({
        id:userId,
        fields:{
          totalFollowing(prev){
            return key === "followUser" ? prev + 1 : prev -1;
          },
        },
      });
      
      // isFollowing 변경
      updateQuery((prev)=>{
        // 쿼리명
        const queryName = Object.keys(prev)[0];
        const dataObj = prev[queryName];
        // 데이터 필드명. likeUsers 같은 애.
        let dataFieldName:string;
        
        for(let i in dataObj) {
          if(i !== "isNotFetchMore" && i !== "hasNextPage" && i !== "cursorId" && i !== "error" && i !== "__typename") {
            dataFieldName = i;
            break;
          }
        };
        
        // dataFieldName 외에 나머지 받기 위함
        const {[dataFieldName]:userField,isNotFetchMore,...rest} = prev[queryName];
        
        // 데이터 변경
        const newLikeUsers = userField.map(user => {
          if(user.id === id) {
            const {isFollowing, ...restElements} = user
            const newUser = {isFollowing:!isFollowing, ...restElements}
            return newUser;
          } else {
            return user;
          }
        });
        
        const changedIsFollowingResult = {
          [queryName]:{
            [dataFieldName]:newLikeUsers,
            isNotFetchMore:true,
            ...rest
          }
        };
        
        return changedIsFollowingResult;
      });
    }
  };
  
  const onPressFollowOrUnFollow = async() => {
    // 로딩중일 때는 그냥 넘어감
    if(followUserLoading || unfollowUserLoading) return;

    if(isFollowing) {
      await unfollowUser({
        variables:{
          id
        },
        update:updateIsFollowing
      });
    } else {
      await followUser({
        variables:{
          id
        },
        update:updateIsFollowing
      });
    }
  };




  return <Wrapper>
    <Column onPress={()=>navigation.navigate("Profile",{id,userName})}>
      <FastImage
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          marginRight: 10,
        }}
        // source={avatar?{uri:avatar}:require("../../../../assets/no_user.png")}
        // source={avatar?{uri:avatar}:image.no_user}
        source={{uri: avatar ? avatar : noUserUriVar()}}
      />
      <Username>{userName}</Username>
    </Column>
    {!isMe && <FollowOrUnFollowBtn onPress={onPressFollowOrUnFollow}>
      <FollowOrUnFollowText>{isFollowing?"UnFollow":"Follow"}</FollowOrUnFollowText>
    </FollowOrUnFollowBtn>}
  </Wrapper>;
}
export default UserRowCanFollowUnfollow;
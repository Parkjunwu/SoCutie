import { ListRenderItem } from "react-native";
import { useWindowDimensions } from 'react-native';
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import PetLogHeaderComponent from "../../../../components/petLog/PetLogHeaderComponent";
import PetLogFooterComponent from "../../../../components/petLog/PetLogFooterComponent";
import { seePetLog, seePetLogVariables } from "../../../../__generated__/seePetLog";
import PetLogDropDown from "../../../../components/petLog/PetLogDropDown";
import PetLogLoading from "../../../../components/petLog/PetLogLoading";
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import useIsDarkMode from "../../../../hooks/useIsDarkMode";
import { MeStackProps } from "../../../../components/type";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import PetLogVideoOrImage from "../../../../components/petLog/PetLogVideoOrImage";
import BodyText from "../../../../components/petLog/BodyText";

const SEE_PETLOG = gql`
  query seePetLog($id: Int!) {
    seePetLog(id:$id) {
      id
      # 유저 정보는 걍 List 에서 상속받으면 될듯
      # user
      body
      file
      # createdAt
      # 얘네를 여기서 받아야 캐시 업데이트가 됨. route 로 받으면 받고 나서 업데이트 안됨.
      isMine
      likes
      commentNumber
      isLiked
      # comments
      # accused
    }
  }
`;

const PetLog = ({navigation,route}:NativeStackScreenProps<MeStackProps,"PetLog">) => {

  // 이게 navigate 로 param 받은거라 캐시 업데이트가 안됨. 여기서 또 받든지 아님 캐시에서 받든지 근데 캐시에서 받은 애를 또 state 에 넣으니까 똑같이 또 안받아져. 걍 여기서 받자
  // const id = route.params.id;
  const title = route.params.title;
  // const isLiked = route.params.isLiked;
  const createdAt = route.params.createdAt;
  const user = route.params.user;
  // const likes = route.params.likes;
  // const commentNumber = route.params.commentNumber;

  useEffect(()=>{
    navigation.setOptions({
      title,
    });
  },[]);

  const { loading, error, data } = useQuery<seePetLog,seePetLogVariables>(SEE_PETLOG, {
    // fetchPolicy: 'network-only', 이 pagination 에 걸릴 수 있음. 만약 그러면 걍 refetch. 얘는 근데 pagination 안쓰니 괜찮을듯.
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: {
      id: route.params.id,
    },
  });
  console.log(data)
  
  useEffect(()=>{
    if(data){
      const petLogInfo = data.seePetLog;
      navigation.setOptions({
        headerRight:()=><PetLogDropDown
          petLogId={petLogInfo.id}
          isMine={petLogInfo.isMine}
          file={petLogInfo.file}
          body={petLogInfo.body}
          title={title}
        />
      });
    }
  },[data]);
  
  const { width:windowWidth } = useWindowDimensions();

  const isDarkMode = useIsDarkMode();

  if(loading) {
    return <PetLogLoading {...route.params} />;
  }

  const sortedData = data && data.seePetLog.body.map((bodyString,index) => ({body:bodyString,file:data.seePetLog.file[index]}));


  const renderItem:ListRenderItem<{body?:string,file?:string}> = ({item}) => {
    const file = item.file;
    const body = item.body;
    const fileWidth = windowWidth - 20;
    return (
      <>
        {body !== "" && <BodyText>{body}</BodyText>}
        {file && <PetLogVideoOrImage uri={file} fileWidth={fileWidth} />}
      </>
    );
  };

  return (
    <KeyboardAwareFlatList
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "black" : "white",
        padding: 10,
      }}
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={(item,index)=>index+""}
        ListHeaderComponent={<PetLogHeaderComponent {...data?.seePetLog} title={title} user={user} createdAt={createdAt} />}
        ListFooterComponent={<PetLogFooterComponent {...data?.seePetLog} user={user} />}
    />
  );
};

export default PetLog;
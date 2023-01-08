import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SafeAreaContainer from "../components/upload/SafeAreaContainer";
import useIsDarkMode from "../hooks/useIsDarkMode";
import AndroidSelectPhoto from "../screens/loggedInNav/messageAndUploadNav/uploadNav/AndroidSelectPhoto";
import SelectPhoto from "../screens/loggedInNav/messageAndUploadNav/uploadNav/SelectPhoto";
import { isAndroid } from "../utils";
import UploadPetLog from "../screens/loggedInNav/mainNav/otherScreens/UploadPetLog";
import PlusPhotoBtn from "../components/upload/PlusPhotoBtn";

const Stack = createNativeStackNavigator();

type UploadStackNavGeneratorNeedWhichComponentType = {
  whichComponent:string
  isPhotoTranslateActive?:boolean;
  setIsPhotoTranslateActive?:React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadStackNavGeneratorNeedWhichComponent = ({whichComponent,isPhotoTranslateActive,setIsPhotoTranslateActive}:UploadStackNavGeneratorNeedWhichComponentType) => {

  const isDarkMode = useIsDarkMode();
  const isUploadPetLog = whichComponent === "UploadPetLog";

  return (
    <SafeAreaContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign:"center",
          headerTintColor: isDarkMode ? "white" : "black",
          headerStyle:{
            backgroundColor: isDarkMode ? "black" : "white",
          },
          ...(isAndroid && {
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: "bold",
            },
          }),
        }}
      >
        {isUploadPetLog &&
          <Stack.Screen
            name="UploadPetLog"
            // component={UploadPetLog}
            options={{
              headerTitle:({tintColor}) => <PlusPhotoBtn tintColor={tintColor} />,
              headerBackVisible:false,
            }}
          >
            {()=><UploadPetLog isPhotoTranslateActive={isPhotoTranslateActive}setIsPhotoTranslateActive={setIsPhotoTranslateActive}/>}
          </Stack.Screen>
        }
        {/* 안드로이드는 cameraRoll 을 써야 외부 저장소 파일을 받을 수 있음. ios 는 expo MediaLibrary 써야 localUri 받고 얘로 받아야 FastImage 에 나옴. cameraRoll 에서 localUri 는 바로 못 받고 따로 다시 받아야함. */}
        <Stack.Screen
          name={isUploadPetLog ? "PetLogSelectPhoto" : "SelectPhoto"}
          component={isAndroid ? AndroidSelectPhoto : SelectPhoto}
          options={{
            // 컴포넌트로 옮김. 팻로그 goBack 이 이상하게 되서
            // headerLeft:({tintColor})=>
            //   <TouchableOpacity onPress={() => navigation.goBack()}>
            //     <Ionicons name="close" size={24} color={tintColor}/>
            //   </TouchableOpacity>,
            headerBackVisible:false,
            title:"사진 선택",
          }}
        />
      </Stack.Navigator>
    </SafeAreaContainer>
  )
};

export default UploadStackNavGeneratorNeedWhichComponent;
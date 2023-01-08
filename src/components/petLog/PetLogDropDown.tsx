import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import useIsDarkMode from '../../hooks/useIsDarkMode';
import { Ionicons } from "@expo/vector-icons"
import { Alert } from "react-native";
import { isIOS } from '../../utils';
import { ProcessingManager } from 'react-native-video-processing';
import isImage from '../../logic/isImage';
import useDeletePetLog from '../../hooks/useDeletePetLog';

const dropdownList = [
  {
    value: '신고',
  }
];

const isMineDropdownList = [
  {
    value: '수정',
  },
  {
    value: '삭제',
  }
];

type PostDropdownProps = {
  petLogId:number,
  isMine:boolean,
  file?:string[],
  body?:string[],
  title:string,
};

const PetLogDropDown = ({petLogId,isMine,file,body,title}:PostDropdownProps) => {

  const deletePetLog = useDeletePetLog(petLogId);

  const isDarkMode = useIsDarkMode();
  const navigation = useNavigation();

  const onChangeText = (value: string, index: number, data: any) => {
    
    if (value === "신고") {
      Alert.alert("해당 게시물을 신고하시겠습니까?",null,[
        {
          text:"신고",
          onPress:() => {
            navigation.navigate("AccusePetLog",{
              petLogId,
            })
          }
        },
        {
          text:"취소",
          style:"cancel",
        }
      ]);
    } else if (value === "수정") {
      Alert.alert("해당 게시물을 수정하시겠습니까?",null,[
        {
          text:"수정",
          onPress:async() => {
            const fileInfoArr = [];
            const asyncGetFileInfo = file.map(async(singleFile,index) => {
              if(isImage(singleFile)) {
                fileInfoArr[index] = {
                  uri:singleFile,
                  isVideo:false,
                };
              } else {
                const maximumSize = { width: 200, height: 200 };
                const thumbNail = isIOS ?
                  (await ProcessingManager.getPreviewForSecond(singleFile, 0, maximumSize, "JPEG")).uri
                  :
                  undefined;
                fileInfoArr[index] = {
                  uri:singleFile,
                  isVideo:true,
                  thumbNail,
                };
              }
            });

            await Promise.all(asyncGetFileInfo);
            
            // UploadForm 말고 컴포넌트 따로 만들어야할듯. 너무 복잡해
            navigation.navigate("EditPetLog",{
              petLogId,
              title,
              fileInfoArr,
              body,
            })
          }
        },
        {
          text:"취소",
          style:"cancel",
        }
      ]);
    } else if (value === "삭제") {
      Alert.alert("해당 게시물을 삭제하시겠습니까?",null,[
        {
          text:"삭제",
          onPress:async() => {
            await deletePetLog();
          },
        },
        {
          text:"취소",
          style:"cancel",
        }
      ]);
    }
  };

  return (
    <Dropdown
      data={isMine ? isMineDropdownList : dropdownList}
      pickerStyle={{borderRadius:10,width:60}}
      renderBase={()=><Ionicons name="ellipsis-vertical-outline" size={24} color={isDarkMode ? "white" : "black"} />}
      dropdownOffset={{left:-15, top: isMine ? 41 : 5}} 
      onChangeText={onChangeText}
    />
  );
};

export default PetLogDropDown;
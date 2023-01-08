import { Alert, Animated, Image, LayoutChangeEvent, PanResponder, TouchableOpacity } from "react-native";
import BodyInput from "./BodyInput";
import { Ionicons } from "@expo/vector-icons"
import { useRef } from "react";
import CanChangePositionFile from "./CanChangePositionFile";

let longPressActive = false;
let onLongPressTimeout;

const AddedImageWithTextInput = ({file,body,setBody,setFileAddingPosition,inputIndex,imageIndex,imageWidth,setFiles,setComponentPositionY,setEachLineTextLength,nowChangingInputIndex,setNowChangingInputIndex,setIsPhotoTranslateActive}) => {

  // 초기 위치 0 말고 지정
  const position = useRef(new Animated.Value(0)).current;
  
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onPanResponderGrant: () => {
      onLongPressTimeout = setTimeout(() => {
        longPressActive = true;
        setIsPhotoTranslateActive(true);
        position.extractOffset()
        // zIndex 도 바꿔줘야함
      }, 400);
    },
    onPanResponderMove:(_,{dy})=>{
      // position.setOffset(position._value)
      clearTimeout(onLongPressTimeout);
      if(longPressActive){
        position.setValue(dy)
      }
    },
    onPanResponderRelease:(_,{dy})=>{
      clearTimeout(onLongPressTimeout);
      longPressActive = false;
      setIsPhotoTranslateActive(false);
      console.log("touch Finished")
      // gestureState 는 뷰의 어떤 규정된 지점이 아니고 내가 누른 부분을 말함. 그래서 dy 써야 할듯.
      // dy 가 양수 > 아래로 내려감. 음수 > 위로 올라감.
      // 음수일 경우 이미지 height 더해서 계산해야할.. 필요가 없네 어차피 전부 아래 기준이니

      // flattenOffset 안해도 되네
      // position.flattenOffset();
    },
  })).current;

  const onLayoutImage:(event: LayoutChangeEvent) => void = (event) => {
    console.log("onLayoutImage")
    console.log(event.nativeEvent.layout)
    const onLayoutValue = event.nativeEvent.layout;
    const nowComponentBottomY = onLayoutValue.height + onLayoutValue.y;
    setComponentPositionY(prev=>{
      const newArr = [...prev];
      // const newArr = prev ? [...prev] : [];
      newArr[imageIndex] = nowComponentBottomY;
      return newArr;
    });
  };

  const onPressDeletePhoto = () => {
    Alert.alert("해당 파일을 제외 시키시겠습니까?",null,[
      {
        text:"제외",
        style:'destructive',
        onPress:()=>{
          setBody(prev=>{
            const newArr = [...prev];
            if(newArr[inputIndex]){
              newArr[inputIndex-1] += newArr[inputIndex];
            }
            newArr.splice(inputIndex,1);
            return newArr;
          });
          setFiles(prev=>{
            const newArr = [...prev];
            newArr.splice(inputIndex-1,1);
            return newArr;
          });
        },
      },
      {
        text:"취소",
      },
    ]);
  };

  const canChangePositionFilePropsArr = {file,setBody,inputIndex,imageWidth,setFiles,setIsPhotoTranslateActive,setComponentPositionY};
  
  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: "relative",
          transform: [{translateY:position}],
          zIndex: 100,
        }}
      >
        <Image
          source={{uri:file}}
          style={{
            width: imageWidth,
            height: imageWidth,
          }}
          onLayout={onLayoutImage}
        />
        <TouchableOpacity
          onPress={onPressDeletePhoto}
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            zIndex: 5,
          }}
        >
          <Ionicons name="close" color="rgba(255,0,0,0.7)" size={30} />
        </TouchableOpacity>
      </Animated.View>
      <CanChangePositionFile {...canChangePositionFilePropsArr} />
      <BodyInput
        value={body}
        setValue={setBody}
        setFileAddingPosition={setFileAddingPosition}
        inputIndex={inputIndex}
        setComponentPositionY={setComponentPositionY}
        setEachLineTextLength={setEachLineTextLength}
        nowChangingInputIndex={nowChangingInputIndex}
        setNowChangingInputIndex={setNowChangingInputIndex}
      />
    </>
  )
};

export default AddedImageWithTextInput;
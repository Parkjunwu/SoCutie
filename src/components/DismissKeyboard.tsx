import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

 
 const DismissKeyboard:React.FC = ({children}) => {

  return <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
    style={{flex:1}}
    disabled={Platform.OS === "web" ? true : false}
  >
    {children}
  </TouchableWithoutFeedback>
 }
 export default DismissKeyboard;
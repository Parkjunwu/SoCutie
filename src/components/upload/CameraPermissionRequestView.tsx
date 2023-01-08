import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import PermissionRequestView from "./PermissionRequestView";
import {Ionicons} from "@expo/vector-icons"
import { TouchableOpacity, useColorScheme } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Container = styled.View`
  position: relative;
  flex: 1;
  background-color: ${props=>props.theme.backgroundColor};
`;
const CloseButton = styled.View<{iosSafeAreaHeight:number}>`
  margin-top: ${props=>props.iosSafeAreaHeight === 0 ? 20 : props.iosSafeAreaHeight};
  margin-left: 20px;
`;

const CameraPermissionRequestView = () => {
  const navigation = useNavigation();
  const darkModeSubscription = useColorScheme();
  const iosSafeAreaHeight = useSafeAreaInsets().top;

  return <Container>
    <CloseButton iosSafeAreaHeight={iosSafeAreaHeight}>
      <TouchableOpacity onPress={()=>navigation.navigate("Main")}>
      <Ionicons name="close" color={darkModeSubscription === "light" ? "black" : "white"} size={30} />
      </TouchableOpacity>
    </CloseButton>
    <PermissionRequestView permissionKind="카메라" />
  </Container>
};

export default CameraPermissionRequestView;
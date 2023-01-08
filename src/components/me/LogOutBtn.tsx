import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import useIsDarkMode from "../../hooks/useIsDarkMode";

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
const LogOutText = styled.Text<{color:string}>`
  color: ${props=>props.color};
`;

const LogOutBtn = () => {

  // const darkModeSubscription = useColorScheme();
  // const isDarkMode = darkModeSubscription === "dark";
  const isDarkMode = useIsDarkMode();

  return (
    <Container>
      <LogOutText color={isDarkMode ? "white" : "black"}>로그아웃 </LogOutText>
      <Ionicons name="log-out-outline" size={24} color={isDarkMode ? "white" : "black"} />
    </Container>
  )
};

export default LogOutBtn;
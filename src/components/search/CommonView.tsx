import React from "react";
import { ActivityIndicator, View } from "react-native";
import styled from "styled-components/native";

const Flex1View = styled.View`
  flex: 1;
`;
const MessageContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const MessageText = styled.Text`
  color: ${props => props.theme.textColor};
  font-weight: 600;
  margin-top: 10px;
`;

const InitialView = () => (
  <Flex1View>
    <MessageContainer>
      <MessageText>키워드를 검색해주세요.</MessageText>
    </MessageContainer>
    <Flex1View/>
  </Flex1View>
);

const LoadingView = () => (
  <Flex1View>
  <MessageContainer>
    <ActivityIndicator size="large"/>
    <MessageText>Searching ...</MessageText>
  </MessageContainer>
  <Flex1View/>
  </Flex1View>
);

const NoDataView = () => (
  <Flex1View>
  <MessageContainer>
    <MessageText>해당 키워드의 검색 결과가 없습니다.</MessageText>
  </MessageContainer>
  <Flex1View/>
  </Flex1View>
);

export {InitialView,LoadingView,NoDataView}
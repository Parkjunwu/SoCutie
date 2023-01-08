import { useIsFocused } from '@react-navigation/native';
import { View } from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components/native';

const Container = styled.View`
  flex:1;
`;

const VideoView = ({uri}:{uri:string}) => {
  const isFocused = useIsFocused();
  return (
    <Container>
      {isFocused ? <Video
        source={{uri}}
        style={{flex:1}}
        controls={true}
        fullscreen={false}
        resizeMode="contain"
      /> : null}
      {/* View 를 넣어야 이상하게 안됬나? 확인 필요 */}
      <View/>
    </Container>
  )
};

export default VideoView;
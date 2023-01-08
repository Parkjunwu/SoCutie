import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const channel = {
  notice:"notice",
  upload:"upload",
  message:"message",
  follow:"follow",
  postLike:"postLike",
  postComment:"postComment",
  commentLike:"commentLike",
  commentComment:"commentComment",
  commentCommentLike:"commentCommentLike",
  petLogLike: "petLogLike",
  petLogComment: "petLogComment",
  petLogCommentLike: "petLogCommentLike",
  petLogCommentComment: "petLogCommentComment",
  petLogCommentCommentLike: "petLogCommentCommentLike",
};

const setPushNotification = () => {

  // messaging 은 firebase
  // 없으면 어떻게 되나?
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  // PushNotification 가 메인.
  PushNotification.configure({
    // (optional) 토큰이 생성될 때 실행됨(토큰을 서버에 등록할 때 쓸 수 있음)
    onRegister: function (token: any) {
      console.log('TOKEN:', token);
    },

    // (required) 알림 클릭시 실행할 로직. 어디로 navigate 한다거나.
    onNotification: function (notification: any) {
      // (required) 아이폰은 얘 무조건 있어야함. 걍 무조건 넣어
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // 공식문서 참고하래 Action 은
    // (optional) 등록한 액션을 누렀고 invokeApp이 false 상태일 때 실행됨, true면 onNotification이 실행됨 (Android)
    // onAction: function (notification: any) {
    // },

    // 에러시
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err: Error) {
      console.error(err.message, err);
    },

    // ios 옵션. 그냥 다 true 하래.
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // 얘도 기본설정.
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,


    // 얘도 기본설정. 권한요청인데 걍 true 냅둬.
    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  ///// 여기서 Channel 생성. 여러개 생성 가능.

  PushNotification.createChannel(
    {
      channelId: channel.notice, // (required)
      channelName: '공지사항', // (required)
      // channelDescription: '앱 실행하는 알림', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`notice push notification '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.createChannel(
    {
      channelId: channel.message, // (required)
      channelName: '메세지 수신', // (required)
      // channelDescription: '앱 실행하는 알림', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`message push notification '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );


  // 체널. 중요
  // 체널 여러개 만들고 유저가 설정할 수 있게 만들 수도 있음.
  PushNotification.createChannel(
    {
      channelId: channel.postLike, // (required)
      channelName: '포스팅 좋아요', // (required)
      // channelDescription: '앱 실행하는 알림', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`postLike push notification '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
  
  PushNotification.createChannel(
    {
      channelId: channel.follow, // (required)
      channelName: '유저 팔로우', // (required)
      // channelDescription: '유저가 팔로잉함', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`follow push notification '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
};

export default setPushNotification;
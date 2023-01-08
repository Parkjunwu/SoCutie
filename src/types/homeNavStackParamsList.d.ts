import { NavigatorScreenParams } from "@react-navigation/native";

type TabParamList = {
  FeedTab: undefined;
  SearchTab: undefined;
  CameraTab: undefined;
  NotificationTab: undefined;
  MeTab: undefined;
};

export type HomeNavStackParamsList = {
  Main: NavigatorScreenParams<TabParamList>;
  Upload: undefined;
  // UploadForm: undefined;
  UploadFormNav: undefined;
  Messages: undefined;
  EditNetworkVideo: undefined;
  FullScreenVideo: undefined;
};
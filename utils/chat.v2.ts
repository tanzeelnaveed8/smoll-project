import { IMessage } from "react-native-gifted-chat";
import Permissions, { PERMISSIONS } from "react-native-permissions";
import { Platform } from "react-native";
import ZIM, {
  ZIMConversationType,
  ZIMMediaMessageBase,
  ZIMMessage,
  ZIMMessageBase,
  ZIMMessagePriority,
  ZIMMessageType,
  ZIMMessageQueryConfig,
} from "zego-zim-react-native";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

let zim: ZIM;

const initializeChat = async (
  appID: string,
  appSign: string,
  userID: string,
  playerId: string,
  userName: string,
  userAvatar: string
) => {
  try {
    ZIM.create({
      appID: Number(appID),
      appSign: appSign as string,
    });

    zim = ZIM.getInstance();

    await zim.login(userID, {
      userName,
      token: "",
      isOfflineLogin: false,
    });

    await zim.updateUserAvatarUrl(userAvatar);
    await zim.updateUserExtendedData(
      JSON.stringify({
        playerId,
      })
    );
  } catch (error) {
    console.error("Failed to initialize ZIM SDK:", error);
  }
};

const requestPermissions = async (): Promise<boolean> => {
  const CALL_PERMISSIONS = Platform.select({
    android: [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ],
    ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
    default: [],
  });

  const permissionStatuses = await Promise.all(
    CALL_PERMISSIONS.map((permission) => Permissions.check(permission))
  );

  const permissionsToRequest = CALL_PERMISSIONS.filter(
    (_, index) => permissionStatuses[index] !== "granted"
  );

  if (permissionsToRequest.length > 0) {
    const result = await Permissions.requestMultiple(permissionsToRequest);
    return Object.values(result).every((value) => value === "granted");
  }

  return true;
};

const sendTypingStatus = async (channelUrl: string, isTyping: boolean) => {
  // if (!sb) return;
  // const channel: GroupChannel = await sb.groupChannel.getChannel(channelUrl);
  // if (isTyping) {
  //   channel.startTyping();
  // } else {
  //   channel.endTyping();
  // }
};

// Function to send messages to a group channel
const sendMessage = async (toUserId: string, messages: IMessage[]) => {
  if (!zim) {
    console.error("ZIM instance not initialized");
    return;
  }

  const sentMessages: ZIMMessage[] = [];

  const messagePromises = messages.map(async (message) => {
    if (message.image) {
      const mediaMessage = {
        type: ZIMMessageType.Image,
        fileLocalPath: message.image.replace("file://", ""),
        repliedInfo: message.repliedInfo,
      } as ZIMMediaMessageBase;
      return sendMediaMessage(zim, mediaMessage, toUserId);
    } else if (message.video) {
      const mediaMessage = {
        type: ZIMMessageType.Video,
        fileLocalPath: message.video.replace("file://", ""),
        repliedInfo: message.repliedInfo,
      } as ZIMMediaMessageBase;
      return sendMediaMessage(zim, mediaMessage, toUserId);
    } else if (message.audio) {
      const audioPath = message.audio.replace("file://", "");
      const fileExists = await checkFileExists(audioPath);

      if (!fileExists) {
        console.error("Audio file does not exist:", audioPath);
        return;
      }

      const { sound } = await Audio.Sound.createAsync({ uri: message.audio });
      const status = await sound.getStatusAsync();
      const durationMillis = status.isLoaded ? status.durationMillis : 0;

      const mediaMessage = {
        type: ZIMMessageType.Audio,
        fileLocalPath: audioPath,
        audioDuration: durationMillis ? Math.round(durationMillis / 1000) : 0, // Convert to seconds
        repliedInfo: message.repliedInfo,
      } as ZIMMediaMessageBase;

      return sendMediaMessage(zim, mediaMessage, toUserId);
    } else if (message.text) {
      const textMessage = {
        type: ZIMMessageType.Text,
        message: message.text,
        repliedInfo: message.repliedInfo,
      } as ZIMMessageBase;
      return sendTextMessage(zim, textMessage, toUserId);
    }
  });

  const results = await Promise.all(messagePromises);

  results.forEach((result) => {
    if (result) {
      sentMessages.push(result);
    }
  });

  return sentMessages;
};

// Add this helper function to check if a file exists
const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const { exists } = await FileSystem.getInfoAsync(filePath);
    return exists;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
};

const sendTextMessage = async (
  zim: ZIM,
  message: ZIMMessageBase,
  toUserId: string
) => {
  const config = { priority: ZIMMessagePriority.Low };

  try {
    const result = await zim.sendMessage(
      message,
      toUserId,
      ZIMConversationType.Peer,
      config
    );

    return result.message;
  } catch (error) {
    console.error("Error sending text message:", error);
  }
};

const sendMediaMessage = async (
  zim: ZIM,
  message: ZIMMediaMessageBase,
  toUserId: string
) => {
  const config = { priority: ZIMMessagePriority.Low };

  // const notification: ZIMMessageSendNotification = {
  //   onMediaUploadingProgress: (
  //     message: any,
  //     currentFileSize: number,
  //     totalFileSize: number
  //   ) => {
  //     console.log(
  //       `Upload progress: ${(currentFileSize / totalFileSize) * 100}%`
  //     );
  //   },
  // };

  try {
    const result = await zim.sendMediaMessage(
      message,
      toUserId,
      ZIMConversationType.Peer,
      config
      // notification
    );

    console.log("Media message sent successfully:", result.message);
    return result.message;
  } catch (error) {
    console.error("Error sending media message:", error);
  }
};

export const getMessages = async (
  conversationID: string,
  conversationType: ZIMConversationType,
  config: ZIMMessageQueryConfig
): Promise<ZIMMessage[]> => {
  if (!zim) {
    console.error("ZIM instance not initialized");
    return [];
  }

  try {
    const result = await zim.queryHistoryMessage(
      conversationID,
      conversationType,
      config
    );

    return result.messageList;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

const logout = () => {
  zim.logout();
  zim.destroy();
};

export {
  zim,
  initializeChat,
  sendMessage,
  sendTypingStatus,
  requestPermissions,
  logout,
};

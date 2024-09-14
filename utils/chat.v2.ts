import SendbirdChat from "@sendbird/chat";
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelModule,
} from "@sendbird/chat/groupChannel";
import {
  SendableMessage,
  SendbirdChatWith,
} from "@sendbird/chat/lib/__definition";
import { GroupChannelHandler } from "@sendbird/chat/groupChannel";
import {
  FileMessageCreateParams,
  MessageTypeFilter,
  PreviousMessageListQueryParams,
  UserMessageCreateParams,
} from "@sendbird/chat/message";
import { IMessage } from "react-native-gifted-chat";
import { SendbirdCalls } from "@sendbird/calls-react-native";
import { useUserStore } from "@/store/modules/user";
import Permissions, { PERMISSIONS } from "react-native-permissions";
import { Platform } from "react-native";

let sb: SendbirdChatWith<GroupChannelModule[]> | null = null;

const channelHandler = new GroupChannelHandler();

const initializeSendbird = async (
  userId: string,
  playerId: string,
  nickname: string,
  profileUrl: string
) => {
  try {
    sb = SendbirdChat.init({
      appId: process.env.EXPO_PUBLIC_SENDBIRD_APP_ID as string,
      modules: [new GroupChannelModule()],
    });

    sb.groupChannel.addGroupChannelHandler("UNIQUE_HANDLER_ID", channelHandler);
    await sb.connect(
      userId,
      process.env.EXPO_PUBLIC_SENDBIRD_ACCESS_TOKEN as string
    );
    await sb.updateCurrentUserInfo({ nickname, profileUrl });
    await sb.currentUser?.updateMetaData(
      {
        playerId: playerId,
      },
      true
    );

    await requestPermissions();

    SendbirdCalls.setLoggerLevel("info");
    SendbirdCalls.initialize(process.env.EXPO_PUBLIC_SENDBIRD_APP_ID as string);

    // Authenticate the user for calls
    await SendbirdCalls.authenticate({
      userId,
      accessToken: process.env.EXPO_PUBLIC_SENDBIRD_ACCESS_TOKEN as string,
    });

    SendbirdCalls.setListener({
      onRinging: async (call) => {
        console.log("trigger");
        const { SET_CALL_ID } = useUserStore.getState();

        SET_CALL_ID(call.callId);

        const directCall = await SendbirdCalls.getDirectCall(call.callId);

        const unsubscribe = directCall.addListener({
          onEnded() {
            unsubscribe();
          },
        });
      },
    });
  } catch (err) {
    console.log("error", err);
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
  if (!sb) return;

  const channel: GroupChannel = await sb.groupChannel.getChannel(channelUrl);

  if (isTyping) {
    channel.startTyping();
  } else {
    channel.endTyping();
  }
};

// Function to retrieve messages from a group channel
const getChannelMessages = async (channelUrl: string) => {
  try {
    if (!sb) return;

    const channel: GroupChannel = await sb.groupChannel.getChannel(channelUrl);

    const params: PreviousMessageListQueryParams = {
      limit: 20,
      reverse: false,
      messageTypeFilter: MessageTypeFilter.ALL,
      includeReactions: true,
    };
    const query = channel.createPreviousMessageListQuery(params);
    const messages = await query.load();

    console.log("messages", messages);

    return messages;
  } catch (error) {
    console.error("Error retrieving messages:", error);
  }
};

// Function to create a group channel
const connectGroupChannel = async (
  userId: string,
  expertId: string,
  groupName: string
) => {
  const params: GroupChannelCreateParams = {
    invitedUserIds: [userId, expertId],
    name: groupName,
    coverUrl: "https://example.com/cover.jpg", // Or use .coverImage to upload a cover image file
    isDistinct: true,
  };

  try {
    if (!sb) return;

    const channel: GroupChannel = await sb.groupChannel.createChannel(params);

    // Retrieve messages from the newly created channel
    const messages = await getChannelMessages(channel.url);
    return { channel, messages };
  } catch (error) {
    console.error("Error creating group channel:", error);
  }
};

// Function to send messages to a group channel
const sendMessage = async (channelUrl: string, messages: IMessage[]) => {
  try {
    if (!sb) return;

    const channel: GroupChannel = await sb.groupChannel.getChannel(channelUrl);
    const sentMessages: SendableMessage[] = []; // Array to collect sent messages

    const messagePromises = messages.map((message) => {
      if (message.image) {
        // Handle image message
        const params: FileMessageCreateParams = {
          file: {
            uri: message.image,
            name: message.image.split("/").pop() || "default.jpg", // Ensure name is always a string
            type: "image/jpeg", // Adjust the MIME type as needed
          },
          fileName: message.image.split("/").pop() || "default.jpg", // Ensure fileName is always a string
          customType: "image",
        };

        return new Promise((resolve, reject) => {
          channel
            .sendFileMessage(params)
            .onSucceeded((msg) => {
              console.log("Image message sent successfully:", msg);

              sentMessages.push(msg); // Collect sent message
              resolve(msg);
            })
            .onFailed((error) => {
              console.error("Error sending image message:", error);
              reject(error);
            });
        });
      } else if (message.text) {
        // Handle text message
        const params: UserMessageCreateParams = {
          message: message.text,
          customType: "text",
        };

        return new Promise((resolve, reject) => {
          channel
            .sendUserMessage(params)
            .onSucceeded((msg) => {
              console.log("Text message sent successfully:", msg);
              sentMessages.push(msg); // Collect sent message
              resolve(msg);
            })
            .onFailed((error) => {
              console.error("Error sending text message:", error);
              reject(error);
            });
        });
      }
      // Add similar handling for video and audio if needed
      return Promise.resolve(); // Return a resolved promise for non-handled message types
    });

    await Promise.all(messagePromises); // Wait for all messages to be sent
    return sentMessages; // Return the array of sent messages
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export {
  sb,
  channelHandler,
  initializeSendbird,
  connectGroupChannel,
  sendMessage,
  sendTypingStatus,
  requestPermissions,
};

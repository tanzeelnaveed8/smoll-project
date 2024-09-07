import SendbirdChat from "@sendbird/chat";
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelModule,
} from "@sendbird/chat/groupChannel";
import {
  GroupChannelListQueryParams,
  SendableMessage,
} from "@sendbird/chat/lib/__definition";

import { GroupChannelHandler } from "@sendbird/chat/groupChannel";

import {
  FileMessageCreateParams,
  MessageTypeFilter,
  PreviousMessageListQueryParams,
  UserMessageCreateParams,
} from "@sendbird/chat/message";
import { IMessage } from "react-native-gifted-chat";
import { NativeEventEmitter } from "react-native";

const sb = SendbirdChat.init({
  appId: "BA0CAD93-02C5-4AF4-87B4-AEB89048E67F",
  modules: [new GroupChannelModule()],
});

const eventEmitter = new NativeEventEmitter();

const initializeSendbird = async (
  userId: string,
  nickname: string,
  profileUrl: string
) => {
  try {
    const user = await sb.connect(userId);
    console.log("sendgbirduser=", user);

    await sb.updateCurrentUserInfo({ nickname, profileUrl });
  } catch (err) {
    // Handle error.
    console.log("sendbird err===_", err);
  }
};

// Add a channel event handler to listen for new messages
const channelHandler = new GroupChannelHandler();
channelHandler.onMessageReceived = (channel, message) => {
  eventEmitter.emit("messageReceived", message);
};

channelHandler.onTypingStatusUpdated = (channel) => {
  eventEmitter.emit("typingStatusUpdated", channel);
};

const sendTypingStatus = async (channelUrl: string, isTyping: boolean) => {
  try {
    const channel: GroupChannel = await sb.groupChannel.getChannel(channelUrl);
    console.log("chat.v2.ts typingStatusUpdated", isTyping);
    if (isTyping) {
      channel.startTyping();
    } else {
      channel.endTyping();
    }
  } catch (error) {
    console.error("Error updating typing status:", error);
  }
};

sb.groupChannel.addGroupChannelHandler("UNIQUE_HANDLER_ID", channelHandler);

//////////// tesign

// const testing = async () => {
//   const params = {
//     userIdsFilter: {
//       userIds: ["vjXJbuWcU4"],
//       includeMode: true,
//       queryType: "AND",
//     },
//   };

//   const query = sb.groupChannel.createMyGroupChannelListQuery(
//     params as GroupChannelListQueryParams
//   );
//   const channels = await query.next();

//   console.log("query---=", query);
//   console.log("query channels==", channels);

//   // Only channel A is returned in a result list through the groupChannels parameter of the callback function.
// };

// testing();

// //////////////////////

// Function to retrieve messages from a group channel
const getChannelMessages = async (channelUrl: string) => {
  try {
    const channel: GroupChannel = await sb.groupChannel.getChannel(channelUrl);

    const params: PreviousMessageListQueryParams = {
      limit: 20,
      reverse: false,
      messageTypeFilter: MessageTypeFilter.ALL,
      includeReactions: true,
    };
    const query = channel.createPreviousMessageListQuery(params);
    const messages = await query.load();

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
  initializeSendbird,
  connectGroupChannel,
  sendMessage,
  eventEmitter,
  sendTypingStatus,
};

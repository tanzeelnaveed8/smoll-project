import SendbirdChat from "@sendbird/chat";
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelModule,
} from "@sendbird/chat/groupChannel";
import { SendableMessage } from "@sendbird/chat/lib/__definition";

import { GroupChannelHandler } from "@sendbird/chat/groupChannel";

import {
  FileMessageCreateParams,
  MessageTypeFilter,
  PreviousMessageListQueryParams,
  UserMessageCreateParams,
} from "@sendbird/chat/message";
import { IMessage } from "react-native-gifted-chat";

const sb = SendbirdChat.init({
  appId: "BA0CAD93-02C5-4AF4-87B4-AEB89048E67F",
  modules: [new GroupChannelModule()],
});

const channelHandler = new GroupChannelHandler();

sb.groupChannel.addGroupChannelHandler("UNIQUE_HANDLER_ID", channelHandler);

const initializeSendbird = async (
  userId: string,
  nickname: string,
  profileUrl: string
) => {
  const user = await sb.connect(
    userId,
    "578655c97a30cd510663efe289dafbbd728770a6"
  );

  console.log("user", user);
  await sb.updateCurrentUserInfo({ nickname, profileUrl });
};

const sendTypingStatus = async (channelUrl: string, isTyping: boolean) => {
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
  channelHandler,
  initializeSendbird,
  connectGroupChannel,
  sendMessage,
  sendTypingStatus,
};

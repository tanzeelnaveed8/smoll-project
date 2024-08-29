import { useExpertStore } from "@/store/modules/expert";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { CometChatUIKit } from "@cometchat/chat-uikit-react-native";
import { PermissionsAndroid, Platform } from "react-native";
import { IMessage } from "react-native-gifted-chat";

const appId = process.env.EXPO_PUBLIC_COMETCHAT_APP_ID as string;
const region = process.env.EXPO_PUBLIC_COMETCHAT_REGION as string;
const authKey = process.env.EXPO_PUBLIC_COMETCHAT_AUTH_KEY as string;

const getPermissions = () => {
  if (Platform.OS == "android") {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

export class CometChatWrapper {
  static init() {
    let appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .autoEstablishSocketConnection(true)
      .build();

    CometChat.init(appId, appSetting);
  }

  static initUIKit(userId: string) {
    getPermissions();

    CometChatUIKit.init({
      appId: appId,
      authKey: authKey,
      region: region,
      subscriptionType: "ALL_USERS",
    }).then(() => {
      CometChatUIKit.login({ uid: userId });
    });
  }

  static getUser(userId: string) {
    return CometChat.getLoggedinUser().then(
      (user) => {
        if (!user) {
          return CometChat.login(userId.toLowerCase(), authKey).then(
            (user) => {
              console.log("Login Successful:", { user });
              return user;
            },
            (error) => {
              console.log("Login failed with exception:", { error });
              throw error;
            }
          );
        }
        return user;
      },
      (error) => {
        console.log("Some Error Occured", { error });
        throw error;
      }
    );
  }

  static sendMessage(receiverId: string, messageText: string) {
    const textMessage = new CometChat.TextMessage(
      receiverId,
      messageText,
      CometChat.RECEIVER_TYPE.USER
    );

    return CometChat.sendMessage(textMessage);
  }

  static sendMediaMessage(
    receiverId: string,
    imageUrl: any,
    messageType: string
  ) {
    let file = {
      name: "mario",
      extension: "png",
      mimeType: "image/png",
      url: imageUrl,
    };

    const mediaMessage = new CometChat.MediaMessage(
      receiverId,
      "",
      messageType,
      CometChat.RECEIVER_TYPE.USER
    );

    let attachment = new CometChat.Attachment(file);

    mediaMessage.setAttachment(attachment);

    console.log("mediaMessage", mediaMessage);

    return CometChat.sendMediaMessage(mediaMessage)
      .then((res) => {
        console.log("message sent successfully", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  static sendTypingIndicator(receiverId: string) {
    const typingIndicator = new CometChat.TypingIndicator(
      receiverId,
      CometChat.RECEIVER_TYPE.USER
    );
    CometChat.startTyping(typingIndicator);
  }

  static stopTypingIndicator(receiverId: string) {
    const typingIndicator = new CometChat.TypingIndicator(
      receiverId,
      CometChat.RECEIVER_TYPE.USER
    );
    CometChat.endTyping(typingIndicator);
  }

  static addListener(
    id: string,
    callback: (message: CometChat.BaseMessage) => void
  ) {
    CometChat.addMessageListener(
      id,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage) => {
          callback(textMessage);
        },

        onMediaMessageReceived: (mediaMessage) => {
          callback(mediaMessage);
        },
      })
    );
  }

  static removeListener(id: string) {
    CometChat.removeMessageListener(id);
  }

  static transformMessage(
    recipientId: string,
    message: CometChat.BaseMessage,
    chatFor: "experts" | "counsellors"
  ): IMessage {
    console.log("base", message);

    const userId = message.getSender().getUid();
    let text: string | undefined;
    let image: string | undefined;
    let video: string | undefined;

    if (message instanceof CometChat.TextMessage) {
      text = message.getText();
    } else if (message instanceof CometChat.MediaMessage) {
      const attachment = message.getAttachment();
      if (attachment) {
        const fileType = attachment.getMimeType();
        const fileUrl = attachment.getUrl();
        if (fileType.startsWith("image")) {
          image = fileUrl;
        } else if (fileType.startsWith("video")) {
          video = fileUrl;
        }
      }
    }

    // TODO: get avatar from store, because getAvatar() is returning null.
    let avatar = undefined;

    if (chatFor === "experts" && userId === recipientId.toLowerCase()) {
      const { expertDetailMap } = useExpertStore.getState();

      avatar = expertDetailMap.get(recipientId)?.profileImg?.url;
    }

    const createdAt = new Date(message.getSentAt() * 1000);

    return {
      _id: message.getId(),
      text: text || "",
      image,
      video,
      createdAt,
      user: {
        _id: userId,
        name: message.getSender().getName(),
        avatar,
      },
    };
  }

  static transformMediaMessage(
    recipientId: string,
    message: CometChat.MediaMessage,
    chatFor: "experts" | "counsellors"
  ): IMessage {
    const userId = message.getSender().getUid();
    const createdAt = new Date(message.getSentAt() * 1000);

    return {
      _id: message.getId(),
      image: message.getAttachment()?.url || "", // or any other relevant property
      createdAt,
      user: {
        _id: userId,
        name: message.getSender().getName(),
        avatar: undefined, // Handle avatar as needed
      },
    };
  }

  static async fetchMessages(
    recipientId: string,
    limit: number = 30,
    chatFor: "experts" | "counsellors",
    lastMessageId?: number
  ): Promise<IMessage[]> {
    console.log("fetchingMessages++");
    const messagesRequestBuilder = new CometChat.MessagesRequestBuilder()
      .setUID(recipientId.toLowerCase())
      .setLimit(limit);

    if (lastMessageId) {
      messagesRequestBuilder.setMessageId(lastMessageId);
    }

    const messagesRequest = messagesRequestBuilder.build();

    return messagesRequest.fetchPrevious().then((messages) => {
      let transformedMessages: IMessage[] = [];

      messages.forEach((message) => {
        if (message instanceof CometChat.TextMessage) {
          const msg = this.transformMessage(recipientId, message, chatFor);

          transformedMessages.push(msg);
        } else if (message instanceof CometChat.MediaMessage) {
          // Transform media messages similarly
          const mediaMsg = this.transformMediaMessage(
            recipientId,
            message,
            chatFor
          );

          transformedMessages.push(mediaMsg);
        }
      });

      transformedMessages = transformedMessages.sort(
        // @ts-ignore
        (a, b) => b.createdAt - a.createdAt
      );

      return transformedMessages;
    });
  }
}

import { useExpertStore } from "@/store/modules/expert";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { CometChatUIKit } from "@cometchat/chat-uikit-react-native";
import { PermissionsAndroid, Platform } from "react-native";
import { IMessage } from "react-native-gifted-chat";

const appId = "259470d3b9e30637";
const region = "in";
const authKey = "7f548f7be265876668136a6c1cb6b7b59f42bbee";

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
          return CometChat.login(userId, authKey).then(
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

  static sendMediaMessage(receiverId: string, file: any, messageType: string) {
    const mediaMessage = new CometChat.MediaMessage(
      receiverId,
      file,
      messageType,
      CometChat.RECEIVER_TYPE.USER
    );

    return CometChat.sendMediaMessage(mediaMessage).catch((err) => {
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
    const text = (message as CometChat.TextMessage).getText();
    const userId = message.getSender().getUid();
    // TODO: get avatar from store, because getAvatar() is returning null.
    let avatar = undefined;

    if (chatFor === "experts" && userId === recipientId.toLowerCase()) {
      const { expertDetailMap } = useExpertStore.getState();
      avatar = expertDetailMap.get(recipientId)?.profileImg?.url;
    }

    const createdAt = new Date(message.getSentAt() * 1000);

    return {
      _id: message.getId(),
      text: text,
      createdAt,
      user: {
        _id: userId,
        name: message.getSender().getName(),
        avatar,
      },
    };
  }

  static async fetchMessages(
    recipientId: string,
    limit: number = 30,
    chatFor: "experts" | "counsellors",
    lastMessageId?: number
  ): Promise<IMessage[]> {
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

          console.log("create", msg.createdAt);
          transformedMessages.push(msg);
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

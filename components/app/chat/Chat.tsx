import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
import { useSound } from "@/functions/useSound";
import { useUserStore } from "@/store/modules/user";
import { getMessages, sendMessage, zim } from "@/utils/chat.v2";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { Avatar, GiftedChat, IMessage } from "react-native-gifted-chat";
import { Div, Image, Text } from "react-native-magnus";
import {
  ZIMAudioMessage,
  ZIMConversationType,
  ZIMEventHandler,
  ZIMFileMessage,
  ZIMImageMessage,
  ZIMMessage,
  ZIMMessageQueryConfig,
  ZIMMessageType,
  ZIMTextMessage,
  ZIMVideoMessage,
} from "zego-zim-react-native";
import ChatBubble from "./ChatBubble";
import ChatComposer from "./ChatComposer";

interface Props {
  initialMessages: IMessage[];
  recipientId: string;
  chatFor: "experts" | "counsellors";
  chatWithName?: string;
}

const Chat: React.FC<Props> = (props) => {
  const { play } = useSound();
  const { user } = useUserStore();

  const [messages, setMessages] = useState<IMessage[]>(props.initialMessages);
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<
    number | null
  >(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchMessages();
  }, [props.recipientId]);

  useEffect(() => {
    if (isFocused) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [isFocused]);

  const transformMessages = (data: ZIMMessage[]) => {
    const transformedMessages = data.map((msg) => {
      const obj: IMessage = {
        _id: msg.messageID,
        text: "",
        createdAt: new Date(msg.timestamp),
        user: {
          _id: msg.senderUserID,
          name:
            msg.senderUserID === props.recipientId
              ? props.chatWithName
              : undefined,
          avatar: undefined,
        },
      };

      // Handle reply metadata from both sources
      if (msg.repliedInfo) {
        // Handle web replies
        obj.replyTo = {
          _id: msg.repliedInfo.messageID,
          text: msg.repliedInfo.messageInfo.message,
          user: {
            _id: msg.repliedInfo.senderUserID,
            name:
              msg.repliedInfo.senderUserID === props.recipientId
                ? props.chatWithName
                : undefined,
            avatar: undefined,
          },
          image:
            msg.repliedInfo.messageInfo.type === ZIMMessageType.Image
              ? (msg as ZIMImageMessage).fileDownloadUrl
              : undefined,
          video:
            msg.repliedInfo.messageInfo.type === ZIMMessageType.Video
              ? (msg as ZIMVideoMessage).fileDownloadUrl
              : undefined,
          audio:
            msg.repliedInfo.messageInfo.type === ZIMMessageType.Audio
              ? (msg as ZIMAudioMessage).fileDownloadUrl
              : undefined,
        };
      } else if (msg.extendedData) {
        // Handle app replies
        try {
          const extendedData = JSON.parse(msg.extendedData);
          if (extendedData.repliedInfo) {
            obj.replyTo = {
              _id: extendedData.repliedInfo.messageID,
              text: extendedData.repliedInfo.messageInfo.message,
              user: {
                _id: extendedData.repliedInfo.senderUserID,
                name:
                  extendedData.repliedInfo.senderUserID === props.recipientId
                    ? props.chatWithName
                    : undefined,
                avatar: undefined,
              },
              image:
                extendedData.repliedInfo.messageInfo.type ===
                ZIMMessageType.Image
                  ? extendedData.repliedInfo.messageInfo.fileDownloadUrl
                  : undefined,
              video:
                extendedData.repliedInfo.messageInfo.type ===
                ZIMMessageType.Video
                  ? extendedData.repliedInfo.messageInfo.fileDownloadUrl
                  : undefined,
              audio:
                extendedData.repliedInfo.messageInfo.type ===
                ZIMMessageType.Audio
                  ? extendedData.repliedInfo.messageInfo.fileDownloadUrl
                  : undefined,
            };
          }
        } catch (e) {
          console.error("Error parsing extendedData:", e);
        }
      }

      switch (msg.type) {
        case ZIMMessageType.Text:
          obj.text = (msg as ZIMTextMessage).message;
          break;
        case ZIMMessageType.Image:
          obj.image = (msg as ZIMImageMessage).fileDownloadUrl;
          break;
        case ZIMMessageType.Audio:
          obj.audio = (msg as ZIMAudioMessage).fileDownloadUrl;
          break;
        case ZIMMessageType.Video:
          obj.video = (msg as ZIMVideoMessage).fileDownloadUrl;
          break;
        case ZIMMessageType.File:
          // Handle other file types as attachments
          const fileMessage = msg as ZIMFileMessage;
          obj.text = `[ATTACHMENT]|${fileMessage.extendedData}|${fileMessage.fileDownloadUrl}`;
          break;
        default:
          obj.text = "Unsupported message type";
      }

      return obj;
    });

    return transformedMessages;
  };

  useEffect(() => {
    const eventHandler: Partial<ZIMEventHandler> = {
      receivePeerMessage: (zim, { messageList, fromConversationID }) => {
        const transformedMessages = transformMessages(messageList);

        setMessages((prevMessages) => [
          ...transformedMessages,
          ...prevMessages,
        ]);

        play("messageReceived");
      },
    };

    zim.on("receivePeerMessage", eventHandler.receivePeerMessage!);

    return () => {
      zim.off("receivePeerMessage");
    };
  }, []);

  // fetch messages
  const fetchMessages = async (isLoadingEarlier = false) => {
    if (!user) return;

    try {
      if (!isLoadingEarlier) {
        setIsLoading(true);
      } else {
        setIsLoadingEarlier(true);
      }

      const config: ZIMMessageQueryConfig = {
        count: 20,
        reverse: true,
      };

      if (lastMessageTimestamp) {
        config.nextMessage = { timestamp: lastMessageTimestamp } as ZIMMessage;
      }

      const messageList = await getMessages(
        props.recipientId,
        ZIMConversationType.Peer,
        config
      );

      console.log("messageList", JSON.stringify(messageList, null, 2));

      if (messageList.length === 0) {
        setHasMoreMessages(false);
      } else {
        setLastMessageTimestamp(messageList[messageList.length - 1].timestamp);
      }

      const transformedMessages = transformMessages(messageList);

      if (isLoadingEarlier) {
        setMessages((prevMessages) => [
          ...prevMessages,
          ...transformedMessages,
        ]);
      } else {
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingEarlier(false);
    }
  };

  const handleLoadEarlier = async () => {
    if (isLoadingEarlier || !hasMoreMessages) return;
    await fetchMessages(true);
  };

  const handleSend = async (newMessages: IMessage[] = []) => {
    try {
      if (newMessages[0].image) {
        setIsSending(true);
      }

      // Add reply metadata
      if (replyingTo) {
        let messageType = ZIMMessageType.Text;
        let messageContent = replyingTo.text || "";
        let fileDownloadUrl = undefined;

        if (replyingTo.image) {
          messageType = ZIMMessageType.Image;
          fileDownloadUrl = replyingTo.image;
        } else if (replyingTo.video) {
          messageType = ZIMMessageType.Video;
          fileDownloadUrl = replyingTo.video;
        } else if (replyingTo.audio) {
          messageType = ZIMMessageType.Audio;
          fileDownloadUrl = replyingTo.audio;
        }

        newMessages[0].extendedData = JSON.stringify({
          repliedInfo: {
            senderUserID: replyingTo.user._id.toString(),
            state: 0,
            messageID: replyingTo._id.toString(),
            sentTime: new Date(replyingTo.createdAt).getTime(),
            messageInfo: {
              message: messageContent,
              type: messageType,
              fileDownloadUrl: fileDownloadUrl,
            },
            messageSeq: parseInt(replyingTo._id.toString().slice(-3)),
          },
        });
      }

      const response = await sendMessage(props.recipientId, newMessages);

      if (!response) return;

      const transformedMessages = transformMessages(response);
      setMessages((prevMessages) => [...transformedMessages, ...prevMessages]);

      // Clear reply state after sending
      setReplyingTo(null);
    } finally {
      setIsSending(false);
    }

    return;
  };

  const handleReply = (message: IMessage) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  if (loading) {
    return (
      <Div flex={1} justifyContent="center" mt={-100}>
        <ActivityIndicator color={colorPrimary} size="large" />
      </Div>
    );
  }

  const showAvatar = (msg?: IMessage) => msg?.user.avatar;

  const emptyViewImgs = {
    cat: require("../../../assets/images/chat-screen-img.png"),
    dog: require("../../../assets/images/chat-screen-img-2.png"),
  };

  const imgTypes = ["cat", "dog"];
  const randomImgType = imgTypes[Math.floor(Math.random() * imgTypes.length)];

  const randomEmptyViewImg =
    emptyViewImgs[randomImgType as keyof typeof emptyViewImgs];

  const style = () => {
    if (randomImgType === "cat") {
      return Platform.OS === "android"
        ? { transform: [{ translateX: -70 }] }
        : { transform: [{ translateX: -50 }] };
    }

    return {};
  };

  const chatWithName = props.chatWithName;

  const ChatEmptyView = () => {
    return (
      <Div flex={1}>
        <Div
          style={
            Platform.OS === "android"
              ? { transform: [{ rotate: "180deg" }] }
              : { transform: [{ rotate: "180deg" }, { rotateY: "180deg" }] }
          }
          flex={1}
          mt={20}
          justifyContent="space-between"
        >
          <Div px={20} pt={5} flex={1}>
            <Image
              source={randomEmptyViewImg}
              resizeMode="contain"
              h={200}
              style={style()}
              mb={15}
            />

            <Text
              fontFamily={fontHauoraSemiBold}
              fontSize={"2xl"}
              maxW={"70%"}
              mb={10}
            >
              Hi! Welcome to your messaging room.
            </Text>
            <Text maxW={"90%"}>
              It's just{" "}
              <Text fontFamily={fontHauoraSemiBold}>
                you and {props.chatWithName}
              </Text>{" "}
              in here. Feel free to chat, send pictures, files, or even voice
              notes.
            </Text>
          </Div>
        </Div>
      </Div>
    );
  };

  return (
    <GiftedChat
      messages={messages.sort((a, b) => +b.createdAt - +a.createdAt)}
      onSend={(messages) => handleSend(messages)}
      onLoadEarlier={handleLoadEarlier}
      isLoadingEarlier={isLoadingEarlier}
      loadEarlier={hasMoreMessages}
      isTyping={isTyping}
      user={{
        _id: user!.id,
      }}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      renderBubble={(props) => (
        <ChatBubble {...props} onReply={(message) => handleReply(message)} />
      )}
      renderAvatar={(props) =>
        showAvatar(props.currentMessage) ? <Avatar {...props} /> : null
      }
      listViewProps={{ showsVerticalScrollIndicator: false }}
      renderInputToolbar={(props) => (
        <ChatComposer
          {...props}
          isSending={isSending}
          channelUrl={channelUrl || ""}
          replyingTo={replyingTo}
          onCancelReply={cancelReply}
          expertName={chatWithName}
        />
      )}
      renderChatFooter={() => <Div h={24}></Div>}
      renderChatEmpty={ChatEmptyView}
    />
  );
};

export default Chat;

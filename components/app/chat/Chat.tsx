import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
import { useSound } from "@/functions/useSound";
import { useUserStore } from "@/store/modules/user";
import { getMessages, sendMessage, zim } from "@/utils/chat.v2";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Avatar, GiftedChat, IMessage } from "react-native-gifted-chat";
import { Div, Image, ScrollDiv, Text } from "react-native-magnus";
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
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

interface Attachment {
  fileName: string;
  url: string;
  type: string; // e.g., 'image', 'video', 'audio', 'file'
}

interface Props {
  initialMessages: IMessage[];
  recipientId: string;
  chatFor: "experts" | "counsellors";
  chatWithName?: string;
}

const Chat: React.FC<Props> = (props) => {
  const { play } = useSound();
  const { user } = useUserStore();
  const navigation = useNavigation();
  const route = useRoute();

  const [messages, setMessages] = useState<IMessage[]>(props.initialMessages);

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showLoadEarlierBtn, setShowLoadEarlierBtn] = useState(true);
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
          name: undefined,
          avatar: undefined,
        },
      };

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

      const response = await sendMessage(props.recipientId, newMessages);

      if (!response) return;

      const transformedMessages = transformMessages(response);
      setMessages((prevMessages) => [...transformedMessages, ...prevMessages]);
    } finally {
      setIsSending(false);
    }

    return;
  };

  if (loading) {
    return (
      <Div flex={1} justifyContent="center" mt={-100}>
        <ActivityIndicator color={colorPrimary} size="large" />
      </Div>
    );
  }

  const showAvatar = (msg?: IMessage) => msg?.user.avatar;

  const renderChatEmpty = () => (
    <Div
      justifyContent="center"
      alignItems="center"
      style={{
        transform:
          Platform.OS !== "android" ? [{ scaleY: -1 }] : [{ rotate: "180deg" }],
      }}
    >
      <ChatBubble
        position="left"
        currentMessage={{
          _id: "000",
          createdAt: new Date(),
          text:
            props.chatFor === "experts"
              ? "Welcome to Smoll Expert Chat!👋"
              : "Welcome to Smoll Counsellor Chat!👋",
          user: {
            _id: "0001",
            avatar: "",
            name: "",
          },
        }}
      />
      <ChatBubble
        position="left"
        currentMessage={{
          _id: "000",
          createdAt: new Date(),
          text:
            props.chatFor === "experts"
              ? `Message ${props.chatWithName} to start the conversation!`
              : `${props.chatWithName} will be your dedicated counsellor!`,
          user: {
            _id: "0001",
            avatar: "",
            name: "",
          },
        }}
      />
    </Div>
  );

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
      renderBubble={(props) => <ChatBubble {...props} />}
      renderAvatar={(props) =>
        showAvatar(props.currentMessage) ? <Avatar {...props} /> : null
      }
      listViewProps={{ showsVerticalScrollIndicator: false }}
      renderInputToolbar={(props) => (
        <ChatComposer
          {...props}
          isSending={isSending}
          channelUrl={channelUrl || ""}
        />
      )}
      renderChatFooter={() => <Div h={24}></Div>}
      renderChatEmpty={() => (
        <Div flex={1}>
          <Div
            style={
              Platform.OS === "android"
                ? { transform: [{ rotate: "180deg" }] }
                : {}
            }
            flex={1}
            mt={20}
            justifyContent="space-between"
          >
            <Div px={20} pt={5} flex={1}>
              <Image
                source={require("../../../assets/images/chat-screen-img.png")}
                resizeMode="contain"
                h={200}
                style={{ transform: [{ translateX: -70 }] }}
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
      )}
    />
  );
};

export default Chat;

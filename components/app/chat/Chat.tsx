import { colorPrimary } from "@/constant/constant";
import { useUserStore } from "@/store/modules/user";
import { CometChatWrapper } from "@/utils/chat";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Avatar, GiftedChat, IMessage } from "react-native-gifted-chat";
import { Div, Image } from "react-native-magnus";
import ChatBubble from "./ChatBubble";
import ChatComposer from "./ChatComposer";
import { useSound } from "@/functions/useSound";
import SendbirdChat from "@sendbird/chat";
import {
  OpenChannelModule,
  SendbirdOpenChat,
} from "@sendbird/chat/openChannel";
import {
  connectGroupChannel,
  eventEmitter,
  sb,
  sendMessage,
} from "@/utils/chat.v2";
import { SendBirdExtendedBaseMessage } from "@/store/types";
import {
  BaseMessage,
  MessageCollectionEventHandler,
} from "@sendbird/chat/lib/__definition";

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
  // This is only for cometchat
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [lastMessagesEmpty, setLastMessagesEmpty] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showLoadEarlierBtn, setShowLoadEarlierBtn] = useState(true);

  const lastMessageIdRef = useRef<number>();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [props.recipientId]);

  useEffect(() => {
    let receiving = false;

    CometChatWrapper.addListener("chat", (message) => {
      if (receiving) return;

      if (message.getSender().getUid() !== props.recipientId.toLowerCase())
        return;

      play("message");

      receiving = true;

      setTimeout(() => {
        receiving = false;
      }, 500);
    });

    const listenerId = "TYPING_LISTENER";

    CometChat.addMessageListener(
      listenerId,
      new CometChat.MessageListener({
        // @ts-expect-error - no type provided
        onTypingStarted: (typingIndicator) => {
          if (typingIndicator.sender.uid === props.recipientId.toLowerCase()) {
            setIsTyping(true);
          }
        },
        // @ts-expect-error - no type provided
        onTypingEnded: (typingIndicator) => {
          if (typingIndicator.sender.uid === props.recipientId.toLowerCase()) {
            setIsTyping(false);
          }
        },
      })
    );

    return () => {
      CometChatWrapper.removeListener("chat");
      CometChat.removeMessageListener(listenerId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [props.recipientId]);

  const handleTranformSendbirdMessage = (data: BaseMessage[]) => {
    const transformedMessages = data.map((msg) => {
      const extendedMsg = msg as SendBirdExtendedBaseMessage;

      const obj: IMessage = {
        _id: extendedMsg.messageId,
        text: extendedMsg.message,
        createdAt: extendedMsg.createdAt,
        image: extendedMsg.plainUrl,
        user: {
          _id: extendedMsg.sender?.userId,
          name: extendedMsg.sender?.nickname,
          avatar: extendedMsg.sender?.profileUrl,
        },
      };

      return obj;
    });

    return transformedMessages;
  };

  useEffect(() => {
    eventEmitter.addListener("messageReceived", (message: BaseMessage) => {
      const transformedMessage = handleTranformSendbirdMessage([message]);
      console.log("messaged received transformedMessages", transformedMessage);
      setMessages((prevMessages) => [...transformedMessage, ...prevMessages]);
    });

    eventEmitter.addListener("typingStatusUpdated", (channel) => {
      console.log("typingStatusUpdated", channel);
    });
  }, []);

  // fetch messages
  const fetchMessages = async (isLoadingEarlier = false) => {
    // const waqarExpertId = "123456";
    if (!user) return;

    try {
      if (!isLoadingEarlier) {
        setIsLoading(true);
      } else {
        setIsLoadingEarlier(true);
      }

      const groupName = `${props.recipientId}-${user?.id}`;
      const response = await connectGroupChannel(
        user.id, // customer/client id
        props.recipientId, // provider/vet/expert id
        groupName
      );

      console.log("fetch messages response", response);

      if (response?.channel) {
        setChannelUrl(response?.channel.url);
      }

      if (!response?.messages) return;

      const transformedMessages = handleTranformSendbirdMessage(
        response.messages
      );
      if (transformedMessages.length === 0) {
        setShowLoadEarlierBtn(false);
      }

      setMessages(transformedMessages);

      if (response.messages.length === 0) {
        setLastMessagesEmpty(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsLoadingEarlier(false);
    }
  };

  const handleLoadEarlier = async () => {
    if (isLoadingEarlier || !channelUrl) return;

    setIsLoadingEarlier(true);

    try {
      const channel = await sb.groupChannel.getChannel(channelUrl);
      const oldestMessage = messages[messages.length - 1];
      const previousMessages = await channel.getMessagesByTimestamp(
        +oldestMessage.createdAt,
        {
          // messageType: "MESG", // Adjust this if needed
          nextResultSize: 0,
          prevResultSize: 20, // Number of messages to fetch
          includeMetaArray: true,
          includeReactions: true,
        }
      );

      console.log("previousMessages==", previousMessages);
      if (previousMessages.length === 0) {
        setShowLoadEarlierBtn(false);
      }

      const transformedMessages =
        handleTranformSendbirdMessage(previousMessages);
      setMessages((prevMessages) => [...prevMessages, ...transformedMessages]);
    } catch (error) {
      console.error("Failed to load earlier messages:", error);
    } finally {
      setIsLoadingEarlier(false);
    }
  };

  const handleSend = async (newMessages: IMessage[] = []) => {
    if (!channelUrl) return;
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, newMessages)

    console.log("newMessages", newMessages);

    try {
      if (newMessages[0].image) {
        setIsSending(true);
      }
      const response = await sendMessage(channelUrl, newMessages);
      console.log("sendbird message response sent", response);

      if (!response) return;
      const transformedMessages = handleTranformSendbirdMessage(response);
      setMessages((prevMessages) => [...transformedMessages, ...prevMessages]);
    } finally {
      setIsSending(false);
    }

    return;
    // Send message to CometChat
    newMessages.forEach((message) => {
      if (message.image) {
        // Handle media message
        // TODO: fix
        CometChatWrapper.sendMediaMessage(
          props.recipientId,
          message.image,
          CometChat.MESSAGE_TYPE.IMAGE
        );
        // TODO: Handle upload fail
        // .then(
        //   (msg) => {
        //     console.log("Media message sent successfully:", msg);
        //   },
        //   (error) => {
        //     console.log("Media message sending failed with error:", error);
        //   }
        // );
      } else {
        // Handle text message
        CometChatWrapper.sendMessage(props.recipientId, message.text);
      }
    });
  };

  const handleInputTextChanged = (text: string) => {
    const typingNotification = new CometChat.TypingIndicator(
      props.recipientId.toLowerCase(),
      CometChat.RECEIVER_TYPE.USER
    );

    if (text.length > 0) {
      // Start typing
      CometChat.startTyping(typingNotification);

      // Clear existing timeout (if any)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timeout
      typingTimeoutRef.current = setTimeout(() => {
        CometChat.endTyping(typingNotification);
      }, 1000); // End typing after 5 seconds of inactivity
    } else {
      // End typing
      CometChat.endTyping(typingNotification);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  if (loading && !loggedInUser) {
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
        transform: [{ scaleY: -1 }],
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
      loadEarlier={messages.length > 0 && showLoadEarlierBtn}
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
          loggedInUser={loggedInUser!}
          isSending={isSending}
          channelUrl={channelUrl || ""}
        />
      )}
      renderChatFooter={() => <Div h={24}></Div>}
      renderChatEmpty={renderChatEmpty}
      onInputTextChanged={handleInputTextChanged}
      renderMessageImage={(props) => (
        <Image
          source={{
            uri: props?.currentMessage?.image,
            method: "GET",
            headers: {
              "Api-Token": "578655c97a30cd510663efe289dafbbd728770a6",
              Accept: "*/*",
              "Access-Control-Allow-Origin": "*",
            },
          }}
          style={{ width: 160, height: 100 }}
        />
      )}
    />
  );
};

export default Chat;

import { colorPrimary } from "@/constant/constant";
import { useUserStore } from "@/store/modules/user";
import { CometChatWrapper } from "@/utils/chat";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Avatar, GiftedChat, IMessage } from "react-native-gifted-chat";
import { Div } from "react-native-magnus";
import ChatBubble from "./ChatBubble";
import ChatComposer from "./ChatComposer";
import { useSound } from "@/functions/useSound";

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

  const lastMessageIdRef = useRef<number>();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [props.recipientId]);

  useEffect(() => {
    let receiving = false;

    CometChatWrapper.addListener("chat", (message) => {
      if (receiving) return;

      play("message");

      receiving = true;

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          CometChatWrapper.transformMessage(
            props.recipientId,
            message,
            props.chatFor
          ),
        ])
      );

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

  const fetchMessages = async (isLoadingEarlier = false) => {
    try {
      if (!isLoadingEarlier) {
        setIsLoading(true);
      } else {
        setIsLoadingEarlier(true);
      }

      const _user = await CometChatWrapper.getUser(user!.id);
      const fetchedMessages = await CometChatWrapper.fetchMessages(
        props.recipientId,
        10,
        props.chatFor,
        isLoadingEarlier ? lastMessageIdRef.current : undefined
      );

      if (fetchedMessages.length > 0) {
        // Always update the lastMessageIdRef with the oldest message
        lastMessageIdRef.current = Number(
          fetchedMessages[fetchedMessages.length - 1]._id
        );

        setMessages((prevMessages) => {
          if (isLoadingEarlier) {
            // For loading earlier messages, add them before the existing messages
            return [...prevMessages, ...fetchedMessages];
          } else {
            // For initial load, replace all messages
            return fetchedMessages;
          }
        });
      }

      if (fetchedMessages.length === 0) {
        setLastMessagesEmpty(true);
      }

      if (!isLoadingEarlier) {
        setLoggedInUser(_user);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingEarlier(false);
    }
  };

  const handleLoadEarlier = async () => {
    if (isLoadingEarlier) return;

    setIsLoadingEarlier(true);
    await fetchMessages(true);
  };

  const handleSend = (newMessages: IMessage[] = []) => {
    console.log("handleSend newMEssages", newMessages);

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

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
      messages={messages}
      onSend={(messages) => handleSend(messages)}
      onLoadEarlier={handleLoadEarlier}
      isLoadingEarlier={isLoadingEarlier}
      loadEarlier={messages.length > 0}
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
        <ChatComposer {...props} loggedInUser={loggedInUser!} />
      )}
      renderChatFooter={() => <Div h={24}></Div>}
      renderChatEmpty={renderChatEmpty}
      onInputTextChanged={handleInputTextChanged}
    />
  );
};

export default Chat;

import { Avatar, Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import ChatComposer from "./ChatComposer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import { Div } from "react-native-magnus";
import { CometChatWrapper } from "@/utils/chat";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { colorPrimary } from "@/constant/constant";
import { ActivityIndicator } from "react-native";
import { useUserStore } from "@/store/modules/user";

interface Props {
  initialMessages: IMessage[];
  recipientId: string;
  chatFor: "experts" | "counsellors";
}

const Chat: React.FC<Props> = (props) => {
  const { user } = useUserStore();
  const [messages, setMessages] = useState<IMessage[]>(props.initialMessages);
  // This is only for cometchat
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [lastMessagesEmpty, setLastMessagesEmpty] = useState(false);

  const lastMessageIdRef = useRef<number>();

  useEffect(() => {
    fetchMessages();
  }, [props.recipientId]);

  useEffect(() => {
    CometChatWrapper.addListener("chat", (message) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          CometChatWrapper.transformMessage(
            props.recipientId,
            message,
            props.chatFor
          ),
        ])
      );
    });

    return () => {
      CometChatWrapper.removeListener("chat");
    };
  }, []);

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

      console.log("f", fetchedMessages);

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

    console.log("trigger");

    setIsLoadingEarlier(true);
    await fetchMessages(true);
  };

  const handleSend = (newMessages: IMessage[] = []) => {
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

  if (loading && !loggedInUser) {
    return (
      <Div flex={1} justifyContent="center" mt={-100}>
        <ActivityIndicator color={colorPrimary} size="large" />
      </Div>
    );
  }

  const showAvatar = (msg?: IMessage) => msg?.user.avatar;

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => handleSend(messages)}
      onLoadEarlier={handleLoadEarlier}
      isLoadingEarlier={isLoadingEarlier}
      loadEarlier
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
    />
  );
};

export default Chat;

import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import ChatComposer from "./ChatComposer";
import { useEffect, useState } from "react";
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
}

const Chat: React.FC<Props> = (props) => {
  const { user } = useUserStore();
  const [messages, setMessages] = useState<IMessage[]>(props.initialMessages);
  // This is only for cometchat
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [props.recipientId]);

  useEffect(() => {
    CometChatWrapper.addListener("counsellor-msg", (message) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );
    });

    return () => {
      CometChatWrapper.removeListener("counsellor-msg");
    };
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);

      const _user = await CometChatWrapper.getUser(user!.id);
      const messages = await CometChatWrapper.fetchMessages(
        user!.id.toLowerCase(),
        props.recipientId.toLowerCase()
      );

      setMessages(messages);

      setLoggedInUser(_user);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => handleSend(messages)}
      user={{
        _id: user!.id,
      }}
      renderBubble={(props) => <ChatBubble {...props} />}
      renderInputToolbar={(props) => (
        <ChatComposer {...props} loggedInUser={loggedInUser!} />
      )}
      renderChatFooter={() => <Div h={24}></Div>}
    />
  );
};

export default Chat;

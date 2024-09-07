import { colorPrimary } from "@/constant/constant";
import { useSound } from "@/functions/useSound";
import { useUserStore } from "@/store/modules/user";
import { SendBirdExtendedBaseMessage } from "@/store/types";
import {
  channelHandler,
  connectGroupChannel,
  sb,
  sendMessage,
} from "@/utils/chat.v2";
import { BaseMessage, GroupChannel } from "@sendbird/chat/lib/__definition";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Avatar, GiftedChat, IMessage } from "react-native-gifted-chat";
import { Div, Image } from "react-native-magnus";
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

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showLoadEarlierBtn, setShowLoadEarlierBtn] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [props.recipientId]);

  const handleTranformSendbirdMessage = (data: BaseMessage[]) => {
    const transformedMessages = data.map((msg) => {
      const extendedMsg = msg as SendBirdExtendedBaseMessage;

      const obj: IMessage = {
        _id: extendedMsg.messageId,
        text: extendedMsg.message,
        createdAt: extendedMsg.createdAt,
        // Add authentication to the image URL
        // @ts-expect-error - has url in it but due to wrong type it is not showing.
        image: extendedMsg.url ? `${extendedMsg.url}` : undefined,
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
    channelHandler.onMessageReceived = (channel, message) => {
      const transformedMessage = handleTranformSendbirdMessage([message]);
      setMessages((prevMessages) => [...transformedMessage, ...prevMessages]);

      play("message");
    };
  }, []);

  useEffect(() => {
    const handleTypingStatusUpdated = (channel: GroupChannel) => {
      if (channel.url === channelUrl) {
        const typingMembers = channel.getTypingUsers();

        const isRecipientTyping = typingMembers.some(
          (member) => member.userId === props.recipientId
        );

        setIsTyping(isRecipientTyping);
      }
    };

    channelHandler.onTypingStatusUpdated = handleTypingStatusUpdated;
  }, [channelUrl, props.recipientId]);

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
          nextResultSize: 0,
          prevResultSize: 20, // Number of messages to fetch
          includeMetaArray: true,
          includeReactions: true,
        }
      );

      if (previousMessages.length === 0) {
        setShowLoadEarlierBtn(false);
      }

      const transformedMessages =
        handleTranformSendbirdMessage(previousMessages);
      setMessages((prevMessages) => [...prevMessages, ...transformedMessages]);
    } finally {
      setIsLoadingEarlier(false);
    }
  };

  const handleSend = async (newMessages: IMessage[] = []) => {
    if (!channelUrl) return;

    try {
      if (newMessages[0].image) {
        setIsSending(true);
      }

      const response = await sendMessage(channelUrl, newMessages);

      if (!response) return;

      const transformedMessages = handleTranformSendbirdMessage(response);
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
          isSending={isSending}
          channelUrl={channelUrl || ""}
        />
      )}
      renderChatFooter={() => <Div h={24}></Div>}
      renderChatEmpty={renderChatEmpty}
    />
  );
};

export default Chat;

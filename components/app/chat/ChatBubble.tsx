import { useUserStore } from "@/store/modules/user";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Bubble } from "react-native-gifted-chat";

import { BubbleProps, IMessage } from "react-native-gifted-chat";

interface Props extends BubbleProps<IMessage> {}

const commonWrapperStyles: StyleProp<ViewStyle> = {
  paddingTop: 12,
  paddingBottom: 12,
  paddingRight: 4,
  paddingLeft: 4,
  marginBottom: 14,
};

const rightWrapperStyles: StyleProp<ViewStyle> = {
  ...commonWrapperStyles,
  borderTopRightRadius: 24,
  borderTopLeftRadius: 24,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 24,
  backgroundColor: "#222",
};

const leftWrapperStyles: StyleProp<ViewStyle> = {
  ...commonWrapperStyles,
  borderTopRightRadius: 24,
  borderTopLeftRadius: 24,
  borderBottomRightRadius: 24,
  borderBottomLeftRadius: 0,
  backgroundColor: "#F4F6F8",
};

const leftTextStyles: StyleProp<TextStyle> = {
  color: "#222",
};

const rightTextStyles: StyleProp<TextStyle> = {
  color: "#fff",
};

const ChatBubble: React.FC<Props> = (props) => {
  const { user } = useUserStore();

  const position =
    props.currentMessage?.user._id.toString().toLowerCase() ===
    user?.id.toLowerCase()
      ? "right"
      : "left";

  return (
    <Bubble
      {...props}
      position={position}
      wrapperStyle={{
        right: rightWrapperStyles,
        left: leftWrapperStyles,
      }}
      textStyle={{
        right: rightTextStyles,
        left: leftTextStyles,
      }}
    />
  );
};

export default ChatBubble;

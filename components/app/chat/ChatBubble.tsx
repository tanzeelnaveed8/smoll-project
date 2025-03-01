import { useUserStore } from "@/store/modules/user";
import {
  IconPaperclip,
  IconPlayerPlay,
  IconPlayerPause,
  IconArrowBackUp,
} from "@tabler/icons-react-native";
import {
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Bubble, MessageText, Time } from "react-native-gifted-chat";
import { BubbleProps, IMessage } from "react-native-gifted-chat";
import { Div, Text } from "react-native-magnus";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import { Alert } from "react-native";

interface Props extends BubbleProps<IMessage> {
  onReply?: (message: IMessage) => void;
}

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

const replyWrapperStyles: StyleProp<ViewStyle> = {
  padding: 8,
  marginBottom: 4,
  borderRadius: 12,
  maxWidth: "90%",
};

const rightReplyWrapperStyles: StyleProp<ViewStyle> = {
  ...replyWrapperStyles,
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  marginLeft: 8,
};

const leftReplyWrapperStyles: StyleProp<ViewStyle> = {
  ...replyWrapperStyles,
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  marginRight: 8,
};

const ChatBubble: React.FC<Props> = (props) => {
  const { user } = useUserStore();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const position =
    props.currentMessage?.user._id.toString().toLowerCase() ===
    user?.id.toLowerCase()
      ? "right"
      : "left";

  const isAudioMessage = !!props.currentMessage?.audio;

  const getWrapperStyle = (
    position: "left" | "right"
  ): StyleProp<ViewStyle> => {
    const baseStyle =
      position === "right" ? rightWrapperStyles : leftWrapperStyles;

    return isAudioMessage
      ? { ...baseStyle, backgroundColor: "transparent" }
      : baseStyle;
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (!props.currentMessage?.audio) return;

    (async () => {
      try {
        // Load the audio
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: props.currentMessage?.audio || "" },
          { shouldPlay: false, volume: 1 },
          (status) => {
            if (status.error) {
              console.error("Error loading audio:", status.error);
              setLoadError("Failed to load audio. The file may be damaged.");
            }
          }
        );
        setSound(newSound);

        const status = await newSound.getStatusAsync();

        if (status.isLoaded) {
          setDuration(status.durationMillis ?? 0);
          setCurrentTime(status.durationMillis ?? 0);
        }

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setIsPlaying(false);
              setCurrentTime(status.durationMillis ?? 0);
            } else {
              setCurrentTime(
                status.durationMillis! - (status.positionMillis ?? 0)
              );
            }
          }
        });
      } catch (error) {
        console.error("Error loading audio:", error);
        setLoadError("Failed to load audio. Please try again.");
      }
    })();
  }, [props.currentMessage]);

  const renderAttachment = (text: string) => {
    if (!text.startsWith("[ATTACHMENT]")) return null;

    const [, fileName, url] = text.split("|");

    const handlePress = () => {
      Linking.openURL(url).catch((err) =>
        console.error("An error occurred", err)
      );
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <Div
          alignItems="center"
          bg={position === "left" ? "#E0E0E0" : "#333"}
          p={8}
          pr={12}
          rounded={8}
          mb={4}
          flexDir="row"
          minW={"fit-content"}
        >
          <Div mr={8}>
            <IconPaperclip
              fontSize={24}
              color={position === "left" ? "#333" : "#FFF"}
            />
          </Div>
          <Div>
            <Text
              fontSize={14}
              fontWeight="bold"
              color={position === "left" ? "#333" : "#FFF"}
              numberOfLines={1}
            >
              {fileName}
            </Text>
          </Div>
        </Div>
      </TouchableOpacity>
    );
  };

  const handlePlayPause = async () => {
    if (!props.currentMessage?.audio) return;

    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReply = () => {
    if (props.currentMessage && props.onReply) {
      props.onReply(props.currentMessage);
    }
  };

  const renderReplyButton = () => {
    if (!props.onReply) return null;

    return (
      <TouchableOpacity onPress={handleReply} style={{ marginRight: 10 }}>
        <Div p={4} justifyContent="center" alignItems="center">
          <IconArrowBackUp
            size={18}
            color={position === "left" ? "#666" : "#BBB"}
          />
        </Div>
      </TouchableOpacity>
    );
  };

  const renderRepliedMessage = () => {
    const { currentMessage } = props;
    if (!currentMessage?.replyTo) return null;

    const isRepliedMessageFromCurrentUser =
      currentMessage.replyTo.user._id.toString().toLowerCase() ===
      user?.id.toLowerCase();

    const replyStyle =
      position === "right" ? rightReplyWrapperStyles : leftReplyWrapperStyles;

    const replyTextColor =
      position === "right" ? "rgba(255, 255, 255, 0.7)" : "#666";

    return (
      <Div style={replyStyle}>
        <Text fontSize={12} color={replyTextColor} fontWeight="bold" mb={2}>
          {isRepliedMessageFromCurrentUser
            ? "You"
            : currentMessage.replyTo.user.name || "User"}
        </Text>
        <Text fontSize={12} color={replyTextColor} numberOfLines={1}>
          {currentMessage.replyTo.text ||
            (currentMessage.replyTo.image
              ? "[Image]"
              : currentMessage.replyTo.audio
              ? "[Audio]"
              : currentMessage.replyTo.video
              ? "[Video]"
              : "[File]")}
        </Text>
      </Div>
    );
  };

  const renderAudioPlayer = () => {
    const formatDuration = (milliseconds: number | null) => {
      if (!milliseconds) return "00:00";

      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    };

    if (loadError) {
      return (
        <Div
          alignItems="center"
          bg={position === "left" ? "#E0E0E0" : "#333"}
          p={8}
          pr={12}
          rounded={8}
          mb={2}
          flexDir="row"
          minW={"fit-content"}
        >
          <Text fontSize={12} color={position === "left" ? "#666" : "#CCC"}>
            {loadError}
          </Text>
        </Div>
      );
    }

    return (
      <TouchableOpacity onPress={handlePlayPause}>
        <Div
          alignItems="center"
          bg={position === "left" ? "#E0E0E0" : "#333"}
          p={8}
          pr={12}
          rounded={8}
          mb={2}
          flexDir="row"
          minW={"fit-content"}
        >
          <Div mr={8}>
            {isPlaying ? (
              <IconPlayerPause
                fontSize={24}
                color={position === "left" ? "#333" : "#FFF"}
              />
            ) : (
              <IconPlayerPlay
                fontSize={24}
                color={position === "left" ? "#333" : "#FFF"}
              />
            )}
          </Div>
          <Div flex={1}>
            <Text
              fontSize={12}
              color={position === "left" ? "#666" : "#CCC"}
              textAlign="right"
            >
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </Text>
          </Div>
        </Div>
      </TouchableOpacity>
    );
  };

  if (props.currentMessage?.text?.startsWith("[ATTACHMENT]")) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: "transparent" },
          right: { backgroundColor: "transparent" },
        }}
        renderMessageText={() => (
          <Div>
            {renderRepliedMessage()}
            {renderAttachment(props.currentMessage?.text || "")}
            <Div row justifyContent="flex-end">
              {renderReplyButton()}
              <Time
                {...props}
                timeTextStyle={{ right: { fontSize: 10, color: "#666" } }}
              />
            </Div>
          </Div>
        )}
      />
    );
  }

  if (isAudioMessage) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: "transparent" },
          right: { backgroundColor: "transparent" },
        }}
        renderMessageText={() => (
          <Div>
            {renderRepliedMessage()}
            {renderAudioPlayer()}
            <Div row justifyContent="flex-end">
              {renderReplyButton()}
              <Time
                {...props}
                timeTextStyle={{
                  right: { fontSize: 10, color: "#666" },
                  left: { fontSize: 10, color: "#666" },
                }}
              />
            </Div>
          </Div>
        )}
      />
    );
  }

  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: getWrapperStyle("left"),
        right: getWrapperStyle("right"),
      }}
      renderMessageText={() => (
        <Div>
          {renderRepliedMessage()}
          <MessageText
            {...props}
            textStyle={{
              left: leftTextStyles,
              right: rightTextStyles,
            }}
          />
          <Div row justifyContent="flex-end">
            {renderReplyButton()}
            <Time
              {...props}
              timeTextStyle={{
                right: { fontSize: 10, color: "#CCC" },
                left: { fontSize: 10, color: "#666" },
              }}
            />
          </Div>
        </Div>
      )}
    />
  );
};

export default ChatBubble;

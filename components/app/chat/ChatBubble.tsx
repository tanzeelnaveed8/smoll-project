import { useUserStore } from "@/store/modules/user";
import {
  IconPaperclip,
  IconPlayerPlay,
  IconPlayerPause,
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
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

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
      // Load the audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: props.currentMessage?.audio || "" },
        { shouldPlay: false }
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
          <Div flexDir="column">
            <Text
              fontSize={14}
              fontWeight="bold"
              color={position === "left" ? "#333" : "#FFF"}
            >
              Audio Message
            </Text>
            <Text fontSize={12} color={position === "left" ? "#666" : "#CCC"}>
              {formatDuration(isPlaying ? currentTime : duration)}
            </Text>
          </Div>
        </Div>
      </TouchableOpacity>
    );
  };

  return (
    <Bubble
      {...props}
      position={position}
      wrapperStyle={{
        right: getWrapperStyle("right"),
        left: getWrapperStyle("left"),
      }}
      textStyle={{
        right: rightTextStyles,
        left: leftTextStyles,
      }}
      renderTime={(_props) => {
        if (_props.currentMessage?.audio) {
          return (
            <Time
              {..._props}
              timeTextStyle={{
                right: { color: "#333" },
              }}
            />
          );
        }

        return <Time {..._props} />;
      }}
      renderMessageAudio={renderAudioPlayer}
      renderMessageText={(_props) => {
        if (_props.currentMessage?.text?.startsWith("[ATTACHMENT]")) {
          return renderAttachment(props.currentMessage.text);
        }

        return <MessageText {..._props} />;
      }}
    />
  );
};

export default ChatBubble;

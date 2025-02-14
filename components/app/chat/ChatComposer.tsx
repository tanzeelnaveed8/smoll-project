import IconButton from "@/components/partials/IconButton";
import { colorErrorText, colorTextPrimary } from "@/constant/constant";
import { sendTypingStatus } from "@/utils/chat.v2";
import {
  IconPaperclip,
  IconSend,
  IconMicrophone,
  IconPlayerPause,
  IconTrash,
} from "@tabler/icons-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { showMessage } from "react-native-flash-message";
import {
  IMessage,
  InputToolbar,
  InputToolbarProps,
  SendProps,
} from "react-native-gifted-chat";
import { Div, Input, Text } from "react-native-magnus";
import { Audio } from "expo-av";
import { useSound } from "@/functions/useSound";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

interface Props extends InputToolbarProps<IMessage> {
  isSending: boolean;
  channelUrl: string;
}

const ChatComposer: React.FC<Props> = (props) => {
  const { play } = useSound();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleOnSend = async (img?: { img: typeof image }, audio?: boolean) => {
    const sendProps = props as SendProps<IMessage>;
    const image = img?.img;

    if (sendProps.onSend && (text.trim().length > 0 || image || audio)) {
      let file = null;

      if (image?.assets) {
        const fileUri = image.assets[0].uri;
        const fileSize = image.assets[0].fileSize ?? 0;
        const fileType =
          (image.assets[0].mimeType || image.assets[0].type) ?? "image";

        // Check file size
        const isImage = fileType.startsWith("image");
        const isVideo = fileType.startsWith("video");
        const maxSize = isImage
          ? 10 * 1024 * 1024
          : isVideo
          ? 100 * 1024 * 1024
          : 0;

        if (fileSize > maxSize) {
          showMessage({
            message: "File size exceeded",
            description: `${
              isImage ? "Image" : "Video"
            } file size should be less than ${maxSize / (1024 * 1024)}MB`,
            type: "danger",
          });
          return;
        }

        try {
          file = {
            name: fileUri.split("/").pop() ?? "",
            type: fileType,
            uri: fileUri,
            size: fileSize,
          };

          const newMessage: IMessage = {
            _id: Math.random().toString(36).substring(7),
            text: text,
            createdAt: new Date(),
            user: {
              _id: 1,
            },
            image: file ? file.uri : undefined,
          };

          sendProps.onSend([newMessage], true);

          setText("");
          setImage(null);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          showMessage({
            message: `${message}`,
            type: "danger",
          });
        }
      } else if (audio && recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI() ?? "";

        setAudioUri(uri);

        file = {
          uri: uri,
          type: "audio/m4a",
          name: "audio.m4a",
        };

        const newMessage: IMessage = {
          _id: Math.random().toString(36).substring(7),
          text: "",
          createdAt: new Date(),
          user: {
            _id: 1,
          },
          audio: file.uri,
        };

        sendProps.onSend([newMessage], true);
        cancelRecording();
      } else {
        sendProps.onSend([{ text: text }], true);
      }

      setText("");
      setImage(null);
    }

    play("message");
  };

  const handleTyping = () => {
    // if (typingTimeoutRef.current) {
    //   clearTimeout(typingTimeoutRef.current);
    // }
    // sendTypingStatus(props.channelUrl, true);
    // typingTimeoutRef.current = setTimeout(() => {
    //   sendTypingStatus(props.channelUrl, false);
    // }, 2000);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // setImage(result);
    handleOnSend({ img: result });
  };

  const startRecording = async () => {
    try {
      play("message");

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isDoneRecording) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsRecording(false);
          setIsPaused(false);
          setRecordingDuration(0);
        }
      });
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const pauseRecording = async () => {
    if (!recording) return;

    try {
      await recording.pauseAsync();
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } catch (err) {
      console.error("Failed to pause recording", err);
    }
  };

  const continueRecording = async () => {
    if (!recording) return;

    try {
      const permission =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.MICROPHONE
          : PERMISSIONS.ANDROID.RECORD_AUDIO;
      const result = await check(permission);

      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        if (requestResult !== RESULTS.GRANTED) {
          showMessage({
            message: "Permission Required",
            description:
              "Microphone permission is required for recording audio",
            type: "warning",
          });
          return;
        }
      } else if (result !== RESULTS.GRANTED) {
        showMessage({
          message: "Permission Required",
          description: "Microphone permission is required for recording audio",
          type: "warning",
        });
        return;
      }

      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to continue recording", err);
    }
  };

  const cancelRecording = () => {
    if (recording) {
      recording.stopAndUnloadAsync();
    }
    setRecording(null);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingDuration(0);
    setAudioUri(null);
    setText(""); // Reset the text input
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <InputToolbar
        {...props}
        containerStyle={{ borderTopWidth: 0 }}
        renderComposer={(composerProps) => {
          return (
            <Div flex={1}>
              {isRecording ? (
                <Div
                  bg="#EFEFEF"
                  h={56}
                  row
                  alignItems="center"
                  px={16}
                  style={{
                    borderRadius: 8,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                >
                  <Div>
                    <IconButton
                      bg={colorErrorText}
                      h={40}
                      w={40}
                      rounded={100}
                      mr={16}
                      disableUnderlayColor={true}
                      onPress={cancelRecording}
                    >
                      <IconTrash color="#fff" />
                    </IconButton>
                  </Div>

                  <Text fontSize="lg" fontWeight="600" color={colorTextPrimary}>
                    Recording... {formatDuration(recordingDuration)}
                  </Text>
                </Div>
              ) : (
                <Input
                  value={text}
                  bg="#EFEFEF"
                  placeholder="Type a Message..."
                  placeholderTextColor="#7B7B7B"
                  borderColor="transparent"
                  onChangeText={(e) => {
                    setText(e);
                    handleTyping();
                    if (composerProps.onTextChanged) {
                      composerProps.onTextChanged(e);
                    }
                  }}
                  h={56}
                  fontSize="lg"
                  fontWeight="600"
                  style={{
                    borderRadius: 8,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
              )}
            </Div>
          );
        }}
        renderSend={() => {
          return (
            <Div
              alignItems="center"
              justifyContent="center"
              bg="#EFEFEF"
              h={56}
              style={{
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                paddingRight: 16,
              }}
            >
              <Div row>
                {!isRecording && (
                  <IconButton
                    bg="#EFEFEF"
                    h={40}
                    w={40}
                    rounded={100}
                    disableUnderlayColor={true}
                    onPress={pickImage}
                  >
                    <IconPaperclip color={colorTextPrimary} />
                  </IconButton>
                )}

                {isRecording || isPaused ? (
                  <Div row alignItems="center">
                    <IconButton
                      bg="#333"
                      h={40}
                      w={40}
                      rounded={100}
                      disableUnderlayColor={true}
                      onPress={isPaused ? continueRecording : pauseRecording}
                    >
                      {isPaused ? (
                        <IconMicrophone color="#fff" />
                      ) : (
                        <IconPlayerPause color="#fff" />
                      )}
                    </IconButton>

                    <IconButton
                      bg="#427594"
                      h={40}
                      w={40}
                      rounded={100}
                      ml={8}
                      disabled={props.isSending}
                      disableUnderlayColor={true}
                      onPress={async () => {
                        handleOnSend(undefined, true);
                      }}
                    >
                      {props.isSending ? (
                        <ActivityIndicator size="small" color={"#fff"} />
                      ) : (
                        <IconSend
                          style={{
                            transform: [{ rotate: "45deg" }],
                            left: -1.5,
                          }}
                          color="#fff"
                        />
                      )}
                    </IconButton>
                  </Div>
                ) : (
                  <IconButton
                    bg="#427594"
                    h={40}
                    w={40}
                    rounded={100}
                    disabled={props.isSending}
                    disableUnderlayColor={true}
                    onPress={() => {
                      if (text.trim().length > 0) {
                        handleOnSend();
                      } else {
                        startRecording();
                      }
                    }}
                  >
                    {props.isSending ? (
                      <ActivityIndicator size="small" color={"#fff"} />
                    ) : text.trim().length > 0 || audioUri ? (
                      <IconSend
                        style={{
                          transform: [{ rotate: "45deg" }],
                          left: -1.5,
                        }}
                        color="#fff"
                      />
                    ) : (
                      <IconMicrophone color="#fff" />
                    )}
                  </IconButton>
                )}
              </Div>
            </Div>
          );
        }}
      />
    </>
  );
};

export default ChatComposer;

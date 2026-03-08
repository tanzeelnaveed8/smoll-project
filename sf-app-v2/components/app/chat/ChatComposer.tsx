import { colorErrorText, colorPrimary, colorTextPrimary } from "@/constant/constant";
import { useSound } from "@/functions/useSound";
import { useUserStore } from "@/store/modules/user";
import {
  IconMicrophone,
  IconPaperclip,
  IconPlayerPause,
  IconSend,
  IconTrash,
  IconX,
} from "@tabler/icons-react-native";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import { showMessage } from "react-native-flash-message";
import { IMessage, InputToolbar, InputToolbarProps, SendProps } from "react-native-gifted-chat";
import { Div, Input, Text } from "react-native-magnus";

interface Props extends InputToolbarProps<IMessage> {
  isSending: boolean;
  channelUrl: string;
  replyingTo?: IMessage | null;
  onCancelReply?: () => void;
  expertName?: string;
}

const ChatComposer: React.FC<Props> = (props) => {
  const { play } = useSound();
  const { user } = useUserStore();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(null);
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
        const fileType = (image.assets[0].mimeType || image.assets[0].type) ?? "image";

        // Check file size
        const isImage = fileType.startsWith("image");
        const isVideo = fileType.startsWith("video");
        const maxSize = isImage ? 10 * 1024 * 1024 : isVideo ? 100 * 1024 * 1024 : 0;

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

      // Check permission before requesting
      const permissionStatus = await Audio.getPermissionsAsync();
      if (!permissionStatus.granted) {
        const permissionResponse = await Audio.requestPermissionsAsync();
        if (!permissionResponse.granted) {
          console.log("Audio permission denied");
          return; // Exit if permission is denied
        }
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create a new recording instance
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Update recording status
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

  const handleCancelReply = () => {
    if (props.onCancelReply) {
      props.onCancelReply();
    }
  };

  const renderReplyPreview = () => {
    if (!props.replyingTo) return null;

    const replyingTo = props.replyingTo;
    const isMyMessage = replyingTo.user._id === user?.id;
    const replyingToName = isMyMessage ? "Yourself" : props.expertName || "User";

    const getMessagePreview = () => {
      if (replyingTo.text) return replyingTo.text;
      if (replyingTo.image) return "[Image]";
      if (replyingTo.audio) return "[Audio]";
      if (replyingTo.video) return "[Video]";
      return "[File]";
    };

    return (
      <Div
        bg="#F4F6F8"
        borderLeftWidth={3}
        borderLeftColor={colorPrimary}
        px={10}
        py={8}
        mb={4}
        rounded={4}
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Div flex={1}>
          <Text color={colorPrimary} fontSize={12} fontWeight="bold">
            Replying to {replyingToName}
          </Text>
          <Text color="#666" fontSize={12} numberOfLines={1}>
            {getMessagePreview()}
          </Text>
        </Div>
        <TouchableOpacity
          onPress={handleCancelReply}
          style={{
            padding: 10, // Increase tap area
            margin: -10, // Offset padding to maintain visual position
          }}
        >
          <IconX size={16} color="#999" />
        </TouchableOpacity>
      </Div>
    );
  };

  return (
    <>
      {isRecording ? (
        <Div bg="#fff" pt={16} px={20} pb={24} borderTopWidth={1} borderTopColor="#eaeaea">
          <Div row alignItems="center" justifyContent="space-between" mb={10}>
            <Text fontSize={16} fontWeight="500">
              Recording...{" "}
              <Text color={colorErrorText} fontSize={16}>
                {formatDuration(recordingDuration)}
              </Text>
            </Text>
            <Div row alignItems="center">
              {isPaused ? (
                <TouchableOpacity onPress={continueRecording}>
                  <IconMicrophone size={24} style={{ marginRight: 16 }} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={pauseRecording}>
                  <IconPlayerPause size={24} style={{ marginRight: 16 }} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={cancelRecording}>
                <IconTrash color={colorErrorText} size={24} />
              </TouchableOpacity>
            </Div>
          </Div>
          <Div row mt={16}>
            <TouchableOpacity
              onPress={() => cancelRecording()}
              style={{ flex: 1, marginRight: 10 }}
            >
              <Div bg="#f3f3f3" py={12} px={15} rounded="lg" alignItems="center">
                <Text color="#666">Cancel</Text>
              </Div>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOnSend(undefined, true)} style={{ flex: 1 }}>
              <Div bg={colorPrimary} py={12} px={15} rounded="lg" alignItems="center">
                <Text color="#fff">Send</Text>
              </Div>
            </TouchableOpacity>
          </Div>
        </Div>
      ) : (
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: "#fff",
            paddingTop: 8,
            paddingBottom: 24,
            paddingHorizontal: 20,
            borderTopWidth: 1,
            borderTopColor: "#eaeaea",
          }}
          renderComposer={() => (
            <Div style={{ flex: 1 }}>
              {renderReplyPreview()}
              <Div flexDir="row" alignItems="flex-end" top={8} pb={7}>
                <Input
                  multiline
                  placeholder="Type a message..."
                  flex={1}
                  bg="#f3f3f3"
                  rounded={24}
                  borderWidth={0}
                  py={8}
                  px={16}
                  fontSize={16}
                  color={colorTextPrimary}
                  placeholderTextColor="#999"
                  value={text}
                  onChangeText={(value) => {
                    setText(value);
                  }}
                />
                <Div row alignItems="center" ml={8} mb={4}>
                  <TouchableOpacity onPress={pickImage} style={{ marginRight: 6 }}>
                    <Div
                      h={38}
                      w={38}
                      rounded="circle"
                      justifyContent="center"
                      alignItems="center"
                      bg="#f3f3f3"
                    >
                      <IconPaperclip color={colorTextPrimary} strokeWidth={1.5} size={22} />
                    </Div>
                  </TouchableOpacity>
                  {text.length > 0 ? (
                    <TouchableOpacity onPress={() => handleOnSend()} disabled={props.isSending}>
                      <Div
                        h={38}
                        w={38}
                        rounded="circle"
                        justifyContent="center"
                        alignItems="center"
                        bg={colorPrimary}
                      >
                        {props.isSending ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <IconSend color="#fff" strokeWidth={1.5} size={18} />
                        )}
                      </Div>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={startRecording}>
                      <Div
                        h={38}
                        w={38}
                        rounded="circle"
                        justifyContent="center"
                        alignItems="center"
                        bg={colorPrimary}
                      >
                        <IconMicrophone color="#fff" strokeWidth={1.5} size={18} />
                      </Div>
                    </TouchableOpacity>
                  )}
                </Div>
              </Div>
            </Div>
          )}
        />
      )}
    </>
  );
};

export default ChatComposer;

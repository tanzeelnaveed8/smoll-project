import IconButton from "@/components/partials/IconButton";
import { colorPrimary, colorTextPrimary } from "@/constant/constant";
import { useFileStore } from "@/store/modules/file";
import { CometChatWrapper } from "@/utils/chat";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { IconPaperclip, IconSend } from "@tabler/icons-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  IMessage,
  InputToolbar,
  InputToolbarProps,
  SendProps,
} from "react-native-gifted-chat";
import { Div, Input } from "react-native-magnus";
import { showMessage } from "react-native-flash-message";
import { sendTypingStatus } from "@/utils/chat.v2";

interface Props extends InputToolbarProps<IMessage> {
  loggedInUser: CometChat.User;
  isSending: boolean;
  channelUrl: string;
}

const ChatComposer: React.FC<Props> = (props) => {
  const { uploadFile } = useFileStore();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null
  );
  // const [isSending, setIsSending] = useState(false);

  const handleOnSend = async (img?: { img: typeof image }) => {
    const sendProps = props as SendProps<IMessage>;
    const image = img?.img;

    if (sendProps.onSend && (text.trim().length > 0 || image)) {
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

        const fileObj = {
          uri: fileUri,
          name: fileUri.split("/").pop() ?? "",
          type: fileType,
        } as unknown as File;

        try {
          // setIsSending(true);

          // const uploadedFile = await uploadFile([fileObj]);

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
        } finally {
          // setIsSending(false);
        }
      } else {
        sendProps.onSend([{ text: text }], true);
        setText("");
      }
    }
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendTypingStatus(props.channelUrl, true);

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(props.channelUrl, false);
    }, 2000);
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

    // if (!result.canceled) {
    //   setImage(result);
    //   handleOnSend();
    // }
  };

  return (
    <>
      <InputToolbar
        {...props}
        containerStyle={{ borderTopWidth: 0 }}
        renderComposer={(composerProps) => {
          return (
            <Div flex={1}>
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

                <IconButton
                  bg="#427594"
                  h={40}
                  w={40}
                  rounded={100}
                  disabled={props.isSending}
                  disableUnderlayColor={true}
                  onPress={handleOnSend}
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
            </Div>
          );
        }}
      />
    </>
  );
};

export default ChatComposer;

import IconButton from "@/components/partials/IconButton";
import { colorTextPrimary } from "@/constant/constant";
import { CometChatWrapper } from "@/utils/chat";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { IconPaperclip, IconSend } from "@tabler/icons-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
  IMessage,
  InputToolbar,
  InputToolbarProps,
  SendProps,
} from "react-native-gifted-chat";
import { Div, Input } from "react-native-magnus";
import * as FileSystem from "expo-file-system";

interface Props extends InputToolbarProps<IMessage> {
  loggedInUser: CometChat.User;
}

const ChatComposer: React.FC<Props> = (props) => {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null
  );

  const handleOnSend = async () => {
    const sendProps = props as SendProps<IMessage>;
    if (sendProps.onSend && (text.trim().length > 0 || image)) {
      let file = null;

      // if (image?.assets) {
      //   const fileUri = image.assets[0].uri;
      //   file = {
      //     name: fileUri.split("/").pop() ?? "",
      //     type: image.assets[0].type ?? "image",
      //     uri: fileUri,
      //     size: image.assets[0].fileSize ?? 0,
      //   };
      // }

      const newMessage: IMessage = {
        _id: Math.random().toString(36).substring(7),
        text: text,
        createdAt: new Date(),
        user: {
          _id: 1,
        },
        image: image?.assets ? image.assets[0].uri : undefined,
      };

      sendProps.onSend([newMessage], true);
      setText("");
      setImage(null);
    }
  };

  const handleTyping = () => {
    CometChatWrapper.sendTypingIndicator(props.loggedInUser.getUid());

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      CometChatWrapper.stopTypingIndicator(props.loggedInUser.getUid());
    }, 500);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("res", result);

    if (!result.canceled) {
      setImage(result);
      handleOnSend();
    }
  };

  return (
    <Div flex={1}>
      <InputToolbar
        {...props}
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
              h={"100%"}
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
                  disableUnderlayColor={true}
                  onPress={handleOnSend}
                >
                  <IconSend
                    style={{
                      transform: [{ rotate: "45deg" }],
                      left: -1.5,
                    }}
                    color="#fff"
                  />
                </IconButton>
              </Div>
            </Div>
          );
        }}
      />
    </Div>
  );
};

export default ChatComposer;

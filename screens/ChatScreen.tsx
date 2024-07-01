import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { View } from "react-native-animatable";
import {
  CometChatUIKit,
  UIKitSettings,
  CometChatMessages,
  CometChatDate,
  CometChatUsersWithMessages,
  CometChatContextProvider,
  CometChatConversationsWithMessages,
  CometChatTheme,
} from "@cometchat/chat-uikit-react-native";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import Layout from "@/components/app/Layout";
import { Button, Div, Input } from "react-native-magnus";
import { NavigationType } from "@/store/types";
import { IconSend, IconSend2 } from "@tabler/icons-react-native";
import { fontHauoraSemiBold } from "@/constant/constant";

const ChatScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [chatUser, setChatUser] = useState<CometChat.User>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [inputMessage, setInputMessage] = useState("");
  const inputMessageRef = useRef<null | TextInput>(null);

  useEffect(() => {
    let uikitSettings: UIKitSettings = {
      appId: "259470d3b9e30637",
      authKey: "7f548f7be265876668136a6c1cb6b7b59f42bbee",
      region: "in",
      subscriptionType: "ALL_USERS",
    };

    CometChatUIKit.init(uikitSettings)
      .then(() => {
        console.log("CometChatUiKit successfully initialized");

        CometChatUIKit.login({ uid: "sywfkkl6cl" })
          .then((user) => {
            console.log("User logged in successfully", user.getName());
            setIsLoggedIn(true);
          })
          .catch((error) => {
            console.log("Login failed with exception:", error);
            setIsLoggedIn(false);
          });
      })
      .catch((error) => {
        console.log("Initialization failed with exception:", error);
      });

    if (isLoggedIn) {
      CometChat.getUser("1j6sfqvrrm")
        .then((user) => {
          setChatUser(user);
        })
        .catch((error) => {
          console.log("Failed to get user:", error);
        });
    }
  }, [isLoggedIn]);

  let myTheme: CometChatTheme = new CometChatTheme({});
  myTheme.palette.setPrimary({
    light: "#222222",
    dark: "#fff",
  });
  myTheme.palette.setSecondary({
    light: "#fff",
    dark: "#f10",
  });
  myTheme.palette.setAccent({
    light: "#f10",
    dark: "#f10",
  });
  myTheme.palette.setMode("light");

  const sendMessageHandler = () => {
    const inputValue = inputMessageRef;
    console.log("inputValue", inputValue);

    let textMessage = new CometChat.TextMessage(
      "sywfkkl6cl",
      "testing",
      CometChat.RECEIVER_TYPE.USER
    );

    CometChat.sendMessage(textMessage).then(
      (message) => {
        console.log("Message sent successfully:", message);
      },
      (error) => {
        console.log("Message sending failed with error:", error);
      }
    );
  };

  const messageChangeHandler = (e: string) => {
    console.log(e);
  };

  return (
    <Div
      style={{
        flex: 1,
        paddingTop: 0,
        backgroundColor: "#fff",
        paddingBottom: 10,
      }}
    >
      {chatUser ? (
        <>
          <CometChatContextProvider theme={myTheme}>
            <CometChatConversationsWithMessages
              user={chatUser}
              messagesConfigurations={{
                // hideMessageComposer: true,

                /** message input */
                // MessageComposerView: () => {
                //   return (
                //     <Div px={20} py={8}>
                //       <Div
                //         flexDir="row"
                //         bg="#EFEFEF"
                //         rounded={8}
                //         px={14}
                //         // py={2}
                //       >
                //         <Input
                //           multiline
                //           flex={1}
                //           bg="transparent"
                //           borderWidth={0}
                //           placeholder="Type a Message..."
                //           fontFamily={fontHauoraSemiBold}
                //           fontSize={"lg"}
                //           p={0}
                //           px={0}
                //           py={16}
                //           maxH={56}
                //           onChangeText={messageChangeHandler}
                //         />
                //         <Button
                //           bg="primary"
                //           p={0}
                //           w={40}
                //           h={40}
                //           rounded={50}
                //           alignSelf="center"
                //           onPress={sendMessageHandler}
                //         >
                //           <IconSend2 width={23} height={22} color={"#fff"} />
                //         </Button>
                //       </Div>
                //     </Div>
                //   );
                // },

                messageComposerConfiguration: {
                  hideVoiceRecording: true,

                  SendButtonView: () => (
                    <Button
                      bg="primary"
                      p={0}
                      w={40}
                      h={40}
                      rounded={50}
                      mt={10}
                    >
                      <IconSend2 width={23} height={22} color={"#fff"} />
                    </Button>
                  ),
                },

                messageListConfiguration: {
                  // alignment: "leftAligned",
                  scrollToBottomOnNewMessage: true,
                  dateSeperatorStyle: { textColor: "#494949" },

                  wrapperMessageBubbleStyle: {
                    backgroundColor: "red",
                    borderRadius: 20,
                  },
                  messageListStyle: {
                    timestampTextColor: "#fff",
                  },
                },
              }}
            ></CometChatConversationsWithMessages>
          </CometChatContextProvider>

          {/* <CometChatMessages
            user={chatUser}
            messageListConfiguration={{}}
            messageComposerConfiguration={{
              hideVoiceRecording: true,
            }}
            messageHeaderConfiguration={{
              onBack: () => {
                // navigation.navigate("HumanCounsellingMessage");
              },
            }}
            // messageListConfiguration={{ showAvatar: true }}
            hideDetails
          /> */}
          {/* <CometChatUsersWithMessages user={chatUser} /> */}
        </>
      ) : (
        <Text>User not logged in</Text>
      )}
    </Div>
  );
};

export default ChatScreen;

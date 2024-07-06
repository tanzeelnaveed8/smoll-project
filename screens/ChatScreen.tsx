import Layout from "@/components/app/Layout";
import { colorTextPrimary } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import {
  CometChatContextProvider,
  CometChatConversationsWithMessages,
  CometChatMessageComposer,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatTheme,
  CometChatUIKit,
  UIKitSettings,
} from "@cometchat/chat-uikit-react-native";
import { IconSend2 } from "@tabler/icons-react-native";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput } from "react-native";
import { Button, Div } from "react-native-magnus";

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

        CometChatUIKit.login({ uid: "bxkpjfuvtd" })
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
      CometChat.getUser("pfon8yoh0o")
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

  // const sendMessageHandler = () => {
  //   const inputValue = inputMessageRef;
  //   console.log("inputValue", inputValue);

  //   let textMessage = new CometChat.TextMessage(
  //     "sywfkkl6cl",
  //     "testing",
  //     CometChat.RECEIVER_TYPE.USER
  //   );

  //   CometChat.sendMessage(textMessage).then(
  //     (message) => {
  //       console.log("Message sent successfully:", message);
  //     },
  //     (error) => {
  //       console.log("Message sending failed with error:", error);
  //     }
  //   );
  // };

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
          <Layout showBack title={"Dr. Mohib"}>
            <Div flex={1}>
              <CometChatContextProvider theme={myTheme}>
                <Div flex={1}>
                  <CometChatMessageList
                    user={chatUser}
                    dateSeperatorStyle={{
                      textColor: colorTextPrimary,
                    }}
                    wrapperMessageBubbleStyle={{}}
                    // messageListConfiguration={{
                    //   showAvatar: true,
                    // }}
                  />
                </Div>

                <Div>
                  <CometChatMessageComposer
                    messageComposerStyle={{
                      backgroundColor: "#EFEFEF",
                      borderRadius: 10,
                      dividerTint: "transparent",
                    }}
                    placeHolderText="Type a Message..."
                  />
                </Div>
                {/* <CometChatMessageList /> */}
              </CometChatContextProvider>
            </Div>
          </Layout>

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

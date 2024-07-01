import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
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
import { Div } from "react-native-magnus";
import { NavigationType } from "@/store/types";

const ChatScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [chatUser, setChatUser] = useState<CometChat.User>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  // myTheme.palette.setMode("dark");

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
          {/* <CometChatContextProvider theme={myTheme}>
            <CometChatConversationsWithMessages user={chatUser} />
          </CometChatContextProvider> */}
          <CometChatMessages
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
          />
          {/* <CometChatUsersWithMessages user={chatUser} /> */}
        </>
      ) : (
        <Text>User not logged in</Text>
      )}
    </Div>
  );
};

export default ChatScreen;

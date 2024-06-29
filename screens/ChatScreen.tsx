import { useEffect, useState } from "react";
import { Text } from "react-native";
import { View } from "react-native-animatable";
import {
  CometChatUIKit,
  UIKitSettings,
  CometChatMessages,
} from "@cometchat/chat-uikit-react-native";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import Layout from "@/components/app/Layout";

export default function ChatScreen() {
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

  return (
    <Layout>
      {chatUser ? (
        <CometChatMessages user={chatUser} />
      ) : (
        <Text>User not logged in</Text>
      )}
    </Layout>
  );
}

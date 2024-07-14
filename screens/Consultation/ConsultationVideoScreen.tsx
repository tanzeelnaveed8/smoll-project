import Layout from "@/components/app/Layout";
import { NavigationType } from "@/store/types";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { CometChatIncomingCall } from "@cometchat/chat-uikit-react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";

const ConsultationVideoScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const vetId = (route.params as Record<string, string>)?.vetId;

  const incomingCall = useRef<CometChat.Call | null>(null);
  const [callReceived, setCallReceived] = useState(false);
  const listnerID = "EXPERT_VIDEO_CALL";

  useEffect(() => {
    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onIncomingCallReceived: (call: CometChat.Call) => {
          call.getSender().getUid;

          if (vetId) incomingCall.current = call;
          setCallReceived(true);
        },
      })
    );

    return () => {
      CometChat.removeCallListener(listnerID);
    };
  }, []);

  return (
    <Layout loading={!callReceived}>
      <CometChatIncomingCall
        call={incomingCall.current!}
        onDecline={(call) => {
          setCallReceived(false);
        }}
      />
    </Layout>
  );
};

export default ConsultationVideoScreen;

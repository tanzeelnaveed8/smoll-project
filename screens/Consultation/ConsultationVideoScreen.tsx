import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Div } from "react-native-magnus";

const ConsultationVideoScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();

  const expertId = (route.params as Record<string, string>)?.expertId;
  const caseId = (route.params as Record<string, string>)?.caseId;
  const consultationId = (route.params as Record<string, string>)
    ?.consultationId;

  const listnerID = "EXPERT_VIDEO_CALL";

  // useEffect(() => {
  //   const callListener = new CometChat.CallListener({
  //     onIncomingCallReceived: (call: CometChat.Call) => {
  //       const uid = call.getSender().getUid();

  //       if (expertId.toLowerCase() !== uid.toLowerCase()) return;

  //       setIncomingCall(call);

  //       CometChat.acceptCall(call.getSessionId()).then(
  //         (acceptedCall) => {
  //           setIncomingCall(acceptedCall);
  //         },
  //         (error) => {
  //           console.log("Call acceptance failed with error:", error);
  //         }
  //       );
  //     },
  //   });

  //   CometChat.addCallListener(listnerID, callListener);

  //   CometChatCalls.addCallEventListener("CALL_LISTENER_3", {
  //     onCallEndButtonPressed: () => {
  //       endHandler();
  //     },
  //     onUserLeft: () => {
  //       endHandler();
  //     },
  //   });

  //   return () => {
  //     CometChat.removeCallListener(listnerID);
  //   };
  // }, []);

  // const endHandler = async () => {
  //   navigation.navigate("ConsultationFeedbackScreen", {
  //     expertId: expertId,
  //     caseId: caseId,
  //   });
  // };

  // const callSettingsBuilder = new CometChatCalls.CallSettingsBuilder()
  //   .startWithVideoMuted(true)
  //   .setIsAudioOnlyCall(false)
  //   .setMode(CometChatCalls.CALL_MODE.DEFAULT)
  //   .showEndCallButton(false);

  return (
    <>
      <Div>
        {/* {incomingCall ? (
          <CometChatOngoingCall
            onError={(err) => console.log("err", err)}
            sessionID={incomingCall.getSessionId()}
            callSettingsBuilder={callSettingsBuilder}
          />
        ) : null} */}
      </Div>
    </>
  );
};

export default ConsultationVideoScreen;

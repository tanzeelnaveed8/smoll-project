import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import { SendbirdCalls, DirectCall } from "@sendbird/calls-react-native";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Div, Button, Icon, Text } from "react-native-magnus";
import Permissions, { PERMISSIONS } from "react-native-permissions";

const CustomVideoCallView: React.FC<{
  call: DirectCall;
  onEnded: () => void;
}> = ({ call, onEnded }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const toggleMute = () => {
    if (isMuted) {
      call.unmuteMicrophone();
    } else {
      call.muteMicrophone();
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (isVideoEnabled) {
      call.stopVideo();
    } else {
      call.startVideo();
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  return (
    <Div flex={1}>
      <Div flex={1} bg="gray200">
        {/* This is where the video streams would be rendered */}
        {/* You'll need to implement this part using Sendbird's video view components */}
      </Div>
      <Div
        position="absolute"
        bottom={20}
        left={0}
        right={0}
        flexDir="row"
        justifyContent="space-around"
      >
        <Button
          bg="red500"
          h={50}
          w={50}
          rounded="circle"
          onPress={() => {
            call.end();
            onEnded();
          }}
        >
          <Icon name="phone-off" color="white" fontFamily="Feather" />
        </Button>
        <Button
          bg={isMuted ? "gray500" : "blue500"}
          h={50}
          w={50}
          rounded="circle"
          onPress={toggleMute}
        >
          <Icon
            name={isMuted ? "mic-off" : "mic"}
            color="white"
            fontFamily="Feather"
          />
        </Button>
        <Button
          bg={isVideoEnabled ? "blue500" : "gray500"}
          h={50}
          w={50}
          rounded="circle"
          onPress={toggleVideo}
        >
          <Icon
            name={isVideoEnabled ? "video" : "video-off"}
            color="white"
            fontFamily="Feather"
          />
        </Button>
      </Div>
    </Div>
  );
};

const ConsultationVideoScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();

  const expertId = (route.params as Record<string, string>)?.expertId;
  const caseId = (route.params as Record<string, string>)?.caseId;
  const consultationId = (route.params as Record<string, string>)
    ?.consultationId;

  const [incomingCall, setIncomingCall] = useState<DirectCall | null>(null);

  useEffect(() => {
    requestPermissions().then((hasPermissions) => {
      console.log("hasPermissions", hasPermissions);
      if (hasPermissions) {
        let directCall: DirectCall | null = null;
        let unsubscribe: () => void;

        SendbirdCalls.setListener({
          onRinging: async (callProps) => {
            console.log("testing");
            const uid = callProps.caller?.userId;

            if (expertId.toLowerCase() !== uid?.toLowerCase()) return;

            directCall = await SendbirdCalls.getDirectCall(callProps.callId);

            setIncomingCall(directCall);
            directCall.accept();

            // Add call event listener here
            unsubscribe = directCall.addListener({
              onEnded: () => {
                endHandler();
              },
            });
          },
        });

        return () => {
          unsubscribe();
        };
      }
    });
  }, []);

  const endHandler = async () => {
    navigation.navigate("ConsultationFeedbackScreen", {
      expertId: expertId,
      caseId: caseId,
    });
  };

  const requestPermissions = async (): Promise<boolean> => {
    const CALL_PERMISSIONS = Platform.select({
      android: [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      ],
      ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
      default: [],
    });

    const result = await Permissions.requestMultiple(CALL_PERMISSIONS);

    console.log("result", result);

    const noPermissions = Object.values(result).some(
      (value) => value !== "granted"
    );

    return !noPermissions;
  };

  console.log("incomingCall", incomingCall);

  return (
    <Div flex={1}>
      {incomingCall ? (
        <CustomVideoCallView
          call={incomingCall}
          onEnded={() => {
            setIncomingCall(null);
            endHandler();
          }}
        />
      ) : (
        <Div flex={1} alignItems="center" justifyContent="center">
          <Text>Waiting for incoming call...</Text>
        </Div>
      )}
    </Div>
  );
};

export default ConsultationVideoScreen;

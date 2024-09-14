import { colorPrimary } from "@/constant/constant";
import { SocketEventEnum } from "@/socket/events";
import { useSocket } from "@/socket/provider";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { requestPermissions } from "@/utils/chat.v2";
import { useRoute } from "@react-navigation/native";
import {
  DirectCall,
  DirectCallVideoView,
  SendbirdCalls,
} from "@sendbird/calls-react-native";
import { IconVideoOff } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { Button, Div, Icon, WINDOW_HEIGHT } from "react-native-magnus";

const CustomVideoCallView: React.FC<{
  call: DirectCall;
  onEnded: () => void;
}> = ({ call, onEnded }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    console.log("call", call);

    call.accept();

    const unsubscribe = call.addListener({
      onEnded: () => {
        onEnded();
      },
    });

    return () => {
      unsubscribe();
    };
  }, [call, onEnded]);

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
      <DirectCallVideoView
        viewType="remote"
        callId={call.callId}
        style={{
          flex: 1,
        }}
      />

      <DirectCallVideoView
        viewType="local"
        callId={call.callId}
        style={{
          position: "absolute",
          width: 100,
          height: 150,
          top: 20,
          right: 20,
          zIndex: 1,
        }}
      >
        <Div justifyContent="center" alignItems="center" flex={1}>
          {!isVideoEnabled && <IconVideoOff size={40} color="white" />}
        </Div>
      </DirectCallVideoView>

      <Div position="absolute" w="100%" alignItems="center" bottom={20}>
        <Div
          w={"80%"}
          justifyContent="space-between"
          flexDir="row"
          bg="rgba(0,0,0,0.5)"
          p={10}
          px={20}
          rounded={30}
        >
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
              fontSize={20}
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
              fontSize={20}
            />
          </Button>
          <Button
            bg="red500"
            h={50}
            w={50}
            rounded="circle"
            onPress={() => call.end()}
          >
            <Icon
              name="phone-off"
              color="white"
              fontFamily="Feather"
              fontSize={20}
            />
          </Button>
        </Div>
      </Div>
    </Div>
  );
};

const ConsultationVideoScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const { user } = useUserStore();
  const socket = useSocket();

  const expertId = (route.params as Record<string, string>)?.expertId;
  const caseId = (route.params as Record<string, string>)?.caseId;

  const [directCall, setDirectCall] = useState<DirectCall | null>(null);

  useEffect(() => {
    socket?.on(SocketEventEnum.VET_CALL_INITIATE_WITH_CALL_ID, async (data) => {
      if (data.memberId === user?.id) {
        // requestPermissions().then(async (hasPermissions) => {
        //   if (hasPermissions) {
        //     const directCall = await SendbirdCalls.getDirectCall(data.callId);
        //     directCall.accept().catch((error) => {
        //       console.log("error", error);
        //     });
        //     setDirectCall(directCall);
        //   }
        // });
      }
    });

    return () => {
      socket?.off(SocketEventEnum.VET_CALL_INITIATE_WITH_CALL_ID);
    };
  }, []);

  const endHandler = async () => {
    navigation.navigate("ConsultationFeedbackScreen", {
      expertId: expertId,
      caseId: caseId,
    });
  };

  return (
    <Div flex={1}>
      {directCall ? (
        <CustomVideoCallView
          call={directCall}
          onEnded={() => {
            setDirectCall(null);
            SET_CALL_ID(null);
            endHandler();
          }}
        />
      ) : (
        <Div flex={1} justifyContent="center" minH={WINDOW_HEIGHT / 1.4}>
          <ActivityIndicator size="large" color={colorPrimary} />
        </Div>
      )}
    </Div>
  );
};

export default ConsultationVideoScreen;

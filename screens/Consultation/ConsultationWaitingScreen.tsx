import Layout from "@/components/app/Layout";
import {
  colorPrimary,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { SocketEventEnum } from "@/socket/events";
import { useSocket } from "@/socket/provider";
import { useExpertStore } from "@/store/modules/expert";
import { NavigationType } from "@/store/types";
import { FindOneConsultationResDto } from "@/store/types/expert";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Div, Image, Text } from "react-native-magnus";

const ConsultationWaitingScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const socket = useSocket();

  const { findOneConsultation } = useExpertStore();

  const consultationId = (route.params as Record<string, string>)
    ?.consultationId;

  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState<FindOneConsultationResDto>();

  useEffect(() => {
    findConsultation();

    if (socket) {
      socket.on(SocketEventEnum.VET_CALL_INITIATE, async (data) => {
        if (data.consultationId === consultationId) {
          const { vetId, caseId } = data;

          navigation.navigate("ConsultationVideoScreen", {
            expertId: vetId,
            caseId: caseId,
            consultationId,
          });
        }
      });
    }
  }, []);

  // const initialTime = 154;
  // const [time, setTime] = useState(initialTime);

  // useEffect(() => {
  //   if (time > 0) {
  //     const timerId = setInterval(() => {
  //       setTime((prevTime) => prevTime - 1);
  //     }, 1000);
  //     return () => clearInterval(timerId);
  //   }
  // }, [time]);

  const findConsultation = async () => {
    try {
      setLoading(true);

      const consultation = await findOneConsultation(consultationId);

      setConsultation(consultation);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Layout title="Waiting Room" loading={loading || !consultation}>
      <Div flex={1} mt={72} alignItems="center" w={252} mx={"auto"}>
        <Image
          w={84}
          h={84}
          rounded={84}
          source={require("../../assets/images/video-img.png")}
          mb={12}
        />
        <Text fontSize={"xl"} fontFamily={fontHauoraMedium}>
          {consultation?.vet.name}
        </Text>
        <Text
          color="darkGreyText"
          fontSize={"md"}
          fontFamily={fontHauoraMedium}
          mb={32}
        >
          {consultation?.vet.designation}
        </Text>

        <Div mt={18} mb={24}>
          <ActivityIndicator size="large" color={colorPrimary} />
        </Div>

        {/* <Text fontSize={40}>{formatTime(time)}</Text>

        <Text fontSize={"lg"} fontFamily={fontHauoraMedium} mb={12}>
          Time left
        </Text>

        <Progress.Bar
          //   progress={0.2}
          progress={(initialTime - time) / initialTime}
          height={8}
          width={252}
          borderColor="transparent"
          color="#427594"
          style={{
            backgroundColor: "#EFEFEF",
            width: "100%",
            marginBottom: 32,
          }}
        /> */}

        <Text fontSize={"xl"} fontFamily={fontHauoraMedium} textAlign="center">
          Hang on, {consultation?.vet.name} is checking Lucy case
        </Text>
      </Div>

      <TouchableOpacity
        style={{
          margin: "auto",
          paddingHorizontal: 6,
          paddingVertical: 2,
        }}
        onPress={() => {
          navigation.navigate("VideoConsultationFeedbackScreen");
        }}
      >
        <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} color="primary">
          Cancel
        </Text>
      </TouchableOpacity>
    </Layout>
  );
};

export default ConsultationWaitingScreen;

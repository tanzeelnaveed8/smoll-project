import Layout from "@/components/app/Layout";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";
import * as Progress from "react-native-progress";

const WaitingRoomScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const initialTime = 154;
  const [time, setTime] = useState(initialTime); // Initial time in seconds (2:34)

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Layout showCloseIcon backBtnText="" title="Waiting Room">
      <Div flex={1} mt={72} alignItems="center" w={252} mx={"auto"}>
        <Image
          w={84}
          h={84}
          rounded={84}
          source={require("../../assets/images/video-img.png")}
          mb={12}
        />
        <Text fontSize={"xl"} fontFamily={fontHauoraMedium}>
          Dr. Abbas Sheikh
        </Text>
        <Text
          color="darkGreyText"
          fontSize={"md"}
          fontFamily={fontHauoraMedium}
          mb={32}
        >
          DVM, GPCERT (FelP)
        </Text>

        <Text fontSize={40}>{formatTime(time)}</Text>

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
        />

        <Text fontSize={"xl"} fontFamily={fontHauoraMedium} textAlign="center">
          Hang on, Dr Abbas Sheikh is checking Lucy case
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

export default WaitingRoomScreen;

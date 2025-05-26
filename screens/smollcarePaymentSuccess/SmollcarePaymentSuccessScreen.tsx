import ButtonPrimary from "@/components/partials/ButtonPrimary";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
  fontHeading,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { IconArrowLeft } from "@tabler/icons-react-native";
import React from "react";
import { Div, Image, Text } from "react-native-magnus";

export default function SmollcarePaymentSuccessScreen({
  navigation,
}: {
  navigation: NavigationType;
}) {
  return (
    <Div bg="#FAF8F5" flex={1} alignItems="center" justifyContent="center" px={22}>
      <Div alignItems="center">
        <Image w={202} h={170} source={require("@/assets/images/pop-image.png")} />

        <Div mt={16} alignItems="center">
          <Text textAlign="center" fontFamily={fontHeading} color="#679FF0" fontSize="6xl">
            Steve’s journey to a better care starts today!
          </Text>

          <Text
            textAlign="center"
            fontSize="xl"
            mt={8}
            color="#121212"
            fontFamily={fontHauoraSemiBold}
          >
            Your plan is now active. You can manage or update it anytime.
          </Text>
        </Div>

        <Div
          p={16}
          maxW={300}
          alignItems="center"
          mt={16}
          rounded={20}
          borderWidth={1}
          borderColor="#D7E7F4"
          bg="#FAFDFF"
        >
          <Text fontSize={"3xl"} color="#121212" fontFamily={fontHeading}>
            Steve's id
          </Text>
          <Text mt={2} fontSize={"7xl"} color="#121212" fontFamily={fontHeading}>
            #F12
          </Text>
          <Text mt={16} textAlign="center" fontSize="lg" fontFamily={fontHauoraSemiBold}>
            Present this number at the clinic to enjoy your perks.
          </Text>
        </Div>
        <ButtonPrimary
          px={0}
          py={0}
          w={150}
          bg="transparent"
          textColor="#679FF0"
          mt={24}
          alignSelf="center"
          fontFamily={fontHauoraSemiBold}
          icon={<IconArrowLeft color="#679FF0" size={24} />}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          Back to home
        </ButtonPrimary>
        <Text
          mt={32}
          textAlign="center"
          fontSize="lg"
          fontFamily={fontHauoraMedium}
          color="#535353"
        >
          A confirmation email and payment receipt were sent to your email
        </Text>
      </Div>
    </Div>
  );
}

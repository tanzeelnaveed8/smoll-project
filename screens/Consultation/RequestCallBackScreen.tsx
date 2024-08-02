import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraMedium } from "@/constant/constant";
import { IconAlertCircle } from "@tabler/icons-react-native";
import React from "react";
import { Div, Image, Text } from "react-native-magnus";

const RequestCallBackScreen = () => {
  return (
    <Layout title="Request Call Back" showCloseIcon backBtnText="">
      <Div flex={1} pt={40}>
        <Div flexDir="row" alignItems="center" mb={24} justifyContent="center">
          <IconAlertCircle
            width={24}
            height={24}
            color={"#E02A2A"}
            style={{ alignSelf: "center" }}
          />
          <Text fontSize={"4xl"}>Temporarily Unavailable</Text>
        </Div>

        <Div alignItems="center" mb={12}>
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
            fontSize={"md"}
            fontFamily={fontHauoraMedium}
            color="darkGreyText"
          >
            DVM, GPCERT (FelP)
          </Text>
        </Div>

        <Text
          fontSize={"lg"}
          color="darkGreyText"
          fontFamily={fontHauoraMedium}
          textAlign="center"
          maxW={350}
          mx={"auto"}
        >
          Your vet is temporarily unavailable. Please submit another request,
          and your pet will be contacted as soon as possible.
        </Text>
      </Div>

      <ButtonPrimary>Request a call back</ButtonPrimary>
    </Layout>
  );
};

export default RequestCallBackScreen;

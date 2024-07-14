import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import StarRating from "@/components/partials/StarRating";
import { fontHauoraSemiBold } from "@/constant/constant";
import React from "react";
import { Div, Text } from "react-native-magnus";

const ConsultationFeedbackScreen = () => {
  return (
    <Layout showCloseIcon backBtnText="" title="Feedback">
      <Div pt={40} flex={1}>
        <Text fontSize={"4xl"} mb={20}>
          How was your experience?
        </Text>

        <StarRating
          onChange={(e) => {
            console.log("Rating:", e);
          }}
        />

        <Text mt={40} mb={12} fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
          Please share your experience
        </Text>

        <InputField placeholder="" multiline numberOfLines={6} />
      </Div>

      <ButtonPrimary>Submit feedback</ButtonPrimary>
    </Layout>
  );
};

export default ConsultationFeedbackScreen;

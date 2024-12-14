import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import {
  fontCooper,
  fontCooperMedium,
  fontHauora,
  fontHauoraMedium,
} from "@/constant/constant";
import { IconArrowRight } from "@tabler/icons-react-native";
import React from "react";
import { Div, Text } from "react-native-magnus";

const EmergencyScreen = () => {
  return (
    <Layout showBack>
      <Div
        flex={1}
        justifyContent="center"
        alignItems="center"
        maxW={320}
        mx={"auto"}
      >
        <Text fontSize={"6xl"} fontFamily={fontCooper} mb={10}>
          Emergency
        </Text>
        <Text
          fontSize={"lg"}
          lineHeight={22}
          textAlign="center"
          fontFamily={fontHauoraMedium}
        >
          Due the conditions of [pet's name] case you will be booked immediately
          with the vet on duty at [Clinic Name]
        </Text>
      </Div>

      <ButtonPrimary bgColor="danger">
        Confirm Appointment <IconArrowRight size={24} color={"#222"} />
      </ButtonPrimary>
    </Layout>
  );
};

export default EmergencyScreen;

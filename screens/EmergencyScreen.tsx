import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import {
  fontCooper,
  fontCooperMedium,
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import { IconArrowRight } from "@tabler/icons-react-native";
import React from "react";
import { Div, Text } from "react-native-magnus";

const EmergencyScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute() as {
    params: {
      isEmergency?: boolean;
      partnerId: string;
      partnerName: string;
      caseId: string;
      petName: string;
      selectedServices: {
        id: string;
        label: string;
        price: number;
      }[];
    };
  };
  const {
    isEmergency,
    partnerId,
    partnerName,
    caseId,
    selectedServices,
    petName,
  } = route.params;

  return (
    <Layout
      showBack
      style={{ paddingBottom: 35 }}
      onBackPress={() => {
        navigation.goBack();
      }}
    >
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
          Due the conditions of {petName} case you will be booked immediately
          with the vet on duty at {partnerName}
        </Text>
      </Div>

      <ButtonPrimary
        bgColor="danger"
        flexDir="row-reverse"
        alignItems="center"
        icon={<IconArrowRight size={24} color={"#fff"} />}
        onPress={() => {
          navigation.navigate("PaymentDetailsScreen", {
            // bookingId,
            // vetId: item.id,
            partnerId: partnerId,
            partnerName,
            caseId,
            selectedServices,
            isEmergency: isEmergency,
          });
        }}
      >
        Confirm Appointment
      </ButtonPrimary>
    </Layout>
  );
};

export default EmergencyScreen;

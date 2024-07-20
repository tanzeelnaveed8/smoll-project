import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { IconCalendarClock } from "@tabler/icons-react-native";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Div, Image, Text } from "react-native-magnus";

const btns = [
  {
    text: "Resehdule Booking",
    icon: <IconCalendarClock width={32} height={32} color={"#427594"} />,
  },
  {
    text: "Cancel Booking",
    icon: <IconCalendarClock width={32} height={32} color={"#427594"} />,
  },
];

const PartnerVetSuccessfullScreen = () => {
  return (
    <Layout showCloseIcon onBackPress={() => {}}>
      <Div flex={1} justifyContent="space-between" pt={20}>
        <Div>
          <Image
            source={require("../../assets/images/congratulation-screen-tick.png")}
            w={86.25}
            h={86.25}
            mb={32}
          />

          <Text fontSize={"6xl"} mb={8}>
            Thank you for booking with us
          </Text>
          <Text fontSize={"lg"} fontFamily={fontHauoraMedium} mb={32}>
            We will send a notification once your appointment has been accepted.
          </Text>

          <Div>
            <FlatList
              data={btns}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    gap: 24,
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <Div>{item.icon}</Div>
                  <Text
                    fontSize={"lg"}
                    fontFamily={fontHauoraSemiBold}
                    color="primary"
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.text}
            />
          </Div>
        </Div>

        <ButtonPrimary>Appointment Details</ButtonPrimary>
      </Div>
    </Layout>
  );
};

export default PartnerVetSuccessfullScreen;

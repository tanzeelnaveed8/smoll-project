import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraBold, fontHauoraSemiBold } from "@/constant/constant";
import { usePartnerStore } from "@/store/modules/partner";
import { NavigationType, PaymentPageRoute } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import { IconDotsVertical } from "@tabler/icons-react-native";
import React, { useMemo, useState } from "react";
import { Div, Image, Text } from "react-native-magnus";

const PaymentDetailsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const { caseId, clinicName, partnerId, scheduleAt, selectedServices, vetId } =
    route.params as PaymentPageRoute;

  const { partnerVetDetails, bookPartnerVet } = usePartnerStore();

  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    console.log("handleBook", partnerId, vetId, caseId, scheduleAt);
    if (!partnerId || !vetId || !caseId || !scheduleAt) {
      return;
    }
    try {
      setLoading(true);
      const updatedServices = selectedServices.map((item) => {
        return { id: item.id, label: item.label };
      });

      const { id } = await bookPartnerVet(
        vetId,
        partnerId,
        caseId,
        scheduleAt,
        updatedServices
      );
      navigation.navigate("PartnerVetSuccessfullScreen", {
        bookingId: id,
        vetId,
        partnerId,
        caseId,
        scheduleAt,
        selectedServices,
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = useMemo(() => {
    return selectedServices.reduce((acc, service) => {
      return acc + service.price;
    }, 0);
  }, [selectedServices]);

  const bookingCharges = useMemo(() => {
    // 11% of total amount
    return ((totalAmount ?? 0) * 11) / 100;
  }, [totalAmount]);

  return (
    <Layout
      showBack
      backBtnText=""
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <Div flex={1} pt={20}>
        <Div
          flexDir="row"
          justifyContent="space-between"
          alignItems="center"
          mb={40}
        >
          <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
            Payment Details
          </Text>

          <Text fontSize={"md"} color="darkGreyText">
            Case 312421
          </Text>
        </Div>

        <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} mb={5}>
          Here is what your bill will look like at the
        </Text>

        <Text fontSize={"2xl"} fontFamily={fontHauoraBold} mb={25}>
          {clinicName}
        </Text>

        <Div
          borderWidth={2}
          rounded={25}
          borderColor="#ccc"
          px={16}
          pb={14}
          pt={22}
        >
          <Div px={20} mb={15}>
            <Text fontSize={"md"} mb={2}>
              Your bill will be a minimum of
            </Text>

            <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={15}>
              AED{totalAmount}
            </Text>

            <Text fontSize={"md"} mb={2}>
              and a maximum of
            </Text>

            <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={10}>
              AED1,{bookingCharges.toFixed(2)}
            </Text>

            <IconDotsVertical size={22} strokeWidth={1.5} color={"#222"} />
          </Div>

          <Div
            bg="#EFE9DB"
            rounded={15}
            px={30}
            py={14}
            flexDir="row"
            alignItems="center"
            justifyContent="space-around"
            style={{ gap: 50 }}
            mb={25}
          >
            <Div>
              <Text mb={2}>Due Now</Text>
              <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
                AED{bookingCharges.toFixed(2)}
              </Text>
            </Div>

            <Div>
              <Text mb={2}>At the clinic</Text>
              <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
                AED{totalAmount}
              </Text>
            </Div>
          </Div>

          <ButtonPrimary
            bgColor="primary"
            mb={15}
            loading={loading}
            disabled={loading}
            onPress={handleBook}
          >
            Pay Now
          </ButtonPrimary>

          <Text fontSize={"md"} textAlign="center" maxW={"80%"} mx={"auto"}>
            You’ll recieve appointment confirmation after payment is successful
          </Text>
        </Div>
      </Div>

      <Div justifyContent="center" alignItems="center">
        <Div
          flexDir="row"
          alignItems="center"
          justifyContent="center"
          style={{ gap: 5 }}
          borderWidth={1}
          borderLeftWidth={1.5}
          borderRightWidth={1.5}
          borderColor="#B2B2B2"
          py={3}
          px={12}
          rounded={5}
          mb={15}
        >
          <Text
            fontSize={12}
            fontFamily={fontHauoraSemiBold}
            color="#B2B2B2"
            mt={2}
          >
            Payment securely processed by
          </Text>
          <Text
            fontSize={"lg"}
            fontFamily={fontHauoraBold}
            fontWeight={"900"}
            color="#B2B2B2"
          >
            stripe
          </Text>
        </Div>

        <Image
          source={require("@/assets/images/payment-service.png")}
          h={80}
          w={"80%"}
          style={{ objectFit: "contain" }}
        />
      </Div>
    </Layout>
  );
};

export default PaymentDetailsScreen;

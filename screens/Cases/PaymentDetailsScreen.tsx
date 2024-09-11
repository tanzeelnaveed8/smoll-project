import Layout from "@/components/app/Layout";
import WalletIcon from "@/components/icons/WalletIcon";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import FlashCustomContent from "@/components/partials/FlashCustomContent";
import {
  fontCooper,
  fontCooperMedium,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useCaseStore } from "@/store/modules/case";
import { usePartnerStore } from "@/store/modules/partner";
import { useUserStore } from "@/store/modules/user";
import { NavigationType, PaymentPageRoute } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { SetupParams } from "@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet";
import { IconDotsVertical } from "@tabler/icons-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Div, Image, ScrollDiv, Text } from "react-native-magnus";

const PaymentDetailsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const {
    caseId,
    clinicName,
    partnerId,
    scheduleAt,
    selectedServices,
    vetId,
    paymentIntentId,
  } = route.params as PaymentPageRoute;

  const { user, createPaymentIntent } = useUserStore();
  const { bookPartnerVet } = usePartnerStore();
  const { casesQuotes, fetchCaseQuotes } = useCaseStore();

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const paymentIntentRef = useRef<string | undefined>(undefined);

  const quote = useMemo(() => {
    return casesQuotes
      .get(caseId)
      ?.find((quote) => quote.partner.id === partnerId);
  }, [casesQuotes, partnerId, caseId]);

  const totalSelectedAmount = useMemo(() => {
    return selectedServices.reduce((acc, service) => {
      return acc + service.price;
    }, 0);
  }, [quote]);

  console.log("quote?.services", quote?.services);

  const minimumAmount = useMemo(() => {
    return quote?.services.reduce((acc, cur) => {
      return acc + (cur.label.toLowerCase() !== "recommended" ? cur.price : 0);
    }, 0);
  }, [quote]);

  const totalAmount = useMemo(() => {
    return quote?.services.reduce((acc, cur) => {
      return acc + cur.price;
    }, 0);
  }, [quote]);

  const bookingCharges = useMemo(() => {
    // 20% of total amount
    const amount = ((totalSelectedAmount ?? 0) * 20) / 100;
    return amount;
  }, [totalAmount]);

  useEffect(() => {
    // initialize();
  }, []);

  const initStripe = async () => {
    setLoading(true);

    try {
      const { ephemeralKey, paymentIntent, paymentIntentClientSecret } =
        await createPaymentIntent(
          user!.stripeCustomerId,
          Math.round(bookingCharges * 100), // Ensure the amount is in cents and rounded
          "AED"
        );

      paymentIntentRef.current = paymentIntent;

      const { error, paymentOption } = await initPaymentSheet({
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntentClientSecret, // Remove 'as any' cast
        merchantDisplayName: "Smoll",
        customerId: user!.stripeCustomerId,
        defaultBillingDetails: {
          name: user?.name,
        },
        appearance: {
          font: {
            family:
              Platform.OS === "android"
                ? "avenirnextregular"
                : "AvenirNext-Regular",
          },
          shapes: {
            borderRadius: 12,
            borderWidth: 0.5,
          },
          primaryButton: {
            colors: {
              background: "#000000",
              text: "#ffffff",
            },
            shapes: {
              borderRadius: 20,
            },
          },
          colors: {
            primary: "#fcfdff",
            background: "#ffffff",
            componentBackground: "#f3f8fa",
            componentBorder: "#f3f8fa",
            componentDivider: "#000000",
            primaryText: "#000000",
            secondaryText: "#000000",
            componentText: "#000000",
            placeholderText: "#73757b",
          },
        },
      } as SetupParams);

      if (error) {
        console.error("Stripe initialization error:", error);
        showMessage({
          message: "",
          renderCustomContent: () => (
            <FlashCustomContent message={`Stripe error: ${error.message}`} />
          ),
          type: "danger",
        });

        navigation.goBack();
      }
    } catch (error) {
      console.error("Error initializing Stripe:", error);
      showMessage({
        message: "",
        renderCustomContent: () => (
          <FlashCustomContent message="Failed to initialize payment. Please try again." />
        ),
        type: "danger",
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchQuote = async () => {
    try {
      setLoading(true);
      await fetchCaseQuotes(caseId);
    } finally {
      setLoading(false);
    }
  };

  const initialize = async () => {
    await fetchQuote();

    if (paymentIntentId) {
      paymentIntentRef.current = paymentIntentId;
    } else {
      await initStripe();
    }
  };

  const handleBook = async () => {
    if (!partnerId || !vetId || !caseId || !scheduleAt) {
      return;
    }

    try {
      setActionLoading(true);

      const updatedServices = selectedServices.map((item) => {
        return { id: item.id, label: item.label };
      });

      const { id } = await bookPartnerVet(
        vetId,
        partnerId,
        caseId,
        scheduleAt,
        updatedServices,
        paymentIntentRef.current
      );

      navigation.navigate("PartnerVetSuccessfullScreen", {
        bookingId: id,
        vetId,
        partnerId,
        caseId,
        scheduleAt,
        selectedServices,
        paymentIntentId: paymentIntentRef.current,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      showMessage({
        message: "",
        renderCustomContent: () => (
          <FlashCustomContent message="Could not process payment, please try again" />
        ),
        type: "danger",
      });

      return;
    }

    handleBook();
  };

  return (
    <Layout
      showBack
      backBtnText=""
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={loading}
    >
      <ScrollDiv flex={1} showsVerticalScrollIndicator={false}>
        <Div flex={1} pt={20} mb={50}>
          {/* <Div
          flexDir="row"
          justifyContent="space-between"
          alignItems="center"
          mb={40}
        >
          <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
            Payment Details
          </Text>
        </Div> */}

          <Div
            flexDir="row"
            justifyContent="space-between"
            alignItems="flex-end"
            mb={40}
          >
            <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
              Payment Details
            </Text>

            <Text
              fontSize={"lg"}
              fontFamily={fontHauoraSemiBold}
              color="#afafaf"
            >
              Case {caseId}
            </Text>
          </Div>

          <Text
            fontSize={"xl"}
            color="#000"
            fontFamily={fontCooperMedium}
            mb={8}
          >
            Here is what your bill will look like at the
          </Text>

          <Text fontSize={30} fontFamily={fontCooperMedium} mb={25}>
            {clinicName}
          </Text>

          <Div
            borderWidth={2}
            rounded={25}
            borderColor="#ccc"
            px={16}
            pb={14}
            pt={22}
            mb={22}
          >
            <Div px={20} mb={15}>
              <Text fontSize={"lg"} mb={8} fontFamily={fontHauoraSemiBold}>
                Your vet bill will be
              </Text>

              <Div flexDir="row" alignItems="flex-end" mb={20}>
                <Div>
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Minimum
                  </Text>
                  <Text
                    fontSize={"4xl"}
                    fontFamily={fontHauoraSemiBold}
                    lineHeight={30}
                  >
                    {minimumAmount}
                    <Text fontSize={"md"} fontFamily={fontHauoraSemiBold}>
                      AED
                    </Text>
                  </Text>
                </Div>

                <Div w={80} h={1} ml={30} mr={10} mb={8} bg="#222" />

                <Div>
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Maximum
                  </Text>

                  <Text
                    fontSize={"4xl"}
                    fontFamily={fontHauoraSemiBold}
                    lineHeight={30}
                  >
                    {/* {totalSelectedAmount} */}
                    {totalSelectedAmount}
                    <Text fontSize={"md"} fontFamily={fontHauoraSemiBold}>
                      AED
                    </Text>
                  </Text>
                </Div>
              </Div>

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
              // mb={25}
            >
              <Div>
                <Text mb={2} fontFamily={fontHauoraMedium}>
                  20% Advance
                </Text>
                <Text
                  fontSize={"4xl"}
                  fontFamily={fontHauoraSemiBold}
                  lineHeight={30}
                >
                  {bookingCharges}
                  <Text fontSize={"md"} fontFamily={fontHauoraSemiBold}>
                    AED
                  </Text>
                </Text>
              </Div>

              <Div flexDir="row" alignItems="flex-end" style={{ gap: 6 }}>
                <WalletIcon mb={4} />
                <Text fontSize={12} fontFamily={fontHauoraSemiBold} maxW={130}>
                  Balance paid at the clinic after service is received
                </Text>
              </Div>
            </Div>
          </Div>

          <ButtonPrimary
            mb={15}
            onPress={openPaymentSheet}
            loading={actionLoading}
            disabled={actionLoading}
            fontFamily={fontHauoraSemiBold}
            bg="#0000FF"
            maxW={"85%"}
            mx={"auto"}
          >
            Pay Now
          </ButtonPrimary>

          <Text
            fontSize={12}
            fontFamily={fontHauoraSemiBold}
            textAlign="center"
            maxW={"70%"}
            mx={"auto"}
          >
            You’ll recieve appointment confirmation after payment is successful
          </Text>
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
            mb={10}
          >
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraMedium}
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
      </ScrollDiv>
    </Layout>
  );
};

export default PaymentDetailsScreen;

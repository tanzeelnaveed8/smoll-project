import Layout from "@/components/app/Layout";
import AccurateCostIcon from "@/components/icons/AccurateCostIcon";
import AedoIcon from "@/components/icons/AedoIcon";
import DotIcon from "@/components/icons/DotIcon";
import InformationIcon from "@/components/icons/InformationIcon";
import InstantConfirmationIcon from "@/components/icons/InstantConfirmationIcon";
import RefundIcon from "@/components/icons/RefundIcon";
import StripeIcon from "@/components/icons/StripeIcon";
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
import {
  IconAlertCircle,
  IconAlertCircleFilled,
  IconCalendarCheck,
  IconDotsVertical,
} from "@tabler/icons-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Div, Image, ScrollDiv, Text } from "react-native-magnus";

const icons = [
  {
    img: require("../../assets/images/instant-confirmation-icon.png"),
    // icon: <InstantConfirmationIcon />,
    text: "Instant Confirmation",
  },
  {
    icon: <RefundIcon />,
    text: "Fully Refundable",
  },
  {
    icon: <AccurateCostIcon />,
    text: "Accurate Costs",
  },
];

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
    initialize();
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
        <Div flex={1} pt={10} mb={25}>
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
            <Text fontSize={"2xl"} fontFamily={fontHauoraSemiBold}>
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

          <Text fontSize={"2xl"} color="#000">
            Your final bill at
          </Text>

          <Text
            fontSize={"6xl"}
            fontFamily={fontCooper}
            mb={30}
            lineHeight={40}
          >
            {clinicName}
          </Text>

          <Div
            borderWidth={2}
            rounded={25}
            borderColor="#ccc"
            px={16}
            pb={14}
            pt={16}
            mb={10}
          >
            <Div px={20} mb={15}>
              <Div flexDir="row" alignItems="flex-end" mb={30}>
                {/* <Div>
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Minimum
                  </Text>
                  <Text
                    fontSize={"5xl"}
                    fontFamily={fontHauoraBold}
                    lineHeight={36}
                  >
                    {minimumAmount}
                    <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                      {" "}
                      AED
                    </Text>
                  </Text>
                </Div> */}

                {/* <Div w={80} h={1} ml={30} mr={10} mb={8} bg="#222" /> */}

                <Div>
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Final Maximum
                  </Text>

                  <Text
                    fontSize={"5xl"}
                    fontFamily={fontHauoraBold}
                    lineHeight={36}
                  >
                    {/* {totalSelectedAmount} */}
                    {totalSelectedAmount}
                    <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                      {" "}
                      AED
                    </Text>
                  </Text>

                  <Div
                    style={{
                      marginLeft: "auto",
                      position: "absolute",
                      bottom: -30,
                      left: 8,
                    }}
                  >
                    <DotIcon />
                  </Div>
                </Div>
              </Div>
            </Div>

            <Div
              flexDir="row"
              alignItems="center"
              justifyContent="space-around"
              style={{ gap: 20 }}
              // mb={25}
            >
              <Div bg="#EFE9DB" rounded={22} px={22} py={18}>
                <Text mb={5} fontSize={13} fontFamily={fontHauoraMedium}>
                  20% Advance due now
                </Text>
                <Text
                  fontSize={"5xl"}
                  fontFamily={fontHauoraBold}
                  lineHeight={30}
                >
                  {bookingCharges}
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    {" "}
                    AED
                  </Text>
                </Text>
              </Div>

              <Div style={{ gap: 2 }}>
                <WalletIcon mb={4} width={30} height={30} />
                <Text
                  fontSize={11}
                  lineHeight={15}
                  fontFamily={fontHauoraSemiBold}
                  maxW={130}
                >
                  Final balance to be paid at the clinic, depending on services
                  received.
                </Text>
              </Div>
            </Div>
          </Div>

          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 14,
              flexDirection: "row",
              gap: 3,
            }}
          >
            <InformationIcon width={11} height={11} />
            <Text fontSize={10} mb={1} fontFamily={fontHauoraSemiBold}>
              Understand how payment work
            </Text>
          </TouchableOpacity>

          <ButtonPrimary
            mb={10}
            onPress={openPaymentSheet}
            loading={actionLoading}
            disabled={actionLoading}
            fontFamily={fontHauoraSemiBold}
            bg="#0000FF"
            maxW={278}
            mx={"auto"}
            py={16}
            fontSize={"xl"}
          >
            Confirm Appointment
          </ButtonPrimary>

          <Text
            fontSize={12}
            fontFamily={fontHauoraBold}
            textAlign="center"
            maxW={"70%"}
            mx={"auto"}
          >
            You’ll recieve appointment confirmation after payment is successful
          </Text>
        </Div>

        <Div
          flexDir="row"
          justifyContent="center"
          alignItems="flex-end"
          style={{ gap: 40 }}
          mb={30}
        >
          {icons.map((item) => (
            <Div alignItems="center" key={item.text}>
              {item.icon && item.icon}
              {item.img && <Image source={item.img} h={32} w={32} />}
              <Text mt={6} fontSize={"xs"} fontFamily={fontHauoraSemiBold}>
                {item.text}
              </Text>
            </Div>
          ))}
        </Div>

        <Div justifyContent="center" alignItems="center">
          <StripeIcon />

          <Image
            source={require("@/assets/images/payment-service.png")}
            h={80}
            mt={5}
            w={"72%"}
            style={{ objectFit: "contain" }}
          />
        </Div>
      </ScrollDiv>
    </Layout>
  );
};

export default PaymentDetailsScreen;

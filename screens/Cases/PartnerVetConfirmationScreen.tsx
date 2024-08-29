import React, { useEffect, useMemo, useState } from "react";
import { Button, Div, Image, ScrollDiv, Text } from "react-native-magnus";
import Header from "@/components/partials/Header";
import Container from "@/components/partials/Container";
import DoctorCard from "@/components/partials/DoctorCard";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import {
  IconCalendarMonth,
  IconReceiptRefund,
} from "@tabler/icons-react-native";
import Accordion from "@/components/partials/Accordion";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import Layout from "@/components/app/Layout";
import { NavigationType } from "@/store/types";
import ScrollWrapper from "@/components/partials/ScrollWrapper";
import { useRoute } from "@react-navigation/native";
import { usePartnerStore } from "@/store/modules/partner";
import dayjs from "dayjs";
import { ExpertAvailability } from "@/store/types/expert";
import { useCaseStore } from "@/store/modules/case";
import { Platform } from "react-native";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { SetupParams } from "@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet";
import { showMessage } from "react-native-flash-message";
import FlashCustomContent from "@/components/partials/FlashCustomContent";
import { useAuthStore } from "@/store/modules/auth";
import { useUserStore } from "@/store/modules/user";

const PartnerVetConfirmationScreen: React.FC<{
  navigation: NavigationType;
}> = ({ navigation }) => {
  const route = useRoute();
  const { user, createPaymentIntent } = useUserStore();
  const { partnerVetDetails, bookPartnerVet } = usePartnerStore();
  const { casesQuotes, fetchCaseQuotes } = useCaseStore();

  const partnerId = (route.params as Record<string, string>)?.partnerId;
  const caseId = (route.params as Record<string, string>)?.caseId;
  const vetId = (route.params as Record<string, string>)?.vetId;
  const selectedDate = (route.params as Record<string, string>)?.selectedDate;
  const selectedTime = (route.params as Record<string, string>)?.selectedTime;
  const scheduleAt = (route.params as Record<string, string>)?.scheduleAt;
  const selectedServices = (
    route.params as {
      selectedServices: { id: string; label: string; price: number }[];
    }
  )?.selectedServices;

  console.log("selectedServices", selectedServices);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const quote = useMemo(() => {
    return casesQuotes
      .get(caseId)
      ?.find((quote) => quote.partner.id === partnerId);
  }, [casesQuotes, partnerId, caseId]);

  const partner = useMemo(() => {
    return quote?.partner;
  }, [quote]);

  const parsedSelectedTime = JSON.parse(
    selectedTime
  ) as ExpertAvailability["intervals"][number];
  const parsedSelectedDate = new Date(selectedDate);

  const partnerDetails = useMemo(() => {
    return partnerVetDetails.get(vetId);
  }, [partnerVetDetails, vetId]);

  const scheduledTime = useMemo(() => {
    const date = dayjs(parsedSelectedDate).format("YYYY-MM-DD");

    const fromTime = dayjs(`${date}T${parsedSelectedTime.from}Z`).format(
      "hh:mm A"
    );

    const toTime = dayjs(`${date}T${parsedSelectedTime.to}Z`).format("hh:mm A");

    return `${fromTime} - ${toTime}`;
  }, [parsedSelectedDate, parsedSelectedTime]);

  console.log("quote==", quote);

  const totalAmount = useMemo(() => {
    return selectedServices.reduce((acc, service) => {
      return acc + service.price;
    }, 0);
  }, [quote]);

  const bookingCharges = useMemo(() => {
    // 11% of total amount
    const amount = ((totalAmount ?? 0) * 11) / 100;
    return amount;
  }, [totalAmount]);

  const handleBook = async () => {
    if (!partnerId || !vetId || !caseId || !scheduleAt) {
      return;
    }

    try {
      setActionLoading(true);

      const updatedServices = selectedServices.map((item) => {
        return { id: item.id, label: item.label };
      });

      console.log("updatedServices", updatedServices);

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
      setActionLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await fetchQuote();
    await initStripe();
  };

  const fetchQuote = async () => {
    try {
      setLoading(true);
      await fetchCaseQuotes(caseId);
    } finally {
      setLoading(false);
    }
  };

  const initStripe = async () => {
    setLoading(true);

    const { ephemeralKey, paymentIntent } = await createPaymentIntent(
      user!.stripeCustomerId,
      bookingCharges * 100,
      "AED"
    );

    const { error, paymentOption } = await initPaymentSheet({
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent as any,
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
      showMessage({
        message: "",
        renderCustomContent: () => (
          <FlashCustomContent message="Something went wrong" />
        ),
        type: "danger",
      });

      navigation.goBack();
    }

    setLoading(false);
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
    }

    handleBook();
  };

  return (
    <Layout
      showBack
      title="Confirm Appointment"
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={loading}
    >
      <ScrollDiv flex={1} showsVerticalScrollIndicator={false}>
        <Div h={20}></Div>
        <ReadonlyItem
          field="Veterinarian"
          value={
            <Div row>
              <Text
                fontFamily={fontHauoraSemiBold}
                fontSize="xl"
                lineHeight={24}
              >
                {partnerDetails?.name}
              </Text>

              <Image
                source={{
                  uri:
                    partnerDetails?.profileImg?.url ??
                    "https://via.placeholder.com/150",
                }}
                w={50}
                h={50}
                rounded={100}
                right={0}
                top={-25}
                position="absolute"
                bg="#eeeeee"
                ml="auto"
                borderWidth={1}
                borderColor="#D0D7DC"
              />
            </Div>
          }
          mb={16}
        />

        <ReadonlyItem
          field="Clinic"
          value={
            <Div row>
              <Text
                fontFamily={fontHauoraSemiBold}
                fontSize="xl"
                lineHeight={24}
              >
                {partnerDetails?.partnerName}
              </Text>

              <Image
                source={{
                  uri:
                    partner?.clinicImg?.url ??
                    "https://via.placeholder.com/150",
                }}
                w={50}
                h={50}
                rounded={100}
                right={0}
                top={-25}
                position="absolute"
                bg="#eeeeee"
                ml="auto"
                borderWidth={1}
                borderColor="#D0D7DC"
              />
            </Div>
          }
          mb={12}
        />

        <Text
          fontFamily={fontHauoraSemiBold}
          fontSize="xl"
          lineHeight={24}
          color="darkGreyText"
          mb={8}
        >
          Date and time
        </Text>

        <Div flexDir="row" justifyContent="space-between" mb={24}>
          <Div flexDir="row" alignItems="center">
            <IconCalendarMonth size={32} color="#222222" strokeWidth={1.5} />
            <Text
              ml={16}
              fontFamily={fontHauoraSemiBold}
              fontSize="lg"
              lineHeight={24}
              color="#222222"
            >
              {scheduledTime} {"\n"}
              {dayjs(parsedSelectedDate).format("ddd, D MMM YYYY")}
            </Text>
          </Div>

          <Button
            bg="transparent"
            fontFamily={fontHauoraSemiBold}
            fontSize="lg"
            lineHeight={24}
            color="#0189F9"
            onPress={() => navigation.goBack()}
          >
            Change
          </Button>
        </Div>

        <Div
          px={16}
          py={24}
          pb={16}
          rounded={12}
          borderWidth={1}
          borderColor="#D0D7DC"
        >
          <Div mb={16}>
            <RowText
              name="Billing Summary"
              fontFamily={fontHauoraSemiBold}
              mb={24}
            />

            <RowText
              name="Consultation charges"
              value={`${totalAmount?.toFixed(2)} AED`}
              fontFamily={fontHauoraMedium}
              mb={16}
            />
            <RowText
              name="Advance booking"
              value={`${bookingCharges.toFixed(2)} AED`}
              percent="11%"
              fontFamily={fontHauoraMedium}
            />
          </Div>
        </Div>

        <Div mt={24}>
          <Text
            fontFamily={fontHauoraSemiBold}
            fontSize="lg"
            lineHeight={24}
            color="#222222"
          >
            (FAQ) Frequently Asked Questions
          </Text>

          <Accordion pt={12}>
            <Accordion.title>
              <Text
                fontFamily={fontHauoraMedium}
                fontSize="lg"
                lineHeight={20}
                color="#494949"
              >
                Do I need to bring my pet in a carrier?
              </Text>
            </Accordion.title>
            <Accordion.content>
              <Text>This is a dummy content</Text>
            </Accordion.content>
          </Accordion>
          <Accordion>
            <Accordion.title>
              <Text
                fontFamily={fontHauoraMedium}
                fontSize="lg"
                lineHeight={20}
                color="#494949"
              >
                How often should my pet have a check-up?
              </Text>
            </Accordion.title>
            <Accordion.content>
              <Text>This is a dummy content 2</Text>
            </Accordion.content>
          </Accordion>
          <Accordion>
            <Accordion.title>
              <Text
                fontFamily={fontHauoraMedium}
                fontSize="lg"
                lineHeight={20}
                color="#494949"
              >
                Are there any preparations needed before the appointment?
              </Text>
            </Accordion.title>
            <Accordion.content>
              <Text>This is a dummy content 3</Text>
            </Accordion.content>
          </Accordion>
        </Div>
      </ScrollDiv>

      <Div mt={20}>
        <ButtonPrimary
          onPress={openPaymentSheet}
          loading={actionLoading}
          disabled={actionLoading}
        >
          {`Pay ${bookingCharges.toFixed(2)} AED`}
        </ButtonPrimary>
      </Div>
      {/* </ScrollDiv> */}
    </Layout>
  );
};

const ReadonlyItem = ({
  field,
  value,
  mb,
}: {
  field: string;
  value: string | React.ReactNode;
  mb?: number;
}) => {
  return (
    <Div pb={16} borderBottomWidth={1} borderColor="#E0E0E0" mb={mb ? mb : 0}>
      <Text
        fontFamily={fontHauoraBold}
        // fontSize={"l"}
        // lineHeight={16}
        color="darkGreyText"
      >
        {field}
      </Text>

      {typeof value === "string" ? (
        <Text fontFamily={fontHauoraSemiBold} fontSize="xl" lineHeight={24}>
          {value}
        </Text>
      ) : (
        value
      )}
    </Div>
  );
};

export default PartnerVetConfirmationScreen;

const RowText: React.FC<{
  name: string;
  percent?: string;
  value?: string;
  fontFamily: string;
  mb?: number;
}> = ({ name, percent, value, fontFamily, mb }) => {
  return (
    <Div
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      mb={mb ? mb : 0}
    >
      <Div flexDir="row" alignItems="center">
        <Text fontSize={"xl"} fontFamily={fontFamily}>
          {name}
        </Text>

        {percent && (
          <Text
            ml={8}
            color="primary"
            fontSize={"md"}
            fontFamily={fontHauoraMedium}
          >
            {percent}
          </Text>
        )}
      </Div>

      {value && (
        <Text fontSize={"xl"} fontFamily={fontFamily}>
          {value}
        </Text>
      )}
    </Div>
  );
};

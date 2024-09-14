import Layout from "@/components/app/Layout";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import FlashCustomContent from "@/components/partials/FlashCustomContent";
import {
  fontHauoraMedium,
  fontHauoraSemiBold,
  fontHeading,
} from "@/constant/constant";
import {
  appointmentFormatedTime,
  useAppointmentStore,
} from "@/store/modules/appointments";
import { useExpertStore } from "@/store/modules/expert";
import { usePartnerStore } from "@/store/modules/partner";
import { NavigationType } from "@/store/types";
import { AppointmentDetailResponseDto } from "@/store/types/appointments";
import { useRoute } from "@react-navigation/native";
import {
  IconCalendarClock,
  IconUser,
  IconUserX,
} from "@tabler/icons-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Button, Div, Image, Tag, Text } from "react-native-magnus";

const actionBtn = [
  // {
  //   icon: <IconCalendarClock width={30} height={30} color={"#427594"} />,
  //   text: "Reschedule Booking",
  // },
  {
    icon: <IconUserX width={30} height={30} color={"#427594"} />,
    text: "Cancel Booking",
  },
];

const AppointmentDetailsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const id = (route.params as { id: string })?.id;
  const type = (route.params as { type: string })?.type;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const {
    fetchAppointmentDetail,
    cancelAppointment,
    rescheduleAppointment,
    cancelConsultation,
  } = useAppointmentStore();

  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetailResponseDto | null>(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);

      const data = await fetchAppointmentDetail(
        id,
        type as "in-clinic" | "video"
      );

      setAppointmentDetail(data);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("appointmentDetail==", appointmentDetail);

  const handleDeleteBooking = async () => {
    try {
      setDeleteLoading(true);

      console.log("id", id);

      if (appointmentDetail?.type === "video") {
        await cancelConsultation(id);
      } else {
        await cancelAppointment(id);
      }

      setShowCancelModal(false);
      setDeleteLoading(false);

      navigation.navigate("AppointmentsScreen");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRescheduleBooking = async () => {
    if (!appointmentDetail) return;
    try {
      setRescheduleLoading(true);

      showMessage({
        renderCustomContent: () => (
          <FlashCustomContent loader message="Rescheduling..." />
        ),
        message: "",
        type: "info",
        autoHide: false,
      });

      await rescheduleAppointment(id);

      showMessage({
        renderCustomContent: () => (
          <FlashCustomContent message="Please select a different timing." />
        ),
        message: "",
        type: "success",
        autoHide: true,
      });

      // navigation.navigate("PartnerVetDetailScreen", {
      //   vetId: appointmentDetail.vet.id,
      //   partnerId: appointmentDetail.partner.id,
      //   caseId: appointmentDetail.case.id,
      //   selectedServices: appointmentDetail.services,
      //   backTo: "HomeScreen",
      // });
    } finally {
      setRescheduleLoading(false);
    }
  };

  return (
    <Layout
      title="Appointment Details"
      showBack
      onBackPress={() => {
        navigation.navigate("AppointmentsScreen");
      }}
      loading={isLoading}
    >
      <Div flex={1}>
        <Div flex={1} pt={20}>
          <Div
            justifyContent="center"
            alignItems="center"
            pb={24}
            mb={24}
            borderBottomWidth={1}
            borderColor="#D0D7DC"
          >
            {appointmentDetail?.vet?.profileImg?.url ? (
              <Image
                w={100}
                h={100}
                rounded={100}
                mx={"auto"}
                mb={8}
                src={appointmentDetail?.vet?.profileImg?.url}
              />
            ) : (
              <Div
                mb={8}
                bg="#eeeeee"
                w={100}
                h={100}
                rounded={100}
                justifyContent="center"
                alignItems="center"
              >
                <IconUser width={"60%"} height={"60%"} color={"#fff"} />
              </Div>
            )}

            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              lineHeight={24}
              mb={4}
            >
              {appointmentDetail?.vet?.name}
            </Text>

            {appointmentDetail?.type !== "video" && (
              <Text fontSize={12} fontFamily={fontHauoraSemiBold}>
                {appointmentDetail?.partner?.name}
              </Text>
            )}

            <Div>
              <Tag
                fontSize={12}
                fontFamily={fontHauoraSemiBold}
                px={8}
                py={6}
                rounded={37}
                borderWidth={1}
                borderColor="#222"
                mb={16}
                bg="transparent"
                mt={12}
              >
                {appointmentDetail?.type === "video"
                  ? "Video Consultation"
                  : "Clinic Visit"}
              </Tag>
            </Div>

            <Text fontSize={12} fontFamily={fontHauoraSemiBold} mb={8}>
              Appointment On
            </Text>

            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              lineHeight={24}
              color="primary"
            >
              {appointmentDetail?.scheduledAt &&
                appointmentFormatedTime(appointmentDetail?.scheduledAt)}
            </Text>

            {appointmentDetail?.type === "video" && (
              <ButtonPrimary disabled mt={24}>
                Join
              </ButtonPrimary>
            )}
          </Div>

          <Div>
            {appointmentDetail?.type !== "video" && (
              <>
                <Text
                  fontSize={12}
                  fontFamily={fontHauoraSemiBold}
                  color="darkGreyText"
                  mb={8}
                >
                  Clinic Location
                </Text>

                <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} mb={8}>
                  {appointmentDetail?.partner?.name ?? "-"}
                </Text>
                <Text fontSize={"md"} fontFamily={fontHauoraMedium} mb={24}>
                  {appointmentDetail?.partner?.address ?? "-"}
                </Text>

                <Text
                  fontSize={12}
                  fontFamily={fontHauoraSemiBold}
                  color="darkGreyText"
                  mb={8}
                >
                  Pet
                </Text>
              </>
            )}

            <Div flexDir="row" alignItems="center" mb={28}>
              <Div>
                <Image
                  w={48}
                  h={48}
                  rounded={48}
                  mr={8}
                  src={appointmentDetail?.pet.photos[0].url}
                  // source={require("../../assets/images/dog.png")}
                />
              </Div>

              <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
                {appointmentDetail?.pet.name}
              </Text>
            </Div>

            <Div>
              {actionBtn.map((item) => (
                <TouchableOpacity
                  disabled={rescheduleLoading}
                  key={item.text}
                  style={{ marginBottom: 24 }}
                  onPress={() => {
                    if (item.text.includes("Cancel")) {
                      setShowCancelModal(true);
                    } else if (item.text.includes("Reschedule")) {
                      handleRescheduleBooking();
                    }
                  }}
                >
                  <Button
                    bg="transparent"
                    p={0}
                    pointerEvents="none"
                    flexDir="row"
                    style={{ gap: 12 }}
                    alignItems="center"
                  >
                    {/* <IconUserX width={26} height={26} color={"#427594"} /> */}
                    {item.icon}
                    <Text
                      fontSize={"xl"}
                      fontFamily={fontHauoraSemiBold}
                      color="primary"
                    >
                      {item.text}
                    </Text>
                  </Button>
                </TouchableOpacity>
              ))}
            </Div>
          </Div>
        </Div>

        <BottomSheet
          isVisible={showCancelModal}
          h={340}
          showCloseIcon
          onCloseIconClick={() => {
            setShowCancelModal(false);
          }}
          roundedTop={24}
        >
          <Div>
            <Text fontSize={"6xl"} mb={8} fontFamily={fontHeading}>
              Cancel Booking
            </Text>

            <Text fontSize={"md"} fontFamily={fontHauoraMedium} mb={16}>
              Are you sure you want to cancel your appointment with Dr.{" "}
              {appointmentDetail?.vet.name}?
            </Text>

            <ButtonPrimary
              bgColor="danger"
              mb={12}
              onPress={handleDeleteBooking}
              loading={deleteLoading}
              disabled={deleteLoading}
            >
              Yes, Cancel
            </ButtonPrimary>

            <ButtonPrimary
              bgColor="primary"
              onPress={() => {
                setShowCancelModal(false);
              }}
              disabled={deleteLoading}
            >
              Keep it Booked
            </ButtonPrimary>
          </Div>
        </BottomSheet>
      </Div>
    </Layout>
  );
};

export default AppointmentDetailsScreen;

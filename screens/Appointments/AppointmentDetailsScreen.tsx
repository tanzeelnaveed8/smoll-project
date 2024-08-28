import Layout from "@/components/app/Layout";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import {
  appointmentFormatedTime,
  useAppointmentStore,
} from "@/store/modules/appointments";
import { usePartnerStore } from "@/store/modules/partner";
import { NavigationType } from "@/store/types";
import { AppointmentDetailResponseDto } from "@/store/types/appointments";
import { useRoute } from "@react-navigation/native";
import { IconUser, IconUserX } from "@tabler/icons-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Button, Div, Image, Tag, Text } from "react-native-magnus";

const AppointmentDetailsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const id = (route.params as { id: string })?.id;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { fetchAppointmentDetail } = useAppointmentStore();

  const { cancelAppointment } = usePartnerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetailResponseDto | null>(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);

      const data = await fetchAppointmentDetail(id);

      setAppointmentDetail(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    try {
      setDeleteLoading(true);

      console.log("id", id);

      await cancelAppointment(id);

      setShowCancelModal(false);
      setDeleteLoading(false);

      navigation.navigate("AppointmentsScreen");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Layout
      title="Appointment Details"
      showBack
      onBackPress={() => {
        navigation.goBack();
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
              <Div mb={8}>
                <IconUser width={100} height={100} />
              </Div>
            )}

            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              lineHeight={24}
              mb={4}
            >
              {appointmentDetail?.vet.name}
            </Text>

            <Text fontSize={12} fontFamily={fontHauoraSemiBold} mb={12}>
              {appointmentDetail?.partner.name}
            </Text>

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
              >
                Clinic Visit
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

            {/* <ButtonPrimary bgColor="primary" mt={24}>
              Join
            </ButtonPrimary> */}
          </Div>

          <Div>
            <Text
              fontSize={12}
              fontFamily={fontHauoraSemiBold}
              color="darkGreyText"
              mb={8}
            >
              Clinic Location
            </Text>

            <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} mb={8}>
              {appointmentDetail?.partner.name ?? "-"}
            </Text>
            <Text fontSize={"md"} fontFamily={fontHauoraMedium} mb={24}>
              {appointmentDetail?.partner.address ?? "-"}
            </Text>

            <Text
              fontSize={12}
              fontFamily={fontHauoraSemiBold}
              color="darkGreyText"
              mb={8}
            >
              Pet
            </Text>

            <Div flexDir="row" alignItems="center" mb={24}>
              <Image
                w={48}
                h={48}
                rounded={48}
                mr={8}
                src={appointmentDetail?.pet.photos[0].url}
                // source={require("../../assets/images/dog.png")}
              />
              <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
                {appointmentDetail?.pet.name}
              </Text>
            </Div>

            <Div>
              <TouchableOpacity
                onPress={() => {
                  setShowCancelModal(true);
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
                  <IconUserX width={26} height={26} color={"#427594"} />
                  <Text
                    fontSize={"xl"}
                    fontFamily={fontHauoraSemiBold}
                    color="primary"
                  >
                    Cancel Booking
                  </Text>
                </Button>
              </TouchableOpacity>
            </Div>
          </Div>
        </Div>

        <BottomSheet
          isVisible={showCancelModal}
          h="45%"
          showCloseIcon
          onCloseIconClick={() => {
            setShowCancelModal(false);
          }}
          roundedTop={24}
        >
          <Div>
            <Text fontSize={"6xl"} mb={8}>
              Cancel Booking
            </Text>

            <Text fontSize={"md"} fontFamily={fontHauoraMedium} mb={16}>
              Are you sure you want to cancel your appointment with Dr. Emily
              Carter?
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

import Layout from "@/components/app/Layout";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import {
  colorPrimary,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import {
  appointmentFormatedTime,
  useAppointmentStore,
} from "@/store/modules/appointments";
import { NavigationType } from "@/store/types";
import { AppointmentDetailResponseDto } from "@/store/types/appointments";
import { useRoute } from "@react-navigation/native";
import { IconUserX } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";

const AppointmentDetailsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const id = (route.params as { id: string })?.id;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { fetchAppointmentDetail, appointmentDetails, deleteAppointment } =
    useAppointmentStore();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const data: AppointmentDetailResponseDto | null = (id &&
    appointmentDetails.get(id)) as AppointmentDetailResponseDto;
  console.log("data", data);

  useEffect(() => {
    if (!id || appointmentDetails.get(id)) return;
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        await fetchAppointmentDetail(id);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDeleteBooking = async () => {
    try {
      setDeleteLoading(true);
      // await deleteAppointment(id);

      setTimeout(async () => {
        await deleteAppointment(id);
        setShowCancelModal(false);
        setDeleteLoading(false);
        navigation.navigate("AppointmentsScreen");
      }, 1000);
    } finally {
      // setDeleteLoading(false);
    }
  };

  return (
    <Layout
      title="Appointment Details"
      showBack
      backBtnText=""
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <Div flex={1}>
        {!isLoading && data && (
          <Div flex={1} pt={20}>
            <Div
              justifyContent="center"
              alignItems="center"
              pb={24}
              mb={24}
              borderBottomWidth={1}
              borderColor="#D0D7DC"
            >
              <Image
                w={100}
                h={100}
                rounded={100}
                mx={"auto"}
                mb={8}
                src={data.vet.profileImg.url}
                // source={require("../../assets/images/doctor-img.png")}
              />
              <Text
                fontSize={"xl"}
                fontFamily={fontHauoraSemiBold}
                lineHeight={24}
                mb={4}
              >
                {data.vet.name}
              </Text>

              <Text fontSize={12} fontFamily={fontHauoraSemiBold} mb={12}>
                {data.partner.name}
              </Text>

              <Text
                fontSize={12}
                fontFamily={fontHauoraSemiBold}
                px={8}
                py={6}
                rounded={37}
                borderWidth={1}
                borderColor="#222"
                mb={16}
              >
                Clinic Visit
              </Text>

              <Text fontSize={12} fontFamily={fontHauoraSemiBold} mb={8}>
                Appointment On
              </Text>

              <Text
                fontSize={"xl"}
                fontFamily={fontHauoraSemiBold}
                lineHeight={24}
                color="primary"
              >
                {appointmentFormatedTime(data.scheduledAt)}
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
                {data.partner.name}
              </Text>
              <Text fontSize={"md"} fontFamily={fontHauoraMedium} mb={24}>
                Al Wasl Road, Jumeirah, Dubai, UAE - Offering comprehensive pet
                care services in a modern facility.
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
                  mr={4}
                  src={data.pet.photos[0].url}
                  // source={require("../../assets/images/dog.png")}
                />
                <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
                  {data.pet.name}
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
        )}

        {isLoading && (
          <Div flex={1} justifyContent="center">
            <ActivityIndicator size="large" color={colorPrimary} />
          </Div>
        )}

        <BottomSheet
          isVisible={showCancelModal}
          h="40%"
          swipeDirection={["down"]}
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

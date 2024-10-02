import Layout from "@/components/app/Layout";
import CallIcon from "@/components/icons/CallIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import MessageIcon from "@/components/icons/MessageIcon";
import SquigglyLinesIcon from "@/components/icons/SquigglyLinesIcon";
import WalletIcon from "@/components/icons/WalletIcon";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import FlashCustomContent from "@/components/partials/FlashCustomContent";
import {
  fontHauoraBold,
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
  IconHelpCircle,
  IconReceipt,
  IconUser,
  IconUserX,
} from "@tabler/icons-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  TouchableOpacity,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { Button, Div, Image, ScrollDiv, Tag, Text } from "react-native-magnus";

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

const windowWidth = Dimensions.get("window").width;

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
  const [contactBtns, setContactBtns] = useState<
    {
      icon: React.ReactNode;
      text: string;
      link: string;
    }[]
  >([]);

  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetailResponseDto | null>(null);

  console.log("appointmentDetail", appointmentDetail);

  const selectedServicesAmount = useMemo(() => {
    return appointmentDetail?.services?.reduce((acc, service) => {
      return acc + service.price;
    }, 0);
  }, [appointmentDetail]);

  const allServicesAmount = useMemo(() => {
    return appointmentDetail?.allServices?.reduce((acc, service) => {
      return acc + service.price;
    }, 0);
  }, [appointmentDetail]);

  const bookingCharges = useMemo(() => {
    // 20% of total amount
    const amount = ((selectedServicesAmount ?? 0) * 20) / 100;
    return amount;
  }, [selectedServicesAmount]);

  // const contactBtns = useMemo(() => {
  //   return [
  //     {
  //       icon: <CallIcon />,
  //       text: "Call",
  //       link: `tel:${appointmentDetail?.partner?.phone}`,
  //     },
  //     // {
  //     //   icon: <LocationIcon />,
  //     //   text: "Location",
  //     // },
  //     {
  //       icon: <MessageIcon />,
  //       text: "Message",
  //       link: `mailto:${appointmentDetail?.partner?.email}`,
  //     },
  //   ];
  // }, [appointmentDetail]);

  useEffect(() => {
    if (!appointmentDetail) return;

    setContactBtns([]);
    const copy = [...contactBtns];

    if (appointmentDetail?.partner?.phone) {
      copy.push({
        icon: <CallIcon />,
        text: "Call",
        link: `tel:${appointmentDetail?.partner?.phone}`,
      });
    }

    if (appointmentDetail?.partner?.email) {
      copy.push({
        icon: <MessageIcon />,
        text: "Message",
        link: `mailto:${appointmentDetail?.partner?.email}`,
      });
    }

    if (appointmentDetail?.partner?.address) {
      copy.push({
        icon: <LocationIcon />,
        text: "Location",
        link: `https://www.google.com/maps/search/?api=1&query=${appointmentDetail?.partner?.address}`,
      });
    }

    setContactBtns(copy);
  }, [appointmentDetail]);

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
    <>
      <Layout
        title="Appointment Details"
        showBack
        style={{ paddingBottom: 0 }}
        onBackPress={() => navigation.goBack()}
      >
        {!isLoading && (
          <ScrollDiv showsVerticalScrollIndicator={false}>
            <Div flex={1}>
              <Div flex={1} pt={20}>
                <Div flex={1}>
                  <Div
                    justifyContent="center"
                    alignItems="center"
                    mb={24}
                    pb={26}
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

                    {/* {appointmentDetail?.type === "video" && (
              <ButtonPrimary disabled mt={24}>
                Join
              </ButtonPrimary>
            )} */}
                  </Div>

                  <Div
                    pb={25}
                    mb={18}
                    borderBottomWidth={1}
                    borderColor="#D0D7DC"
                  >
                    {!isLoading &&
                      appointmentDetail &&
                      appointmentDetail?.type
                        .toLowerCase()
                        .includes("clinic") && (
                        <Div
                          pb={16}
                          mb={24}
                          borderBottomWidth={1}
                          borderColor="#D0D7DC"
                        >
                          <Text
                            fontSize={12}
                            fontFamily={fontHauoraSemiBold}
                            color="darkGreyText"
                            mb={8}
                          >
                            Clinic Location
                          </Text>

                          <Div
                            mb={8}
                            flexDir="row"
                            justifyContent="space-between"
                          >
                            <Text
                              fontSize={"lg"}
                              fontFamily={fontHauoraSemiBold}
                            >
                              {appointmentDetail?.partner?.name ??
                                "Euro Pet Clinic"}
                            </Text>

                            <Div
                              flexDir="row"
                              alignItems="center"
                              mt={-4}
                              pr={30}
                              style={{ gap: 32 }}
                            >
                              {contactBtns.map((item, i) => (
                                <TouchableOpacity
                                  key={i}
                                  onPress={() => {
                                    Linking.openURL(item.link);
                                  }}
                                >
                                  {item.icon}
                                </TouchableOpacity>
                              ))}
                            </Div>
                          </Div>

                          <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                            {appointmentDetail?.partner?.address ?? "-"}
                          </Text>
                        </Div>
                      )}

                    <Text
                      fontSize={12}
                      fontFamily={fontHauoraSemiBold}
                      color="darkGreyText"
                      mb={8}
                    >
                      Pet
                    </Text>

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

                  {appointmentDetail?.type !== "video" && (
                    <>
                      <Div flexDir="row" style={{ gap: 6 }} mb={20}>
                        <IconReceipt width={20} height={20} color="#222" />
                        <Text fontSize={12} fontFamily={fontHauoraBold} mb={2}>
                          Approved Quotation
                        </Text>
                      </Div>

                      <Div flexDir="row" alignItems="flex-end" mb={30}>
                        <Div>
                          <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                            Minimum
                          </Text>
                          <Text
                            fontSize={"5xl"}
                            fontFamily={fontHauoraBold}
                            lineHeight={36}
                          >
                            {selectedServicesAmount}
                            <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                              {" "}
                              AED
                            </Text>
                          </Text>
                        </Div>

                        <Div w={80} h={1} mx={20} mb={8} bg="#222" />

                        <Div>
                          <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                            Maximum
                          </Text>

                          <Text
                            fontSize={"5xl"}
                            fontFamily={fontHauoraBold}
                            lineHeight={36}
                          >
                            {allServicesAmount}
                            <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                              {" "}
                              AED
                            </Text>
                          </Text>
                        </Div>
                      </Div>

                      <Div
                        flexDir="row"
                        alignItems="center"
                        justifyContent="space-around"
                        style={{ gap: 20 }}
                        mb={20}
                        // mb={25}
                      >
                        <Div bg="#EFE9DB" rounded={22} px={22} py={18}>
                          <Text
                            mb={6}
                            fontSize={13}
                            fontFamily={fontHauoraMedium}
                          >
                            20% Advance paid
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
                            maxW={200}
                          >
                            Final balance to be paid at the clinic, depending on
                            services received.
                          </Text>
                        </Div>
                      </Div>
                    </>
                  )}
                </Div>
              </Div>
            </Div>

            <Div h={30} />
          </ScrollDiv>
        )}

        {isLoading && (
          <Div justifyContent="center" alignItems="center" h={"90%"}>
            <ActivityIndicator size="large" color="#427594" />
          </Div>
        )}
      </Layout>

      {!isLoading && (
        <Div bg="bgColor" pt={55} pb={20}>
          <Image
            position="absolute"
            top={0}
            source={require("../../assets/images/appointment-details-bg.png")}
            w={"100%"}
            h={50}
          />

          <Div px={20}>
            {/* <Div w={"50%"} h={5} rounded={10} bg="#222" mx={"auto"} mb={30} /> */}

            <Div flexDir="row" style={{ gap: 8 }} mb={20}>
              <IconHelpCircle width={20} height={20} color="#222" />
              <Text fontSize={12} fontFamily={fontHauoraBold} mb={2}>
                Help
              </Text>
            </Div>

            <Div
              flexDir="row"
              justifyContent="space-between"
              alignItems="flex-start"
              pb={10}
            >
              <Div>
                <Text
                  fontSize={12}
                  fontFamily={fontHauoraBold}
                  mb={3}
                  color="#959594"
                >
                  Call us on 08:00 ~ 19:00
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("tel:+97144510090");
                  }}
                >
                  <Text fontSize={"xl"} fontFamily={fontHauoraBold}>
                    +971 44510090
                  </Text>
                </TouchableOpacity>
              </Div>

              <Text fontSize={12} fontFamily={fontHauoraBold}>
                or
              </Text>

              <Div>
                <Text
                  fontSize={12}
                  fontFamily={fontHauoraBold}
                  mb={3}
                  color="#959594"
                >
                  Send us an email
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("mailto:care@smoll.me");
                  }}
                >
                  <Text fontSize={"xl"} fontFamily={fontHauoraBold}>
                    care@smoll.me
                  </Text>
                </TouchableOpacity>
              </Div>
            </Div>
          </Div>
        </Div>
      )}

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
    </>
  );
};

export default AppointmentDetailsScreen;

/**

<Div flexDir="row" alignItems="flex-end" mb={30}>
                <Div>
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
                </Div>

                <Div w={80} h={1} ml={30} mr={10} mb={8} bg="#222" />

                <Div>
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Maximum
                  </Text>

                  <Text
                    fontSize={"5xl"}
                    fontFamily={fontHauoraBold}
                    lineHeight={36}
                  >
                    
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
                      left: 20,
                    }}
                  >
                    <DotIcon />
                  </Div>
                </Div>
              </Div>

 */

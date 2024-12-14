import Layout from "@/components/app/Layout";
import {
  colorPrimary,
  fontCooper,
  fontHauoraBold,
  fontHauoraSemiBold,
} from "@/constant/constant";
import {
  appointmentFormatedTime,
  useAppointmentStore,
} from "@/store/modules/appointments";
import { NavigationType } from "@/store/types";
import { AppointmentListResponseDto } from "@/store/types/appointments";
import { useFocusEffect } from "@react-navigation/native";
import { IconChevronRight, IconUser } from "@tabler/icons-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-bidirectional-infinite-scroll";

import { Div, Image, Tag, Text } from "react-native-magnus";

const generateRandomData = () => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    scheduledAt: new Date(
      Date.now() + Math.random() * 10000000000
    ).toISOString(),
    allServices: [
      {
        id: Math.random().toString(36).substring(2, 15),
        name: "Service " + Math.floor(Math.random() * 100),
        label: "Label " + Math.floor(Math.random() * 100),
        price: Math.floor(Math.random() * 100) + 1,
        description:
          "Description for service " + Math.floor(Math.random() * 100),
      },
    ],
    services: [
      {
        id: Math.random().toString(36).substring(2, 15),
        name: "Service " + Math.floor(Math.random() * 100),
        label: "Label " + Math.floor(Math.random() * 100),
        price: Math.floor(Math.random() * 100) + 1,
        description:
          "Description for service " + Math.floor(Math.random() * 100),
      },
    ],
    caseId: Math.random().toString(36).substring(2, 15),
    partner: {
      id: Math.random().toString(36).substring(2, 15),
      name: "Partner " + Math.floor(Math.random() * 100),
      email: `partner${Math.floor(Math.random() * 100)}@example.com`,
      phone: `+123456789${Math.floor(Math.random() * 10000)}`,
      clinicImg: {
        filename: "clinic_image.jpg",
        filesize: Math.floor(Math.random() * 10000),
        mimetype: "image/jpeg",
        url: "http://example.com/clinic_image.jpg",
      },
      address: "123 Main St",
      city: "City " + Math.floor(Math.random() * 100),
      country: "Country " + Math.floor(Math.random() * 100),
    },
    vet: {
      id: Math.random().toString(36).substring(2, 15),
      name: "Vet " + Math.floor(Math.random() * 100),
      designation: "Veterinarian",
      profileImg: {
        filename: "vet_image.jpg",
        filesize: Math.floor(Math.random() * 10000),
        mimetype: "image/jpeg",
        url: "http://example.com/vet_image.jpg",
      },
    },
    pet: {
      name: "Pet " + Math.floor(Math.random() * 100),
    },
    type: Math.random() > 0.5 ? "in-clinic" : "video",
  };
};

// const dummyDataArray = Array.from({ length: 5 }, generateRandomData).sort(
//   (a, b) =>
//     new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
// );

const dummyDataArray = [
  {
    id: "qnkdmjn87x8",
    scheduledAt: "2025-03-06T09:28:43.803Z",
    allServices: [
      {
        id: "mu6eej7ty9h",
        name: "Service 27",
        label: "Label 44",
        price: 21,
        description: "Description for service 51",
      },
    ],
    services: [
      {
        id: "jqvzl29r8tj",
        name: "Service 1",
        label: "Label 76",
        price: 78,
        description: "Description for service 37",
      },
    ],
    caseId: "3l1w13gt36m",
    partner: {
      id: "rp9uu73fmwr",
      name: "Partner 49",
      email: "partner98@example.com",
      phone: "+1234567896587",
      clinicImg: {
        filename: "clinic_image.jpg",
        filesize: 800,
        mimetype: "image/jpeg",
        url: "http://example.com/clinic_image.jpg",
      },
      address: "123 Main St",
      city: "City 29",
      country: "Country 92",
    },
    vet: {
      id: "cyb747va9rg",
      name: "Vet 40",
      designation: "Veterinarian",
      profileImg: {
        filename: "vet_image.jpg",
        filesize: 2064,
        mimetype: "image/jpeg",
        url: "http://example.com/vet_image.jpg",
      },
    },
    pet: { name: "Pet 64" },
    type: "in-clinic",
  },
  {
    id: "141afwiut5hh",
    scheduledAt: "2025-01-02T09:28:43.803Z",
    allServices: [
      {
        id: "qf5p3cajamf",
        name: "Service 21",
        label: "Label 70",
        price: 54,
        description: "Description for service 51",
      },
    ],
    services: [
      {
        id: "hroza81ub4a",
        name: "Service 24",
        label: "Label 13",
        price: 74,
        description: "Description for service 11",
      },
    ],
    caseId: "ty61i6bw59",
    partner: {
      id: "43az7utrsl2",
      name: "Partner 35",
      email: "partner44@example.com",
      phone: "+1234567896334",
      clinicImg: {
        filename: "clinic_image.jpg",
        filesize: 3119,
        mimetype: "image/jpeg",
        url: "http://example.com/clinic_image.jpg",
      },
      address: "123 Main St",
      city: "City 36",
      country: "Country 54",
    },
    vet: {
      id: "tq58qa5n1a",
      name: "Vet 23",
      designation: "Veterinarian",
      profileImg: {
        filename: "vet_image.jpg",
        filesize: 349,
        mimetype: "image/jpeg",
        url: "http://example.com/vet_image.jpg",
      },
    },
    pet: { name: "Pet 57" },
    type: "video",
  },
  {
    id: "gmph5vjwnxk",
    scheduledAt: "2024-12-08T09:28:43.803Z",
    allServices: [
      {
        id: "wyk1x6xj70c",
        name: "Service 29",
        label: "Label 27",
        price: 82,
        description: "Description for service 86",
      },
    ],
    services: [
      {
        id: "8c8uu9gz6st",
        name: "Service 2",
        label: "Label 99",
        price: 9,
        description: "Description for service 25",
      },
    ],
    caseId: "u9558kt0cg8",
    partner: {
      id: "tdhexsy5a9q",
      name: "Partner 10",
      email: "partner83@example.com",
      phone: "+1234567897119",
      clinicImg: {
        filename: "clinic_image.jpg",
        filesize: 3516,
        mimetype: "image/jpeg",
        url: "http://example.com/clinic_image.jpg",
      },
      address: "123 Main St",
      city: "City 52",
      country: "Country 38",
    },
    vet: {
      id: "6dn4xcwkd1e",
      name: "Vet 98",
      designation: "Veterinarian",
      profileImg: {
        filename: "vet_image.jpg",
        filesize: 4669,
        mimetype: "image/jpeg",
        url: "http://example.com/vet_image.jpg",
      },
    },
    pet: { name: "Pet 75" },
    type: "video",
  },
  {
    id: "riag66w0c4s",
    scheduledAt: "2025-01-05T09:28:43.803Z",
    allServices: [
      {
        id: "8hjbedcfx5x",
        name: "Service 55",
        label: "Label 6",
        price: 68,
        description: "Description for service 24",
      },
    ],
    services: [
      {
        id: "8ypftaa5d4u",
        name: "Service 71",
        label: "Label 88",
        price: 24,
        description: "Description for service 0",
      },
    ],
    caseId: "dmm1kvsh6l6",
    partner: {
      id: "etmtfosoncd",
      name: "Partner 82",
      email: "partner22@example.com",
      phone: "+1234567898937",
      clinicImg: {
        filename: "clinic_image.jpg",
        filesize: 1115,
        mimetype: "image/jpeg",
        url: "http://example.com/clinic_image.jpg",
      },
      address: "123 Main St",
      city: "City 37",
      country: "Country 66",
    },
    vet: {
      id: "zjlqd2yzx1m",
      name: "Vet 73",
      designation: "Veterinarian",
      profileImg: {
        filename: "vet_image.jpg",
        filesize: 2803,
        mimetype: "image/jpeg",
        url: "http://example.com/vet_image.jpg",
      },
    },
    pet: { name: "Pet 80" },
    type: "in-clinic",
  },
  {
    id: "zfb7f5y7r1",
    scheduledAt: "2025-02-04T09:28:43.803Z",
    allServices: [
      {
        id: "e231ayrsusd",
        name: "Service 71",
        label: "Label 52",
        price: 1,
        description: "Description for service 18",
      },
    ],
    services: [
      {
        id: "4vt3ni1veg7",
        name: "Service 47",
        label: "Label 40",
        price: 39,
        description: "Description for service 14",
      },
    ],
    caseId: "eswnhb18kwv",
    partner: {
      id: "y4pahqaoyf",
      name: "Partner 64",
      email: "partner45@example.com",
      phone: "+1234567897304",
      clinicImg: {
        filename: "clinic_image.jpg",
        filesize: 4404,
        mimetype: "image/jpeg",
        url: "http://example.com/clinic_image.jpg",
      },
      address: "123 Main St",
      city: "City 57",
      country: "Country 11",
    },
    vet: {
      id: "g4m287kz8oq",
      name: "Vet 71",
      designation: "Veterinarian",
      profileImg: {
        filename: "vet_image.jpg",
        filesize: 3796,
        mimetype: "image/jpeg",
        url: "http://example.com/vet_image.jpg",
      },
    },
    pet: { name: "Pet 84" },
    type: "in-clinic",
  },
];

const AppointmentsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { fetchAppointments, appointment: appointmentData } =
    useAppointmentStore();

  const [isLoading, setIsLoading] = useState(false);
  const [nextPageId, setNextPageId] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [appointment, setAppointment] = useState<
    null | AppointmentListResponseDto[]
  >(null);

  // const appointmentData = dummyDataArray;

  useEffect(() => {
    if (!appointmentData) return;
    const now = new Date(); // Get the current date and time

    // Separate appointments into upcoming and archived
    const upcomingAppointments = appointmentData.filter((item) => {
      const scheduledAt = new Date(item.scheduledAt); // Convert to Date object
      return scheduledAt > now; // Include only future appointments
    }) as AppointmentListResponseDto[];

    const archivedAppointments = appointmentData.filter((item) => {
      const scheduledAt = new Date(item.scheduledAt); // Convert to Date object
      return scheduledAt <= now; // Include only past or current appointments
    }) as AppointmentListResponseDto[];

    if (activeTab === "Upcoming") {
      setAppointment(upcomingAppointments);
    } else {
      setAppointment(archivedAppointments);
    }
  }, [activeTab, appointmentData]);

  useFocusEffect(
    useCallback(() => {
      // handleFetchAppointments(undefined, true);
    }, [])
  );

  const handleFetchAppointments = async (
    isRefresh?: boolean,
    reset?: boolean
  ) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetchAppointments(1, reset);

      console.log("response", response);

      setNextPageId(response.nextPage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextPageId) return;

    return new Promise<void>(async (resolve) => {
      try {
        const fetchedData = await fetchAppointments(nextPageId);
        setNextPageId(fetchedData.nextPage);
      } finally {
        resolve();
      }
    });
  };

  const actionBtns = ["Upcoming", "Archived"];

  return (
    <Layout
      showBack
      backBtnText=""
      title="Appointments"
      onBackPress={() => {
        navigation.navigate("HomeScreen");
      }}
      loading={isLoading}
    >
      <Div flex={1}>
        <Div flex={1} pt={24}>
          {/* {!isLoading && appointment && appointment.length > 0 && (
            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              lineHeight={24}
              mb={22}
            >
              Upcoming Appointments
            </Text>
          )} */}

          <Div
            flexDir="row"
            justifyContent="space-around"
            mb={45}
            borderWidth={1}
            borderColor="#ccc"
            rounded={12}
          >
            {actionBtns.map((item) => (
              <TouchableOpacity
                key={item}
                style={{
                  width: item === activeTab ? "50%" : "50%",
                  // borderWidth: 1,
                  borderRightWidth:
                    item === activeTab && activeTab === "Upcoming" ? 1 : 0,
                  borderLeftWidth:
                    item === activeTab && activeTab === "Archived" ? 1 : 0,
                  borderColor: "#ccc",
                  borderRadius: 12,
                  alignItems: "center",
                  padding: 5,
                  paddingVertical: 8,
                  backgroundColor: item !== activeTab ? "#FAF8F5" : "#f1ebe2",
                }}
                onPress={() => {
                  setActiveTab(item);
                }}
              >
                <Text
                  fontSize={16}
                  fontWeight="500"
                  fontFamily={fontHauoraBold}
                  ml={8}
                  color={item !== activeTab ? "#ccc" : "#222"}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </Div>

          <FlatList
            ListEmptyComponent={() => (
              <Div minH={350} justifyContent="flex-end">
                <Text
                  fontSize={"5xl"}
                  textAlign="center"
                  fontFamily={fontCooper}
                  maxW={"80%"}
                  mx={"auto"}
                  lineHeight={36}
                >
                  You don't have any upcoming appointments
                </Text>
              </Div>
            )}
            onEndReached={handleLoadMore} // required, should return a promise
            onEndReachedThreshold={20} // optional
            activityIndicatorColor={"black"} // optional
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                tintColor={colorPrimary}
                onRefresh={() => handleFetchAppointments(true)}
              />
            }
            showsVerticalScrollIndicator={false}
            data={appointment}
            renderItem={({ item, index }) => (
              <AppointmentCard
                img={item.partner?.clinicImg?.url ?? item.vet?.profileImg?.url}
                pet={item.pet.name}
                text={`Your upcoming ${
                  item.type === "in-clinic" ? "visit" : "consultation"
                } with ${item.partner?.name ?? item.vet?.name}`}
                scheduledTime={item.scheduledAt}
                type={
                  item.type === "in-clinic"
                    ? "Clinic Visit"
                    : "Video Consultation"
                }
                alert={""}
                onPress={() => {
                  if (!item.scheduledAt && item.type === "in-clinic") {
                    navigation.navigate("PartnerVetScreen", {
                      bookingId: item.id,
                      caseId: item.caseId,
                      partnerId: item.partner?.id,
                      partnerName: item.partner?.name,
                      selectedServices: item.services,
                    });
                  } else {
                    navigation.navigate("AppointmentDetailsScreen", {
                      id: item.id,
                      type: item.type,
                    });
                  }
                }}
              />
            )}
            keyExtractor={(item, index) => `${index}`}
          />

          {/* {!isLoading &&
            (!appointment || (appointment && appointment.length === 0)) && (
              <Div h={"90%"} justifyContent="center">
                <Text
                  fontSize={"5xl"}
                  textAlign="center"
                  fontFamily={fontCooper}
                >
                  You don't have any upcoming appointments
                </Text>
              </Div>
            )} */}
        </Div>
      </Div>
    </Layout>
  );
};

export default AppointmentsScreen;

const AppointmentCard: React.FC<{
  type: string;
  img: string;
  text: string;
  pet: string;
  alert?: string;
  isLastChild?: boolean;
  scheduledTime: string;
  onPress: () => void;
}> = (props) => {
  return (
    <TouchableOpacity style={{ marginBottom: 20 }} onPress={props.onPress}>
      <Div
        flexDir="row"
        pb={16}
        borderBottomWidth={1}
        borderColor={props.isLastChild ? "transparent" : "#D0D7DC"}
      >
        <Div
          w={60}
          h={60}
          rounded={100}
          bg="#eeeeee"
          mr={16}
          justifyContent="center"
          alignItems="center"
          borderColor="#D0D7DC"
          borderWidth={1}
        >
          {props.img ? (
            <Image w={"100%"} h={"100%"} rounded={100} src={props.img} />
          ) : (
            <IconUser size={24} width={40} height={40} color="#fff" />
          )}
        </Div>

        <Div maxW={230}>
          <Div mb={4} flexDir="row" style={{ gap: 4 }}>
            <Tag
              fontSize={12}
              fontFamily={fontHauoraSemiBold}
              px={8}
              py={6}
              rounded={37}
              borderWidth={1}
              borderColor="#222"
              style={{ alignSelf: "flex-start" }}
              bg="transparent"
            >
              {props.type}
            </Tag>

            {props.alert && (
              <Text
                fontSize={12}
                fontFamily={fontHauoraSemiBold}
                px={8}
                py={6}
                rounded={37}
                borderWidth={1}
                borderColor={
                  props.alert.toLowerCase() === "pending" ? "#E02A2A" : "#222"
                }
                color={
                  props.alert.toLowerCase() === "pending" ? "#E02A2A" : "#222"
                }
                style={{ alignSelf: "flex-start" }}
              >
                {props.alert}
              </Text>
            )}
          </Div>

          <Text
            fontSize={"lg"}
            fontFamily={fontHauoraSemiBold}
            mb={4}
            lineHeight={24}
          >
            {props.text}
          </Text>

          <Text
            fontSize={"md"}
            fontFamily={fontHauoraBold}
            color="darkGreyText"
            mb={4}
          >
            Pet: {props.pet}
          </Text>

          {props.scheduledTime ? (
            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              lineHeight={24}
              color="primary"
            >
              {appointmentFormatedTime(props.scheduledTime)}
            </Text>
          ) : (
            <Tag
              fontSize={12}
              fontFamily={fontHauoraSemiBold}
              px={8}
              py={6}
              rounded={37}
            >
              Pending reschedule
            </Tag>
          )}
        </Div>

        <IconChevronRight
          width={32}
          height={32}
          color={"#222"}
          style={{ alignSelf: "center", marginLeft: "auto" }}
        />
      </Div>
    </TouchableOpacity>
  );
};

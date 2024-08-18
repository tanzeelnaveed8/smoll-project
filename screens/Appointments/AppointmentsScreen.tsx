import Layout from "@/components/app/Layout";
import {
  colorPrimary,
  fontHauoraBold,
  fontHauoraSemiBold,
} from "@/constant/constant";
import {
  appointmentFormatedTime,
  useAppointmentStore,
} from "@/store/modules/appointments";
import { NavigationType } from "@/store/types";
import { IconChevronRight } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-bidirectional-infinite-scroll";

import { Div, Image, Text } from "react-native-magnus";

const AppointmentsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { fetchAppointments, appointment } = useAppointmentStore();
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageId, setNextPageId] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // const [page, setPage] = useState(1);

  useEffect(() => {
    handleFetchAppointments();
  }, []);

  // const handleFetchAppointments = async () => {
  //   // if (!nextPageId) return;
  //   try {
  //     setIsLoading(true);
  //     const response = await fetchAppointments(1);
  //     console.log("response", response);
  //     setNextPageId(response.nextPage);
  //     console.log("lading data response.nextPage", response.nextPage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleFetchAppointments = async (isRefresh?: boolean) => {
    console.log("fetching data");
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetchAppointments(1);
      setNextPageId(response.nextPage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextPageId) return;
    console.log("fetching data again");

    return new Promise<void>(async (resolve) => {
      try {
        const fetchedData = await fetchAppointments(nextPageId); // commented-out for now
        setNextPageId(fetchedData.nextPage); /// commented-out for now
      } finally {
        resolve();
      }
    });
  };

  const onStartReached = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  return (
    <Layout
      showBack
      backBtnText=""
      title="Appointments"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <Div flex={1}>
        {!isLoading &&
          (!appointment || (appointment && appointment?.length === 0)) && (
            <Div justifyContent="center" alignItems="center">
              <Text
                fontSize={"lg"}
                fontFamily={fontHauoraSemiBold}
                color="darkGreyText"
              >
                No Appointment found
              </Text>
            </Div>
          )}

        {!isLoading && appointment && appointment.length > 0 && (
          <Div flex={1} pt={24}>
            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              lineHeight={24}
              mb={22}
            >
              Upcoming Appointments
            </Text>

            <Div>
              <FlatList
                onStartReached={onStartReached}
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
                data={appointment}
                renderItem={({ item, index }) => (
                  <AppointmentCard
                    img={item.vet.profileImg.url}
                    pet={item.pet.name}
                    text={item.partner.name}
                    scheduledTime={item.scheduledAt}
                    type={"Clinic Visit"}
                    alert={""}
                    isLastChild={index + 1 === appointment.length}
                    onPress={() => {
                      navigation.navigate("AppointmentDetailsScreen", {
                        id: item.id,
                      });
                    }}
                  />
                )}
                keyExtractor={(item, index) => `${index}`}
              />
            </Div>
          </Div>
        )}

        {isLoading && (
          <Div flex={1} justifyContent="center">
            <ActivityIndicator size="large" color={colorPrimary} />
          </Div>
        )}
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
        <Image
          w={40}
          h={40}
          rounded={100}
          src={props.img}
          // source={require("../../assets/images/doctor-img.png")}
          mr={16}
        />

        <Div maxW={254}>
          <Div mb={4} flexDir="row" style={{ gap: 4 }}>
            <Text
              fontSize={12}
              fontFamily={fontHauoraSemiBold}
              px={8}
              py={6}
              rounded={37}
              borderWidth={1}
              borderColor="#222"
              style={{ alignSelf: "flex-start" }}
            >
              {props.type}
            </Text>

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

          <Text
            fontSize={"xl"}
            fontFamily={fontHauoraSemiBold}
            lineHeight={24}
            color="primary"
          >
            {/* Thu, 8 Aug - 3: 00PM */}
            {appointmentFormatedTime(props.scheduledTime)}
          </Text>
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

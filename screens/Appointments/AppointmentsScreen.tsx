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
import { IconChevronRight, IconUser } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { RefreshControl, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-bidirectional-infinite-scroll";

import { Div, Image, Tag, Text } from "react-native-magnus";

const AppointmentsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { fetchAppointments, appointment } = useAppointmentStore();
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageId, setNextPageId] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log("appointment", appointment);

  useEffect(() => {
    handleFetchAppointments(undefined, true);
  }, []);

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
        const fetchedData = await fetchAppointments(nextPageId); // commented-out for now
        setNextPageId(fetchedData.nextPage); /// commented-out for now
      } finally {
        resolve();
      }
    });
  };

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
          {!isLoading && appointment && appointment.length > 0 && (
            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              lineHeight={24}
              mb={22}
            >
              Upcoming Appointments
            </Text>
          )}

          <FlatList
            ListEmptyComponent={() => (
              <Div minH={350} justifyContent="flex-end">
                <Text
                  fontSize={"5xl"}
                  textAlign="center"
                  fontFamily={fontCooper}
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
                  navigation.navigate("AppointmentDetailsScreen", {
                    id: item.id,
                    type: item.type,
                  });
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

import Layout from "@/components/app/Layout";
import ChatIcon from "@/components/icons/ChatIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import AvailabilityAndDateSelector from "@/components/partials/AvailabilityAndDateSelector";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import DoctorCard from "@/components/partials/DoctorCard";
import {
  colorPrimary,
  fontCooper,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useExpertStore } from "@/store/modules/expert";
import { NavigationType } from "@/store/types";
import { ExpertAvailability } from "@/store/types/expert";
import { hasAvailabilityDateTimePassed } from "@/utils/helpers";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { Dimensions, RefreshControl } from "react-native";
import { Button, Div, ScrollDiv, Skeleton, Text } from "react-native-magnus";

const dayOfWeekMap: { [key: string]: number } = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const windowWidth = Dimensions.get("window").width;

const ExpertsListDetailScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const expertId =
    (route.params as Record<string, string>)?.id ??
    (route.params as Record<string, string>)?.expertId;
  // Incase of change schedule from schedule confirmation screen
  const caseData = (route.params as Record<string, string>)?.caseData;

  const {
    expertDetailMap,
    fetchExpertDetail,
    fetchExpertAvailability,
    requestConsultation,
  } = useExpertStore();

  const [availability, setAvailability] = useState<ExpertAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<{
    value: { from: string; to: string };
    label: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      handleFetchExpertDetails();
    }, [expertId])
  );

  const formatTime = useCallback(
    (
      availability: ExpertAvailability,
      interval: { from: string; to: string }
    ) => {
      const date = dayjs()
        .day(dayOfWeekMap[availability.dayOfWeek])
        .format("YYYY-MM-DD");

      const fromTime = dayjs(`${date}T${interval.from}Z`).format("hh:mm A");
      const toTime = dayjs(`${date}T${interval.to}Z`).format("hh:mm A");

      return `${fromTime} - ${toTime}`;
    },
    []
  );

  const handleFetchExpertDetails = async (isRefresh?: boolean) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      await fetchExpertDetail(expertId);
      handleDateSelect(dayjs().format("YYYY-MM-DD"));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDateSelect = async (date: string) => {
    try {
      if (selectedDate !== date) {
        setSelectedTime(null);
      }

      setAvailabilityLoading(true);
      setSelectedDate(date);

      const _availability = await fetchExpertAvailability(
        expertId,
        new Date(date)
      );

      setAvailability(_availability);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleRequestConsultation = async () => {
    try {
      setIsRequesting(true);
      const { id } = await requestConsultation(expertId);

      navigation.navigate("ConsultationCaseBriefScreen", {
        consultationId: id,
        expertId: expertId,
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleScheduleConsultation = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    try {
      setIsActionLoading(true);

      // const scheduledAt = selectedDate
      const _date = dayjs(selectedDate).format("YYYY-MM-DD");

      const scheduleAt = dayjs(
        _date.toString() +
          "T" +
          dayjs(`${_date}T${selectedTime.value.from}Z`).format("HH:mm")
      )
        .utc()
        .format();

      navigation.navigate("ConsultationCaseBriefScreen", {
        from: "ExpertsListDetailScreen",
        expertId,
        selectedTime: JSON.stringify(selectedTime?.value),
        selectedDate,
        scheduleAt,
        caseData,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const TimeBtnText: React.FC<{ time: string; color: string }> = ({
    time,
    color,
  }) => {
    const font = windowWidth > 390 ? 15 : 14;

    return (
      <Div flexDir="row" w={"100%"} justifyContent="center" flexWrap="wrap">
        <Text
          color={color}
          fontFamily={fontHauoraMedium}
          lineHeight={20}
          fontSize={font}
        >
          {time.split(" - ")[0]}
        </Text>
        <Text
          color={color}
          fontFamily={fontHauoraMedium}
          lineHeight={20}
          fontSize={font}
        >
          -
        </Text>
        <Text
          color={color}
          fontFamily={fontHauoraMedium}
          lineHeight={20}
          fontSize={font}
        >
          {time.split(" - ")[1]}
        </Text>
      </Div>
    );
  };

  return (
    <Layout
      showBack
      title={expertDetailMap.get(expertId)?.name ?? ""}
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={isLoading}
    >
      <ScrollDiv
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={colorPrimary}
            onRefresh={() => handleFetchExpertDetails(true)}
          />
        }
      >
        {/* <Header title="Book a Slot" /> */}

        <Div mb={24}>
          <DoctorCard
            name={expertDetailMap.get(expertId)?.name ?? ""}
            speciality={expertDetailMap.get(expertId)?.designation ?? ""}
            experience={expertDetailMap.get(expertId)?.yearsOfExperience ?? 0}
            isOnline={expertDetailMap.get(expertId)?.isOnline ?? false}
            image={expertDetailMap.get(expertId)?.profileImg?.url ?? ""}
            verified={true}
          />
        </Div>

        <Div maxW={350} mb={8}>
          <Text
            fontSize={"2xl"}
            fontWeight="bold"
            // fontFamily={fontHauoraSemiBold}
            fontFamily={fontCooper}
            mb={4}
            color="#368526"
          >
            Instant consultation
          </Text>
          <Text
            color="darkGreyText"
            mb={6}
            fontSize={"lg"}
            fontFamily={fontHauoraMedium}
          >
            You can easily get a consultation if an expert is online.{" "}
          </Text>
        </Div>

        <Div pb={20}>
          <ButtonPrimary
            bgColor="dark"
            mb={10}
            disabled={!expertDetailMap.get(expertId)?.isOnline || isRequesting}
            loading={isRequesting}
            onPress={handleRequestConsultation}
            icon={<VideoIcon />}
            textColor="#222"
            bg="#6CDE79"
          >
            Video
          </ButtonPrimary>

          <ButtonPrimary
            bgColor="primary"
            mb={10}
            disabled={!expertDetailMap.get(expertId)?.isOnline || isRequesting}
            onPress={() => {
              navigation.navigate("ExpertsChatScreen", {
                expertId: expertDetailMap.get(expertId)?.id ?? "",
                expertName: expertDetailMap.get(expertId)?.name ?? "",
              });
            }}
            icon={<ChatIcon />}
            textColor="#222"
            bg="#B8D7DE"
          >
            Text
          </ButtonPrimary>

          <Text
            fontSize={"lg"}
            my={5}
            fontFamily={fontHauoraMedium}
            textAlign="center"
          >
            Or book a session for a later time
          </Text>

          <Div>
            <AvailabilityAndDateSelector
              // allAvailability={allAvailability}
              onSelect={handleDateSelect}
            />

            <Div mt={16}>
              <Text
                fontFamily={fontHauoraSemiBold}
                fontSize="xl"
                lineHeight={24}
                color="#222222"
                mb={16}
              >
                Availability
              </Text>

              {availabilityLoading && (
                <Div flex={1}>
                  <Skeleton.Box mt="sm" w={100} h={25} mb={4} rounded={4} />
                  <Div flexDir="row" flexWrap="wrap" style={{ gap: 8 }}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton.Box
                        mt="sm"
                        h={40}
                        w={80}
                        rounded={4}
                        key={index}
                      />
                    ))}
                  </Div>
                </Div>
              )}

              {!availabilityLoading &&
                availability.length > 0 &&
                availability.map((a) => (
                  <Div
                    key={a.id}
                    pb={12}
                    mb={12}
                    borderBottomWidth={1}
                    borderColor="#E0E0E0"
                  >
                    <Text
                      fontFamily={fontHauoraSemiBold}
                      fontSize="xl"
                      lineHeight={24}
                      color="#222222"
                      mb={12}
                      textTransform="capitalize"
                    >
                      {a.dayOfWeek ?? dayjs(a.date).format("ddd, DD MMM")}
                    </Text>

                    {a.intervals.length > 0 && (
                      <Div
                        flexDir="row"
                        flexWrap="wrap"
                        justifyContent="center"
                        style={{ gap: 8 }}
                      >
                        {a.intervals.map((intr, index) => {
                          const time = formatTime(a, intr);

                          const isDisabled = hasAvailabilityDateTimePassed(
                            selectedDate ?? dayjs().format("YYYY-MM-DD"),
                            intr.from
                          );

                          return (
                            <Button
                              key={`${index}:${a.dayOfWeek ?? a.date}:${time}`}
                              w={170}
                              maxW={"50%"}
                              p={10}
                              borderWidth={1}
                              borderColor="#E0E0E0"
                              rounded={8}
                              bg={
                                selectedTime?.label ===
                                `${index}:${a.dayOfWeek ?? a.date}:${time}`
                                  ? "#222"
                                  : "transparent"
                              }
                              onPress={() => {
                                setSelectedTime({
                                  value: { from: intr.from, to: intr.to },
                                  label: `${index}:${
                                    a.dayOfWeek ?? a.date
                                  }:${time}`,
                                });
                              }}
                              disabled={isDisabled}
                            >
                              <TimeBtnText
                                time={time}
                                color={
                                  selectedTime?.label ===
                                  `${index}:${a.dayOfWeek ?? a.date}:${time}`
                                    ? "#fff"
                                    : "#494949"
                                }
                              />
                              {/* {time} */}
                            </Button>
                          );
                        })}
                      </Div>
                    )}

                    {a.intervals.length === 0 && (
                      <Div flexDir="row" flexWrap="wrap" style={{ gap: 8 }}>
                        <Text>-</Text>
                      </Div>
                    )}
                  </Div>
                ))}

              {!availabilityLoading && availability.length === 0 && (
                <Text>No availability</Text>
              )}
            </Div>
          </Div>
        </Div>
      </ScrollDiv>
      <ButtonPrimary
        onPress={handleScheduleConsultation}
        disabled={isActionLoading || !selectedTime}
        loading={isActionLoading}
      >
        Proceed
      </ButtonPrimary>
    </Layout>
  );
};

export default ExpertsListDetailScreen;

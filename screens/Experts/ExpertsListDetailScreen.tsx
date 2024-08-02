import Layout from "@/components/app/Layout";
import AvailabilityAndDateSelector from "@/components/partials/AvailabilityAndDateSelector";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import DoctorCard from "@/components/partials/DoctorCard";
import {
  colorPrimary,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useExpertStore } from "@/store/modules/expert";
import { NavigationType } from "@/store/types";
import { ExpertAvailability } from "@/store/types/expert";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { Button, Div, ScrollDiv, Skeleton, Text } from "react-native-magnus";

const dayOfWeekMap: { [key: string]: number } = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thur: 4,
  fri: 5,
  sat: 6,
};

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
      const date = availability.dayOfWeek
        ? dayjs().day(dayOfWeekMap[availability.dayOfWeek]).format("YYYY-MM-DD")
        : dayjs(availability.date).format("YYYY-MM-DD");

      const fromTime = dayjs(`${date}T${interval.from}Z`).format("HH:mm A");
      const toTime = dayjs(`${date}T${interval.to}Z`).format("HH:mm A");

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
      setAvailabilityLoading(true);
      setSelectedDate(date);

      console.log("date", date);

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
            fontSize={"xl"}
            fontWeight="bold"
            fontFamily={fontHauoraSemiBold}
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
            You can easily get a consultation if your doctor is online.{" "}
          </Text>
        </Div>

        <Div pb={20}>
          <ButtonPrimary
            bgColor="dark"
            mb={10}
            disabled={!expertDetailMap.get(expertId)?.isOnline || isRequesting}
            loading={isRequesting}
            onPress={handleRequestConsultation}
          >
            Instant Consultation
          </ButtonPrimary>

          <ButtonPrimary
            bgColor="primary"
            mb={10}
            onPress={() => {
              navigation.navigate("ExpertsChatScreen", {
                expertId: expertDetailMap.get(expertId)?.id ?? "",
                expertName: expertDetailMap.get(expertId)?.name ?? "",
              });
            }}
          >
            Chat now
          </ButtonPrimary>

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
                    {Array.from({ length: 4 }).map(() => (
                      <Skeleton.Box mt="sm" h={40} w={80} rounded={4} />
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
                    <Div flexDir="row" flexWrap="wrap" style={{ gap: 8 }}>
                      {a.intervals.map((intr, index) => {
                        const time = formatTime(a, intr);

                        return (
                          <Button
                            key={`${index}:${a.dayOfWeek ?? a.date}:${time}`}
                            fontFamily={fontHauoraMedium}
                            fontSize="lg"
                            lineHeight={20}
                            p={10}
                            borderWidth={1}
                            color={
                              selectedTime?.label ===
                              `${index}:${a.dayOfWeek ?? a.date}:${time}`
                                ? "#fff"
                                : "#494949"
                            }
                            borderColor="#E0E0E0"
                            rounded={8}
                            bg={
                              selectedTime?.label ===
                              `${index}:${a.dayOfWeek ?? a.date}:${time}`
                                ? "primary"
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
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </Div>
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
        // navigation.navigate("PartnerVetConfirmationScreen");
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

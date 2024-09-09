import Layout from "@/components/app/Layout";
import AvailabilityAndDateSelector from "@/components/partials/AvailabilityAndDateSelector";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import DoctorCard from "@/components/partials/DoctorCard";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { usePartnerStore } from "@/store/modules/partner";
import { NavigationType } from "@/store/types";
import { ExpertAvailability } from "@/store/types/expert";
import { PartnerVetDetails } from "@/store/types/partner";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
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

const PartnerVetDetailScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const {
    partnerVetDetails,
    fetchPartnerVetDetails,
    fetchPartnerVetAvailability,
  } = usePartnerStore();

  const caseId = (route.params as Record<string, string>)?.caseId;
  const partnerId = (route.params as Record<string, string>)?.partnerId;
  const vetId = (route.params as Record<string, string>)?.vetId;
  const backTo = (route.params as Record<string, string>)?.backTo;
  const selectedServices = (
    route.params as {
      selectedServices: { id: string; label: string; price: number }[];
    }
  )?.selectedServices;

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

  console.log("availability", availability);

  const partnerDetails = useMemo(() => {
    return partnerVetDetails.get(vetId);
  }, [partnerVetDetails, vetId]);

  useEffect(() => {
    handleFetchExpertDetails();
  }, [partnerId, vetId]);

  const handleFetchExpertDetails = async (isRefresh?: boolean) => {
    try {
      setIsLoading(true);

      if (!partnerDetails) {
        const details = await fetchPartnerVetDetails(vetId, partnerId);
      }

      handleDateSelect(dayjs().format("YYYY-MM-DD"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = async (date: string) => {
    try {
      setAvailabilityLoading(true);
      setSelectedDate(date);

      const _availability = await fetchPartnerVetAvailability(
        vetId,
        partnerId,
        new Date(date)
      );

      setAvailability(_availability);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const formatTime = useCallback(
    (
      availability: ExpertAvailability,
      interval: { from: string; to: string }
    ) => {
      const date = availability.dayOfWeek
        ? dayjs().day(dayOfWeekMap[availability.dayOfWeek]).format("YYYY-MM-DD")
        : "";

      const fromTime = dayjs(`${date}T${interval.from}Z`).format("hh:mm A");
      const toTime = dayjs(`${date}T${interval.to}Z`).format("hh:mm A");

      return `${fromTime} - ${toTime}`;
    },
    []
  );

  const handleProceed = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const _date = dayjs(selectedDate).format("YYYY-MM-DD");

    const scheduleAt = dayjs(
      _date.toString() +
        "T" +
        dayjs(`${_date}T${selectedTime.value.from}Z`).format("HH:mm")
    )
      .utc()
      .format();

    navigation.navigate("PartnerVetConfirmationScreen", {
      from: "PartnerVetDetailScreen",
      vetId,
      partnerId,
      selectedTime: JSON.stringify(selectedTime?.value),
      selectedDate,
      caseId,
      scheduleAt,
      selectedServices,
    });
  };

  console.log("a", availability);

  return (
    <Layout
      showBack
      title={partnerDetails?.name}
      onBackPress={() => {
        if (backTo) {
          navigation.navigate(backTo);
        } else {
          navigation.goBack();
        }
      }}
      loading={isLoading}
    >
      <ScrollDiv flex={1} showsVerticalScrollIndicator={false}>
        <Div mb={24}>
          <DoctorCard
            name={partnerDetails?.name ?? ""}
            speciality={partnerDetails?.designation ?? ""}
            experience={partnerDetails?.yearsOfExperience ?? 0}
            image={partnerDetails?.profileImg?.url ?? ""}
            verified={true}
          />
        </Div>

        <Div maxW={350} mb={20}>
          <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={4}>
            Address - {partnerDetails?.partnerName}
          </Text>
          <Text
            color="darkGreyText"
            mb={6}
            fontSize={"lg"}
            fontFamily={fontHauoraMedium}
          >
            {partnerDetails?.partnerAddress}
          </Text>
        </Div>

        <Div pb={20} borderTopWidth={1} borderColor="#D0D7DC">
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
                    key={a.dayOfWeek || a.date}
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

                          return (
                            <Button
                              key={`${index}:${a.dayOfWeek ?? a.date}:${time}`}
                              fontFamily={fontHauoraMedium}
                              fontSize={15}
                              lineHeight={20}
                              p={10}
                              w={170}
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
                            >
                              {time}
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
        disabled={isActionLoading || !selectedTime}
        loading={isActionLoading}
        onPress={handleProceed}
      >
        Proceed
      </ButtonPrimary>
    </Layout>
  );
};

export default PartnerVetDetailScreen;

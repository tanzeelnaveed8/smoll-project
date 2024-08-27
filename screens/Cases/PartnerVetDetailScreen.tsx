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
  thur: 4,
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

  const partnerDetails = useMemo(() => {
    return partnerVetDetails.get(vetId);
  }, [partnerVetDetails, vetId]);

  // const partnerDetails: PartnerVetDetails = {
  //   name: "Gustaf",
  //   designation: "Stenners",
  //   id: "1234",
  //   partnerName: "partner name",
  //   yearsOfExperience: 4,
  //   availabilities: [
  //     {
  //       id: "string",
  //       dayOfWeek: `${Date.now()}`,
  //       date: `${Date.now()}`,
  //       intervals: [{ from: "2:30", to: "5:30" }],
  //     },
  //   ],
  //   partnerAddress: "partner address",
  //   profileImg: {
  //     filename: "filename",
  //     filesize: 20,
  //     mimetype: "image/png",
  //     url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHXSURBVDjLzZNNi9pQFIbzA+YXDP0zLV3Nb3E9a3d1JQh+g7oQLaKCimL8QGKiMdF0OjUTjB+N0fi9Ghim7aa8vScwglBKabvohZfccM95zntObjgA3N+I+2cARVGuJEnydNjief5LpVLpFAoFTyaTufotgCiKtw8POizrMzaOjfnMhCz3kUgkbn8JkGX5utvtelut1telNYf+ScPHDzL0+yEW8wnC4fCT3+/3+Hy+nzrhBEHwTiYTvCRrQwma2sVIFXCnDaAqA7TbbdRqtcdSqZTIZrOvLwCNRsNY2RbGrKI2FN1kddCB3OtAFAU4joPT6YTj8cjas5DP58epVOrtGcCGZVD1+zuFJYusYh/9noQe03a7xW63w3q9drXf77FYLPCerTOA7b00LMMYYzRS3YDD4eCKksmBbdtYLpfuk5zkcrnvyWSyFAwG33DMzjUblJcNymDtfKMAqkbBlEwu6J0AJNoT3DRNRKPR6sVE2RUwCUCJq9XKDd5sNmfAixOaBbUTj8efLwD1ev3dbDZzDymR9tQSuSAgfa3pdOqe6boO1gJ/AWA371W1Wg00m801gznlcpkvFoutdDp9CoVCx1gsJjFpkUjkORAI8KztG+7/+Zn+VD8AV2IaSQGFiWoAAAAASUVORK5CYII=",
  //   },
  // };

  useEffect(() => {
    handleFetchExpertDetails();
  }, [partnerId, vetId]);

  // const availabilities = useMemo<ExpertAvailability[]>(() => {
  //   if (!availability) return [];

  //   return availability.map((a) => ({
  //     ...a,
  //     intervals: a.intervals.flatMap((interval) => {
  //       const start = dayjs(`2000-01-01T${interval.from}`);
  //       const end = dayjs(`2000-01-01T${interval.to}`);
  //       const slots = [];

  //       let current = start;
  //       while (current.isBefore(end)) {
  //         const slotEnd = current.add(30, "minute");
  //         if (slotEnd.isAfter(end)) break;

  //         slots.push({
  //           from: current.format("HH:mm"),
  //           to: slotEnd.format("HH:mm"),
  //         });

  //         current = slotEnd;
  //       }

  //       return slots;
  //     }),
  //   }));
  // }, [partnerDetails, availability]);

  const handleFetchExpertDetails = async (isRefresh?: boolean) => {
    try {
      setIsLoading(true);

      if (!partnerDetails) {
        const details = await fetchPartnerVetDetails(vetId, partnerId);
        setAvailability(details.availabilities);
      }
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
        : dayjs(availability.date).format("YYYY-MM-DD");

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

    // const scheduledAt = selectedDate
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
    });
  };

  return (
    <Layout
      showBack
      title={partnerDetails?.name}
      onBackPress={() => {
        navigation.goBack();
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
                  <>
                    {a.intervals.length ? (
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

                        <Div
                          flexDir="row"
                          flexWrap="wrap"
                          justifyContent="center"
                          alignItems="center"
                          style={{ gap: 8 }}
                        >
                          {a.intervals.map((intr, index) => {
                            const time = formatTime(a, intr);

                            return (
                              <Div w="48%">
                                <Button
                                  key={`${index}:${
                                    a.dayOfWeek ?? a.date
                                  }:${time}`}
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
                                  w="100%"
                                >
                                  <Text
                                    color={
                                      selectedTime?.label ===
                                      `${index}:${
                                        a.dayOfWeek ?? a.date
                                      }:${time}`
                                        ? "#fff"
                                        : "#494949"
                                    }
                                  >
                                    {time}
                                  </Text>
                                </Button>
                              </Div>
                            );
                          })}
                        </Div>
                      </Div>
                    ) : null}
                  </>
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

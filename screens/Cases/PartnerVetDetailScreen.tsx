import Layout from "@/components/app/Layout";
import AvailabilityAndDateSelector from "@/components/partials/AvailabilityAndDateSelector";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import DoctorCard from "@/components/partials/DoctorCard";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { usePartnerStore } from "@/store/modules/partner";
import { NavigationType } from "@/store/types";
import { ExpertAvailability } from "@/store/types/expert";
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
  const { partnerVetDetails, fetchPartnerVetDetails } = usePartnerStore();

  const partnerId = (route.params as Record<string, string>)?.partnerId;
  const vetId = (route.params as Record<string, string>)?.vetId;

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

  useEffect(() => {
    handleFetchVetDetails();
  }, [partnerId, vetId]);

  const handleFetchVetDetails = async () => {
    try {
      setIsLoading(true);

      if (!partnerDetails) {
        await fetchPartnerVetDetails(vetId, partnerId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const availabilities = useMemo(() => {
    return partnerDetails?.availabilities ?? [];
  }, [partnerDetails]);

  const handleFetchExpertDetails = async (isRefresh?: boolean) => {
    try {
      setIsLoading(true);

      if (!partnerDetails) {
        await fetchPartnerVetDetails(vetId, partnerId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = () => {};

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
            experience={partnerDetails?.yearOfExperience ?? 0}
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
                availabilities.length > 0 &&
                availabilities.map((a) => (
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
                    )}

                    {a.intervals.length === 0 && (
                      <Div flexDir="row" flexWrap="wrap" style={{ gap: 8 }}>
                        <Text>-</Text>
                      </Div>
                    )}
                  </Div>
                ))}

              {!availabilityLoading && availabilities.length === 0 && (
                <Text>No availability</Text>
              )}
            </Div>
          </Div>
        </Div>
      </ScrollDiv>
      <ButtonPrimary
        disabled={isActionLoading || !selectedTime}
        loading={isActionLoading}
        onPress={() => {
          navigation.navigate("PartnerVetConfirmationScreen");
        }}
      >
        Proceed
      </ButtonPrimary>
    </Layout>
  );
};

export default PartnerVetDetailScreen;

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
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { Button, Div, ScrollDiv, Skeleton, Text } from "react-native-magnus";

const ExpertsListDetailScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const expertId = (route.params as Record<string, string>)?.id;

  const {
    expertDetailMap,
    fetchExpertDetail,
    fetchExpertAvailability,
    requestConsultation,
  } = useExpertStore();

  const [availability, setAvailability] = useState<ExpertAvailability[]>([]);
  const [selectedTime, setSelectedTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    handleFetchExpertDetails();
  }, []);

  const expertDetail = expertDetailMap.get(expertId);

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

  return (
    <Layout
      showBack
      backBtnText=""
      title={expertDetail?.name ?? ""}
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
            name={expertDetail?.name ?? ""}
            speciality={expertDetail?.designation ?? ""}
            experience={expertDetail?.yearsOfExperience ?? 0}
            isOnline={expertDetail?.isOnline ?? false}
            image={expertDetail?.profileImg?.url ?? ""}
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
            disabled={!expertDetail?.isOnline || isRequesting}
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
                expertId: expertDetail?.id ?? "",
                expertName: expertDetail?.name ?? "",
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
                      {a.intervals.map((intr, index) => (
                        <Button
                          key={`${a.id}-${intr.from}-${intr.to}-${index}`}
                          fontFamily={fontHauoraMedium}
                          fontSize="lg"
                          lineHeight={20}
                          p={10}
                          borderWidth={1}
                          color={
                            selectedTime ===
                            `${a.id}-${intr.from}-${intr.to}-${index}`
                              ? "#fff"
                              : "#494949"
                          }
                          borderColor="#E0E0E0"
                          rounded={4}
                          bg={
                            selectedTime ===
                            `${a.id}-${intr.from}-${intr.to}-${index}`
                              ? "primary"
                              : "transparent"
                          }
                          onPress={() => {
                            setSelectedTime(
                              `${a.id}-${intr.from}-${intr.to}-${index}`
                            );
                          }}
                        >
                          <Text>
                            {intr.from} - {intr.to}
                          </Text>
                        </Button>
                      ))}
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
        onPress={() => {
          navigation.navigate("PartnerVetConfirmationScreen");
        }}
      >
        Proceed
      </ButtonPrimary>
    </Layout>
  );
};

export default ExpertsListDetailScreen;

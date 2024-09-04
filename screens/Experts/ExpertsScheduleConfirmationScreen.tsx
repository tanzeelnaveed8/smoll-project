import React, { useEffect, useMemo, useState } from "react";
import { Button, Div, ScrollDiv, Text } from "react-native-magnus";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { IconCalendarMonth } from "@tabler/icons-react-native";
import Accordion from "@/components/partials/Accordion";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import Layout from "@/components/app/Layout";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import { useExpertStore } from "@/store/modules/expert";
import { usePetStore } from "@/store/modules/pet";
import { ExpertAvailability } from "@/store/types/expert";
import dayjs from "dayjs";
import { CreateCasePayloadDto } from "@/store/types/case";
import { useCaseStore } from "@/store/modules/case";
import { AxiosError } from "axios";

const ExpertsScheduleConfirmationScreen: React.FC<{
  navigation: NavigationType;
}> = ({ navigation }) => {
  const route = useRoute();

  const { selectedTime, selectedDate, caseData, petId, expertId, scheduleAt } =
    route.params as Record<string, string>;

  console.log("parsedSelectedTime selectedTime", selectedTime);

  const { expertDetailMap, scheduleConsultation } = useExpertStore();
  const { petsDetailMap, fetchPetDetails } = usePetStore();
  const { createCase, removeCase } = useCaseStore();

  const expert = expertDetailMap.get(expertId);
  const pet = petsDetailMap.get(petId);

  const parsedSelectedTime = JSON.parse(
    selectedTime
  ) as ExpertAvailability["intervals"][number];
  const parsedSelectedDate = new Date(selectedDate);
  const parsedCase = JSON.parse(caseData) as CreateCasePayloadDto;

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!pet) {
      fetchPet();
    }
  }, [pet]);

  const scheduledTime = useMemo(() => {
    const date = dayjs(parsedSelectedDate).format("YYYY-MM-DD");

    const fromTime = dayjs(`${date}T${parsedSelectedTime.from}Z`).format(
      "hh:mm A"
    );

    const toTime = dayjs(`${date}T${parsedSelectedTime.to}Z`).format("hh:mm A");

    return `${fromTime} - ${toTime}`;
  }, [parsedSelectedDate, parsedSelectedTime]);

  const fetchPet = async () => {
    try {
      setIsLoading(true);
      await fetchPetDetails(petId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleConsultation = async () => {
    let caseId;

    try {
      setActionLoading(true);

      const { id } = await createCase(parsedCase);
      caseId = id;

      const { id: consultationId } = await scheduleConsultation(expertId, {
        caseId,
        scheduleAt: scheduleAt,
        petId,
      });

      navigation.navigate("ExpertsScheduleSuccessScreen", {
        consultationId: consultationId,
      });
    } catch (err) {
      const error = err as AxiosError<any, any>;

      if (
        error?.response?.data?.message?.includes("already scheduled") &&
        caseId
      ) {
        await removeCase(caseId);
      }

      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout
      showBack
      title="Confirm Appointment"
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={isLoading}
    >
      <ScrollDiv flex={1} showsVerticalScrollIndicator={false}>
        <Text fontFamily={fontHauoraBold} fontSize="xl" lineHeight={24} mb={24}>
          Basic Details
        </Text>

        <ReadonlyItem field="Expert" value={expert?.name ?? ""} mb={16} />

        <ReadonlyItem field="Pet" value={pet?.name ?? ""} mb={12} />
        <ReadonlyItem
          field="Case Brief"
          value={parsedCase.description ?? ""}
          mb={12}
        />

        <Div flexDir="row" justifyContent="space-between" mb={24}>
          <Div flexDir="row" alignItems="center">
            <IconCalendarMonth size={32} color="#222222" strokeWidth={1.5} />
            <Text
              ml={16}
              fontFamily={fontHauoraSemiBold}
              fontSize="lg"
              lineHeight={24}
              color="#222222"
            >
              {scheduledTime} {"\n"}
              {dayjs(parsedSelectedDate).format("ddd, D MMM YYYY")}
            </Text>
          </Div>

          <Button
            bg="transparent"
            fontFamily={fontHauoraSemiBold}
            fontSize="lg"
            lineHeight={24}
            color="#0189F9"
            onPress={() => {
              navigation.navigate("ExpertsListDetailScreen", {
                expertId,
                caseData: caseData,
              });
            }}
          >
            Change
          </Button>
        </Div>

        <Div mt={24}>
          <Text
            fontFamily={fontHauoraSemiBold}
            fontSize="lg"
            lineHeight={24}
            color="#222222"
          >
            (FAQ) Frequently Asked Questions
          </Text>

          <Accordion pt={12}>
            <Accordion.title>
              <Text
                fontFamily={fontHauoraMedium}
                fontSize="lg"
                lineHeight={20}
                color="#494949"
              >
                Do I need to bring my pet in a carrier?
              </Text>
            </Accordion.title>
            <Accordion.content>
              <Text>This is a dummy content</Text>
            </Accordion.content>
          </Accordion>
          <Accordion>
            <Accordion.title>
              <Text
                fontFamily={fontHauoraMedium}
                fontSize="lg"
                lineHeight={20}
                color="#494949"
              >
                How often should my pet have a check-up?
              </Text>
            </Accordion.title>
            <Accordion.content>
              <Text>This is a dummy content 2</Text>
            </Accordion.content>
          </Accordion>
          <Accordion>
            <Accordion.title>
              <Text
                fontFamily={fontHauoraMedium}
                fontSize="lg"
                lineHeight={20}
                color="#494949"
              >
                Are there any preparations needed before the appointment?
              </Text>
            </Accordion.title>
            <Accordion.content>
              <Text>This is a dummy content 3</Text>
            </Accordion.content>
          </Accordion>
        </Div>
      </ScrollDiv>

      <ButtonPrimary
        loading={actionLoading}
        disabled={actionLoading}
        onPress={handleScheduleConsultation}
      >
        Schedule
      </ButtonPrimary>
    </Layout>
  );
};

const ReadonlyItem = ({
  field,
  value,
  mb,
}: {
  field: string;
  value: string;
  mb?: number;
}) => {
  return (
    <Div pb={16} borderBottomWidth={1} borderColor="#E0E0E0" mb={mb ? mb : 0}>
      <Text
        fontFamily={fontHauoraSemiBold}
        fontSize={"xl"}
        // lineHeight={16}
        color="darkGreyText"
      >
        {field}
      </Text>
      <Text fontFamily={fontHauoraSemiBold} fontSize="xl" lineHeight={24}>
        {value}
      </Text>
    </Div>
  );
};

export default ExpertsScheduleConfirmationScreen;

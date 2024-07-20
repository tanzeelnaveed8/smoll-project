import React from "react";
import { Button, Div, ScrollDiv, Text } from "react-native-magnus";
import Header from "@/components/partials/Header";
import Container from "@/components/partials/Container";
import DoctorCard from "@/components/partials/DoctorCard";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import {
  IconCalendarMonth,
  IconReceiptRefund,
} from "@tabler/icons-react-native";
import Accordion from "@/components/partials/Accordion";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import Layout from "@/components/app/Layout";
import { NavigationType } from "@/store/types";

const PartnerVetConfirmationScreen: React.FC<{
  navigation: NavigationType;
}> = ({ navigation }) => {
  return (
    <Layout
      showBack
      title="Confirm Appointment"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <ScrollDiv flex={1} showsVerticalScrollIndicator={false}>
        <ReadonlyItem field="Veterinarian" value="Dr. Emily Carter" mb={16} />
        <ReadonlyItem field="Clinic" value="Harmony Vet Clinic" mb={12} />

        <Text
          fontFamily={fontHauoraSemiBold}
          fontSize="xl"
          lineHeight={24}
          color="darkGreyText"
          mb={8}
        >
          Date and time
        </Text>

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
              10:00am-10:15am {"\n"}
              Fri, 9 Feb 2024
            </Text>
          </Div>

          <Button
            bg="transparent"
            fontFamily={fontHauoraSemiBold}
            fontSize="lg"
            lineHeight={24}
            color="#0189F9"
          >
            Change
          </Button>
        </Div>

        <Div px={16} py={24} rounded={12} borderWidth={1} borderColor="#D0D7DC">
          <Div
            pb={16}
            borderBottomWidth={1}
            borderBottomColor="#D0D7DC"
            mb={16}
          >
            <RowText
              name="Billing Summary"
              fontFamily={fontHauoraSemiBold}
              mb={24}
            />

            <RowText
              name="Consultation charges"
              value="94 AED"
              fontFamily={fontHauoraMedium}
              mb={16}
            />
            <RowText
              name="Advance booking"
              value="10 AED"
              percent="11%"
              fontFamily={fontHauoraMedium}
            />
          </Div>

          <RowText
            name="Remaining Amt"
            value="84 AED"
            fontFamily={fontHauoraBold}
            mb={2}
          />
          <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
            To be paid in clinic
          </Text>
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

        <Div mt={32} pb={20}>
          <ButtonPrimary
            onPress={() => {
              navigation.navigate("PartnerVetSuccessfullScreen");
            }}
          >
            Pay 10 AED
          </ButtonPrimary>
        </Div>
      </ScrollDiv>
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

export default PartnerVetConfirmationScreen;

const RowText: React.FC<{
  name: string;
  percent?: string;
  value?: string;
  fontFamily: string;
  mb?: number;
}> = ({ name, percent, value, fontFamily, mb }) => {
  return (
    <Div
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      mb={mb ? mb : 0}
    >
      <Div flexDir="row" alignItems="center">
        <Text fontSize={"xl"} fontFamily={fontFamily}>
          {name}
        </Text>

        {percent && (
          <Text
            ml={8}
            color="primary"
            fontSize={"md"}
            fontFamily={fontHauoraMedium}
          >
            {percent}
          </Text>
        )}
      </Div>

      {value && (
        <Text fontSize={"xl"} fontFamily={fontFamily}>
          {value}
        </Text>
      )}
    </Div>
  );
};

import Layout from "@/components/app/Layout";
import HomeScreenBanner from "@/components/app/HomeScreenBanner";
import { NavigationType } from "@/store/types";
import React, { useState } from "react";
import { Button, Div, Image, Text } from "react-native-magnus";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
  fontHeading,
} from "@/constant/constant";
import { FlatList } from "react-native";
import { View } from "react-native";
import IconCircleCheckFilled from "@/components/icons/IconCircleCheckFilled";
import {
  IconScissors,
  IconPaw,
  IconBook,
  IconStethoscope,
  IconPhone,
  IconBug,
  IconDental,
  IconEar,
  IconClipboardCheck,
  IconFlask,
  IconFlask2,
  IconCpu,
  IconArrowRight,
} from "@tabler/icons-react-native";
import PlanCTA from "./PlanCTA";
import SubscriptionBenefitsList from "@/components/app/subscription/SubscriptionBenefitsList";

const planFeatures = [
  { label: "Grooming", sessions: 4, icon: <IconScissors size={24} color="#474747" /> },
  { label: "Nail Trim", sessions: 2, icon: <IconPaw size={24} color="#474747" /> },
  { label: "Expert tips", sessions: 1, icon: <IconBook size={24} color="#474747" /> },
  { label: "Consultations", sessions: 4, icon: <IconStethoscope size={24} color="#474747" /> },
  { label: "Vet Calls", sessions: 4, icon: <IconPhone size={24} color="#474747" /> },
  { label: "Deworming", sessions: 2, icon: <IconFlask size={24} color="#474747" /> },
  { label: "Dental check up", sessions: 3, icon: <IconDental size={24} color="#474747" /> },
  { label: "Ear cleaning", sessions: 3, icon: <IconEar size={24} color="#474747" /> },
  {
    label: "Free wellness checkup",
    sessions: 1,
    icon: <IconClipboardCheck size={24} color="#474747" />,
  },
  { label: "Blood test", sessions: 2, icon: <IconFlask size={24} color="#474747" /> },
  { label: "Urine test", sessions: 1, icon: <IconFlask2 size={24} color="#474747" /> },
  { label: "Microchipping", sessions: 1, icon: <IconCpu size={24} color="#474747" /> },
];

export default function SubscriptionScreen({ navigation }: { navigation: NavigationType }) {
  return (
    <Layout
      showBack
      title="Smoll Care"
      onBackPress={() => {
        navigation.goBack();
      }}
      style={{ position: "relative", justifyContent: "flex-start" }}
    >
      <Div>
        <Div mt={12}>
          <Text fontSize="2xl" color="#679FF0" fontFamily={fontHeading}>
            Welcome To
          </Text>
          <Image w={157} h={28} mt={10} source={require("@/assets/icons/smollcare-logo.png")} />
        </Div>
        <Div alignItems="center" mt={32}>
          <Image w={254} h={400} source={require("@/assets/images/smollcare-screen.png")} />
        </Div>
        <Div mt={24}>
          <Div alignItems="center">
            <Div alignItems="center">
              <Text fontSize="xl" fontFamily={fontHauoraSemiBold} textAlign="center">
                Your Smoll number is
              </Text>
              <Div bg="#d6fcff" style={{ borderRadius: 1000 }} px={30} mt={10}>
                <Text
                  fontSize="8xl"
                  fontFamily={fontHauoraBold}
                  color="#1655C8"
                  textAlignVertical="center"
                  lineHeight={68}
                >
                  179-234
                </Text>
              </Div>
            </Div>
            <Text
              mt={32}
              fontSize="sm"
              maxW={202}
              textAlign="center"
              fontFamily={fontHauoraSemiBold}
              lineHeight={16}
            >
              Present this number at any of our partner locations and enjoy your smoll® Care
              benefits
            </Text>
          </Div>
          <Button
            fontSize={"lg"}
            fontFamily={fontHauoraSemiBold}
            color="primary"
            flexDir="row"
            alignItems="center"
            mx={"auto"}
            style={{ gap: 4 }}
            p={0}
            bg="transparent"
            onPress={() => {
              navigation.navigate("PetProfileListScreen");
            }}
            mt={32}
            mb={24}
          >
            <Text color="primary" fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
              My Pets
            </Text>
            <IconArrowRight
              width={24}
              height={24}
              color={"#427594"}
              strokeWidth={2}
              style={{ marginTop: 4 }}
            />
          </Button>
        </Div>
      </Div>
    </Layout>
  );
}

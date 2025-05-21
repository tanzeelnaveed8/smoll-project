import Layout from "@/components/app/Layout";
import HomeScreenBanner from "@/components/app/HomeScreenBanner";
import { NavigationType } from "@/store/types";
import React, { useState } from "react";
import { Div, Text } from "react-native-magnus";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
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
} from "@tabler/icons-react-native";
import PlanCTA from "./PlanCTA";

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

const renderSessionDots = (count) => {
  const dots = [];
  for (let i = 0; i < count; i++) {
    dots.push(<IconCircleCheckFilled key={i} />);
  }
  return dots;
};

const PlanRow = ({ label, sessions, icon, styles }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      ...styles,
    }}
  >
    <Div style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
      {icon}
      <Text fontSize="xl" fontFamily={fontHauoraMedium} color="#000">
        {label}
      </Text>
    </Div>

    <View
      style={{
        maxWidth: 126,
        width: "100%",
        flexDirection: "row",
        gap: 10,
      }}
    >
      {renderSessionDots(sessions)}
    </View>
  </View>
);

export default function SubscriptionScreen({ navigation }: { navigation: NavigationType }) {
  return (
    <Layout
      showBack
      title="Subscription Plan"
      onBackPress={() => {
        navigation.goBack();
      }}
      style={{ position: "relative" }}
    >
      <Div pb={32} borderBottomWidth={1} borderColor="#DFDFDF">
        <HomeScreenBanner isCarePlanUser={false} navigation={navigation} showButton={false} />
        <Text color="#121212" fontSize={"lg"} mt={8} fontFamily={fontHauoraSemiBold}>
          *Subscribe once. Covered all year around
        </Text>
      </Div>
      <Div
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderColor: "red",
          alignItems: "center",
        }}
        mt={32}
      >
        <Text
          textAlignVertical="center"
          color="primary"
          fontSize={"lg"}
          fontFamily={fontHauoraMedium}
        >
          Plan Inclusions
        </Text>
        <Text
          textAlignVertical="center"
          color="primary"
          fontSize={"lg"}
          fontFamily={fontHauoraMedium}
          maxW={126}
          w={"100%"}
        >
          Sessions
        </Text>
      </Div>
      <FlatList
        data={planFeatures}
        keyExtractor={(item) => item.label}
        style={{ paddingRight: 10 }}
        renderItem={({ item, index }) => (
          <PlanRow
            label={item.label}
            sessions={item.sessions}
            icon={item.icon}
            styles={{ marginBottom: index === planFeatures.length - 1 && 20 }}
          />
        )}
        contentContainerStyle={{
          paddingTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      />
      <PlanCTA />
    </Layout>
  );
}

import IconCircleCheckFilled from "@/components/icons/IconCircleCheckFilled";
import { fontHauoraBold, fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import PlanCTA from "@/screens/Subscription/PlanCTA";
import { IconChevronRight, IconCircleCheck } from "@tabler/icons-react-native";
import React from "react";
import { FlatList, View } from "react-native";
import { Div, Text } from "react-native-magnus";

const renderSessionDots = (count: number, usageCount?: number) => {
  const dots = [];

  for (let i = 0; i < count; i++) {
    let icon = <IconCircleCheckFilled key={i} color="#00D932" />;
    if (usageCount !== undefined && i >= usageCount) {
      icon = <IconCircleCheck key={i} color="gray" />;
    }
    dots.push(icon);
  }

  return dots;
};

import { Pressable } from "react-native";
import { useState } from "react";
import { Benefit } from "@/store/types/pet";

const PlanRow = ({
  name,
  totalUsageCount,
  consumedUsageCount,
  styles,
  expandable = false,
}: {
  name: string;
  totalUsageCount: number;
  consumedUsageCount?: number;
  styles: any;
  expandable?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable onPress={() => expandable && setExpanded((prev) => !prev)}>
      <Div flexDir="row" justifyContent="space-between" alignItems="center" style={{ ...styles }}>
        <Div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          {expandable ? (
            <Div style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }}>
              <IconChevronRight size={16} color="#000" />
            </Div>
          ) : (
            <Text>•</Text>
          )}
          <Text fontSize="lg" fontFamily={fontHauoraBold} color="#000">
            {name}
          </Text>
        </Div>

        <View
          style={{
            maxWidth: 126,
            width: "100%",
            flexDirection: "row",
            gap: 6,
          }}
        >
          {renderSessionDots(totalUsageCount, consumedUsageCount)}
        </View>
      </Div>
      {expanded && (
        <Div ml={24} mr={12} my={12}>
          <Text color="#444444" fontSize="md" fontFamily={fontHauoraSemiBold}>
            Service Provided by
          </Text>
          <Div mt={4} style={{ display: "flex", gap: 12 }}>
            {[0, 0].map((item, i) => (
              <Div key={i}>
                <Div flexDir="row" justifyContent="space-between">
                  <Text fontSize="lg" fontFamily={fontHauoraSemiBold} color="#000">
                    Euro Pet Clinic
                  </Text>
                  <Text fontSize="md" fontFamily={fontHauoraSemiBold} color="#000">
                    12.12.2022
                  </Text>
                </Div>
                <Text mt={4} fontFamily={fontHauoraSemiBold}>
                  The pet require medical attention as soon as possible and must be checked in one
                  month.
                </Text>
              </Div>
            ))}
          </Div>
        </Div>
      )}
    </Pressable>
  );
};

interface SubscriptionBenefitsListProps {
  planFeatures: Benefit[];
  isExpandable?: boolean;
}

export default function SubscriptionBenefitsList({
  planFeatures,
  isExpandable = false,
}: SubscriptionBenefitsListProps) {
  return (
    <>
      <Div px={12}>
        {!isExpandable && (
          <Text color="#121212" fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
            With smoll® Care Plan Steve will recieve all the following:
          </Text>
        )}
        <Div
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderColor: "red",
            alignItems: "center",
          }}
          mt={20}
        >
          <Text
            textAlignVertical="center"
            color={isExpandable ? "primary" : "#121212"}
            fontSize={"xl"}
            fontFamily={fontHauoraSemiBold}
          >
            Plan Inclusions
          </Text>
          <Text
            textAlignVertical="center"
            color={isExpandable ? "primary" : "#121212"}
            fontSize={"xl"}
            fontFamily={fontHauoraSemiBold}
            maxW={126}
            w={"100%"}
          >
            Sessions
          </Text>
        </Div>
      </Div>

      <FlatList
        data={planFeatures}
        keyExtractor={(item) => item.name}
        style={{ paddingRight: 10 }}
        renderItem={({ item, index }) => (
          <PlanRow
            name={item.name}
            totalUsageCount={item.totalUsageCount}
            consumedUsageCount={item?.consumedUsageCount}
            expandable={isExpandable}
            styles={{
              marginBottom: index === planFeatures.length - 1 && 20,
            }}
          />
        )}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 12,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      />
    </>
  );
}

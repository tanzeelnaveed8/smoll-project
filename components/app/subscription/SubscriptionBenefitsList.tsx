import IconCircleCheckFilled from "@/components/icons/IconCircleCheckFilled";
import { fontHauoraBold, fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import PlanCTA from "@/screens/Subscription/PlanCTA";
import { IconChevronRight, IconCircleCheck } from "@tabler/icons-react-native";
import React from "react";
import { FlatList, View } from "react-native";
import { Div, Text } from "react-native-magnus";

const renderSessionDots = (count: number, usageCount?: number) => {
  const dots = [];

  for (let i = 0; i < Math.min(count, 4); i++) {
    let icon;
    if (i < usageCount) {
      icon = <IconCircleCheckFilled key={i} color="#00D932" />;
    } else {
      icon = <IconCircleCheck key={i} color="gray" />;
    }
    dots.push(icon);
  }

  return dots;
};

import { Pressable } from "react-native";
import { useState } from "react";
import { Benefit } from "@/store/types/pet";
import dayjs from "dayjs";

const PlanRow = ({
  benefit,
  styles,
  expandable = false,
}: {
  benefit: Benefit;
  styles: any;
  expandable?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable onPress={() => expandable && setExpanded((prev) => !prev)} style={{ ...styles }}>
      <Div flexDir="row" justifyContent="space-between" alignItems="center">
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
            {benefit.name}
          </Text>
        </Div>

        <View
          style={{
            maxWidth: 118,
            width: "100%",
            flexDirection: "row",
            gap: 4,
          }}
        >
          {renderSessionDots(benefit.totalUsageCount, benefit.consumedUsageCount)}
        </View>
      </Div>
      {expanded && (
        <Div ml={24} mr={12} my={12}>
          {Boolean(benefit.history.length) && (
            <>
              <Text color="#444444" fontSize="md" fontFamily={fontHauoraSemiBold}>
                Service Provided by
              </Text>
              <Div mt={4} style={{ display: "flex", gap: 12 }}>
                {benefit.history.map((item) => (
                  <Div key={item.partnerId}>
                    <Div flexDir="row" justifyContent="space-between">
                      <Text fontSize="lg" fontFamily={fontHauoraSemiBold} color="#000">
                        {item.clinicName}
                      </Text>
                      <Text fontSize="md" fontFamily={fontHauoraSemiBold} color="#000">
                        {dayjs(item.createdAt).format("DD-MM-YYYY")}
                      </Text>
                    </Div>
                    {item.note && (
                      <Text mt={4} fontFamily={fontHauoraSemiBold}>
                        {item.note}
                      </Text>
                    )}
                  </Div>
                ))}
              </Div>
            </>
          )}
          {!Boolean(benefit.history.length) && (
            <Text ml={3} fontFamily={fontHauoraMedium} color="#494949">
              Not yet availed.
            </Text>
          )}
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
            benefit={item}
            expandable={isExpandable}
            styles={{
              marginBottom: index === planFeatures.length - 1 && 20,
              borderBottomWidth: index !== planFeatures.length - 1 ? 1 : 0,
              borderColor: "#c7c5c3",
              paddingBottom: index !== planFeatures.length - 1 && 16,
            }}
          />
        )}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 12,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      />
    </>
  );
}

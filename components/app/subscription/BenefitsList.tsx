import { fontHauoraBold, fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { Benefit } from "@/store/types/pet";
import { IconChevronRight, IconMinus, IconPlus } from "@tabler/icons-react-native";
import React, { useState } from "react";
import { FlatList, Platform, Pressable, View } from "react-native";
import { Div, Text } from "react-native-magnus";

interface BenefitsListProps {
  planFeatures: Benefit[];
}

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
    <Pressable onPress={() => setExpanded((prev) => !prev)} style={{ ...styles }}>
      <Div flexDir="row" justifyContent="space-between" alignItems="center">
        <Div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          flex={1}
        >
          <Text fontSize="xl" fontFamily={fontHauoraBold} color="#000">
            {benefit.name}
          </Text>
          {expanded ? (
            <IconMinus size={18} color="#494949" />
          ) : (
            <IconPlus size={18} color="#494949" />
          )}
        </Div>
      </Div>
      {expanded && (
        <Div ml={4} mr={12} my={4} style={{ gap: 4 }}>
          {["test", "test", "test"].map((item, i) => (
            <Div key={i} flexDir="row" alignItems="center">
              <Text fontSize={"lg"} textAlignVertical="center" mr={4}>
                •
              </Text>
              <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
                Test
              </Text>
            </Div>
          ))}
        </Div>
      )}
    </Pressable>
  );
};

export default function BenefitsList({ planFeatures }: BenefitsListProps) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 32,
        marginHorizontal: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: Platform.OS === "android" ? 5 : 0,
        marginBottom: 10,
        maxHeight: 500,
      }}
    >
      <FlatList
        data={planFeatures}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <PlanRow
            benefit={item}
            styles={{
              borderBottomWidth: index !== planFeatures.length - 1 ? 1 : 0,
              borderColor: "#c7c5c3",
              paddingBottom: index !== planFeatures.length - 1 ? 16 : 0,
            }}
          />
        )}
        contentContainerStyle={{
          gap: 14,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

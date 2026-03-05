import Layout from "@/components/app/Layout";
import BackButton from "@/components/partials/BackButton";
import {
  colorPrimary,
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
} from "@/constant/constant";
import { MOCK_DATES, MOCK_SLOTS } from "@/mocks/schedule";
import { useCartStore } from "@/store/modules/cart";
import { NavigationType } from "@/store/types";
import { IconCalendar, IconClock } from "@tabler/icons-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SelectDateTimeScreen: React.FC<Props> = ({ navigation }) => {
  const setSchedule = useCartStore((s) => s.setSchedule);
  const existingSchedule = useCartStore((s) => s.schedule);

  const [selectedDateId, setSelectedDateId] = useState<string>(
    existingSchedule?.dateId ?? MOCK_DATES[0]?.id ?? "mon-14"
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(
    existingSchedule?.time ?? MOCK_SLOTS[0] ?? "09:00 AM"
  );

  const selectedDate = MOCK_DATES.find((d) => d.id === selectedDateId);

  const monthLabel = useMemo(() => {
    const sourceId = selectedDate?.id ?? MOCK_DATES[0]?.id;
    if (!sourceId) {
      const now = new Date();
      return `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
    }
    const parsed = new Date(sourceId);
    if (Number.isNaN(parsed.getTime())) {
      const now = new Date();
      return `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
    }
    return `${MONTH_NAMES[parsed.getMonth()]} ${parsed.getFullYear()}`;
  }, [selectedDate?.id]);

  const handleContinue = () => {
    if (!selectedDate || !MOCK_DATES.length) return;
    setSchedule({
      dateId: selectedDate.id,
      labelTop: selectedDate.labelTop,
      labelBottom: selectedDate.labelBottom,
      time: selectedSlot,
    });
    navigation.navigate("YourCartScreen");
  };

  return (
    <Layout disableHeader>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Div pt={8} pb={4}>
          <Div mb={6}>
            <BackButton onPress={() => navigation.goBack()} />
          </Div>
          <Text
            fontSize={"2xl"}
            fontFamily={fontHauoraBold}
            color="#1A1C1E"
            mb={4}
          >
            Select Date &amp; Time
          </Text>
          <Text
            fontSize={"sm"}
            fontFamily={fontHauoraMedium}
            color="#74777F"
          >
            Choose a slot that works for you
          </Text>
        </Div>

        {/* Month label */}
        <Div flexDir="row" alignItems="center" mt={10} mb={4}>
          <IconCalendar size={18} color={colorPrimary} />
          <Text
            fontSize={"sm"}
            fontFamily={fontHauoraBold}
            color="#1A1C1E"
            ml={8}
          >
            {monthLabel}
          </Text>
        </Div>

        {/* Horizontal date pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -6 }}
          contentContainerStyle={{ paddingHorizontal: 6 }}
        >
          <Div flexDir="row" style={{ gap: 12 }} py={10}>
            {MOCK_DATES.map((d) => {
              const isActive = d.id === selectedDateId;
              return (
                <TouchableOpacity
                  key={d.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedDateId(d.id)}
                  style={[
                    styles.datePill,
                    isActive && styles.datePillActive,
                  ]}
                >
                  <Text
                    fontSize={10}
                    fontFamily={fontHauoraMedium}
                    color={isActive ? "#FFFFFFCC" : "#74777F"}
                    mb={2}
                  >
                    {d.labelTop}
                  </Text>
                  <Text
                    fontSize={"lg"}
                    fontFamily={fontHauoraBold}
                    color={isActive ? "#FFFFFF" : "#1A1C1E"}
                  >
                    {d.labelBottom}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Div>
        </ScrollView>

        {/* Time slots header */}
        <Div flexDir="row" alignItems="center" mt={16} mb={6}>
          <IconClock size={18} color={colorPrimary} />
          <Text
            fontSize={"sm"}
            fontFamily={fontHauoraBold}
            color="#1A1C1E"
            ml={8}
          >
            Available slots
          </Text>
        </Div>

        {/* Slots grid */}
        <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -6 }}>
          {MOCK_SLOTS.map((slot) => {
            const isActive = slot === selectedSlot;
            return (
              <TouchableOpacity
                key={slot}
                activeOpacity={0.8}
                onPress={() => setSelectedSlot(slot)}
                style={[
                  styles.slotPill,
                  isActive && styles.slotPillActive,
                ]}
              >
                <Text
                  fontSize={"sm"}
                  fontFamily={fontHauoraBold}
                  color={isActive ? colorPrimary : "#44474E"}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Div>

        <Div h={120} />
      </ScrollView>

      {/* Bottom CTA */}
      <Div
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        bg="#FFFFFF"
        px={20}
        pt={12}
        pb={24}
        borderTopWidth={1}
        borderTopColor="#E5E7EB"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.06,
          shadowRadius: 18,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.primaryButton}
          onPress={handleContinue}
          disabled={!selectedDate || !MOCK_DATES.length || !MOCK_SLOTS.length}
        >
          <Text
            fontSize={"md"}
            fontFamily={fontHauoraBold}
            color="#FFFFFF"
          >
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </Div>
    </Layout>
  );
};

export default SelectDateTimeScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  datePill: {
    width: 62,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.03)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  datePillActive: {
    backgroundColor: colorPrimary,
  },
  slotPill: {
    width: "48%",
    marginHorizontal: 6,
    marginBottom: 12,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  slotPillActive: {
    borderColor: colorPrimary,
    backgroundColor: "#ECF4FF",
  },
  primaryButton: {
    height: 56,
    borderRadius: 20,
    backgroundColor: colorPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
});


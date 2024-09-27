import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { Div, Text } from "react-native-magnus";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react-native";
import { fontHauoraSemiBold } from "@/constant/constant";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { ExpertAvailability } from "@/store/types/expert";

interface Props {
  onSelect?: (date: string) => void;
  // allAvailability: ExpertAvailability[];
}

const CalendarHeader = ({ date }: { date: string }) => {
  return (
    <Text
      bg="#FAF8F5"
      fontFamily={fontHauoraSemiBold}
      fontSize={20}
      lineHeight={32}
      color="#222222"
    >
      {date}
    </Text>
  );
};

const AvailabilityAndDateSelector: React.FC<Props> = ({
  onSelect,
  // allAvailability,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: string) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setSelectedDate(new Date(formattedDate));

    if (onSelect) {
      onSelect(formattedDate);
    }
  };

  // const isDateEnabled = useCallback(
  //   (date: string) => {
  //     const enabledDays = allAvailability.map((a) => a.dayOfWeek);
  //     const enabledDates = allAvailability.map((a) => a.date);

  //     return (
  //       enabledDates.includes(date) ||
  //       enabledDays.includes(dayjs(date).format("ddd").toLowerCase())
  //     );
  //   },
  //   [allAvailability]
  // );

  // const datesCollection = useMemo(
  //   () =>
  //     Array.from({ length: 180 }, (_, i) => {
  //       // Changed 365 to 180 for 6 months
  //       const date = dayjs().add(i, "day").format("YYYY-MM-DD");
  //       return { [date]: { disabled: !isDateEnabled(date) } };
  //     }).reduce((acc, cur) => ({ ...acc, ...cur }), {}),
  //   [isDateEnabled]
  // );

  return (
    <Div style={{ height: 136 }} position="relative">
      <CalendarProvider date={selectedDate.toISOString()}>
        <ExpandableCalendar
          disableWeekScroll
          allowShadow={false}
          calendarStyle={{
            borderBottomWidth: 1,
            borderColor: "#E0E0E0",
            paddingBottom: 16,
            paddingHorizontal: 0,
            backgroundColor: "#FAF8F5",
          }}
          headerStyle={{ backgroundColor: "#FAF8F5" }}
          // headerStyle={{ paddingHorizontal: 0 }}

          disablePan
          hideKnob
          markedDates={{}}
          current={selectedDate}
          animateScroll={true}
          minDate={dayjs().format("YYYY-MM-DD")}
          disableAllTouchEventsForDisabledDays
          // monthFormat="dddd, MMM d yyyy"
          renderHeader={(date) => (
            <CalendarHeader date={dayjs(selectedDate).format("dddd, MMM D")} />
          )}
          renderArrow={(direction) => (
            <Div>
              {direction === "left" &&
              dayjs(selectedDate).isAfter(dayjs(), "day") ? (
                <IconChevronLeft size={24} color="#494949" strokeWidth={1.5} />
              ) : direction === "right" ? (
                <IconChevronRight size={24} color="#494949" strokeWidth={1.5} />
              ) : null}
            </Div>
          )}
          onDayPress={(day) => handleDateSelect(day.dateString)}
          theme={{
            calendarBackground: "#FAF8F5", // Change the background color to red
          }}
        />
      </CalendarProvider>
    </Div>
  );
};

export default AvailabilityAndDateSelector;

import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { Div, Text } from "react-native-magnus";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react-native";
import { fontHauoraSemiBold } from "@/constant/constant";

// Todo: it needs to be revisited
const currentDate = new Date();
// Format the date
const formattedDate = currentDate.toISOString().slice(0, 10);

const CalendarHeader = ({ date }: { date: string }) => {
  return (
    <Text
      fontFamily={fontHauoraSemiBold}
      fontSize={20}
      lineHeight={32}
      color="#222222"
    >
      {date}
    </Text>
  );
};

const AvailabilityAndDateSelector = () => {
  return (
    <Div>
      <CalendarProvider date={formattedDate}>
        <ExpandableCalendar
          calendarStyle={{
            borderBottomWidth: 1,
            borderColor: "#E0E0E0",
            paddingBottom: 16,
            paddingHorizontal: 0,
          }}
          headerStyle={{ paddingHorizontal: 0 }}
          // style={{ paddingHorizontal: 0 }}
          // indicatorStyle=""
          // style={{}}
          // numColumns={4}
          columnWrapperStyle={{ padding: 0, backgroundColor: "red" }}
          disablePan
          hideKnob
          monthFormat="dddd, MMM d yyyy"
          renderHeader={(date) => (
            <CalendarHeader date={date.toString("dddd, MMM d yyyy")} />
          )}
          renderArrow={(direction) => (
            <Text>
              {direction === "left" ? (
                <IconChevronLeft size={24} color="#494949" strokeWidth={1.5} />
              ) : (
                <IconChevronRight size={24} color="#494949" strokeWidth={1.5} />
              )}
            </Text>
          )}
        />
      </CalendarProvider>
    </Div>
  );
};

export default AvailabilityAndDateSelector;

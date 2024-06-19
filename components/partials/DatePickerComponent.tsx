import React, { useState } from "react";
import { Button, Div } from "react-native-magnus";
import dayjs from "dayjs";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DatePickerComponent = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const hideDatePicker = () => {
    setOpen(false);
  };

  const handleConfirm = (date: any) => {
    console.warn("A date has been picked: ", date);
    setDate;
  };

  return (
    <Div>
      <Button
        py={16}
        px={12}
        fontSize={18}
        rounded={12}
        borderColor="#494949"
        borderWidth={1}
        ripple
        bg="transparent"
        color="#494949"
        w={"100%"}
        textAlign="left"
        style={{ flex: 1, justifyContent: "flex-start" }}
        onPress={() => setOpen(true)}
      >
        {date ? dayjs(date).format("MMMM DD YYYY") : "Date of birth"}
      </Button>
      <DateTimePickerModal
        isVisible={open}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </Div>
  );
};

export default DatePickerComponent;

import React, { useEffect, useState } from "react";
import { Button, Div } from "react-native-magnus";
import dayjs from "dayjs";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DatePickerComponentProps {
  value: string;
  onChange: (dob: any) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  value,
  onChange,
}) => {
  const [date, setDate] = useState(new Date(value));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDate(new Date(value));
  }, [value]);

  const hideDatePicker = () => {
    setOpen(false);
  };

  const handleConfirm = (date: any) => {
    setDate(date);
    onChange(date);

    hideDatePicker();
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

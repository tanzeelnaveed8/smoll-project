import DatePickerComponent from "@/components/partials/DatePickerComponent";
import InputField from "@/components/partials/InputField";
import React from "react";
import { Div, Text } from "react-native-magnus";

const PetBirthDateScreen = () => {
  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        Great name! When was Lucy born?
      </Text>
      <DatePickerComponent />
    </Div>
  );
};

export default PetBirthDateScreen;

import InputField from "@/components/partials/InputField";
import React from "react";
import { Div, Text } from "react-native-magnus";

const PetBirthDateScreen = () => {
  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        Great name! When was Lucy born?
      </Text>
      <InputField
        placeholder="Name"
        marginBottom={16}
        floatingPlaceholder
        inputStyle={{ borderRadius: 12 }}
      />
    </Div>
  );
};

export default PetBirthDateScreen;

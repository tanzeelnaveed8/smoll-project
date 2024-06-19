import InputField from "@/components/partials/InputField";
import RadioButtion from "@/components/partials/RadioButtion";
import SelectInput from "@/components/partials/SelectInput";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { Button, Div, Text } from "react-native-magnus";

const PetBreedScreen = () => {
  const [showManualInput, setShowManualInput] = useState(false);

  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        What breed is Lucy?
      </Text>

      <SelectInput label="Select a breed" />

      {showManualInput && (
        <InputField
          placeholder="Name"
          marginTop={16}
          floatingPlaceholder
          inputStyle={{ borderRadius: 12 }}
        />
      )}

      <Button
        mt={12}
        fontSize={"lg"}
        color="#6B6B6B"
        px={0}
        py={0}
        bg={"transparent"}
        onPress={() => {
          setShowManualInput(true);
        }}
      >
        My pet's breed is missing?
      </Button>
    </Div>
  );
};

export default PetBreedScreen;

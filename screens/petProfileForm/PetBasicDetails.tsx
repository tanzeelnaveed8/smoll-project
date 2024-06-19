import InputField from "@/components/partials/InputField";
import RadioButtion from "@/components/partials/RadioButtion";
import SelectInput from "@/components/partials/SelectInput";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Button, Div, ScrollDiv, Text, Textarea } from "react-native-magnus";

const data = ["Yes", "No"];

const PetBasicDetails = () => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        Almost done! We need basic pet details.
      </Text>

      <InputField
        placeholder="Chip Number (Optional)"
        marginBottom={20}
        inputStyle={{ borderRadius: 12 }}
      />

      <SelectInput
        label="Select a breed"
        options={["10Kg", "15Kg", "20Kg", "25Kg", "30Kg"]}
        marginBottom={20}
      />

      <InputField
        placeholder="Any pre-existing conditions"
        marginBottom={20}
        multiline
        numberOfLines={5}
        inputStyle={{
          borderRadius: 12,
        }}
      />
    </Div>
  );
};

export default PetBasicDetails;

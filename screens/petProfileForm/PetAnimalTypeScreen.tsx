import InputField from "@/components/partials/InputField";
import RadioButtion from "@/components/partials/RadioButtion";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { Button, Div, Text } from "react-native-magnus";

const data = ["Cat", "Dog"];

const PetAnimalTypeScreen = () => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        Is Lucy a cat or a dog?
      </Text>

      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <RadioButtion
            onTab={() => {
              setSelectedOption(item);
            }}
            value={item}
            selectedValue={selectedOption}
            styles={{ marginBottom: index + 1 === data.length ? 0 : 16 }}
          />
        )}
        keyExtractor={(item) => item}
      />
    </Div>
  );
};

export default PetAnimalTypeScreen;

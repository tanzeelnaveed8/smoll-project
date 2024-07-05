import RadioButton from "@/components/partials/RadioButton";
import { CreatePetPayloadDto } from "@/store/types/pet";
import React, { useState } from "react";
import { FlatList } from "react-native";
import { Div, Text } from "react-native-magnus";

interface Props {
  pet: CreatePetPayloadDto;
  setPet: (pet: CreatePetPayloadDto) => void;
}

const data = ["Yes", "No"];

const PetProfileSpayedScreen: React.FC<Props> = (props) => {
  const [selectedOption, setSelectedOption] = useState(
    props.pet.spayedOrNeutered ? "Yes" : "No"
  );

  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        Is {props.pet.name} Spayed/Neutered
      </Text>

      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <RadioButton
            onTap={() => {
              setSelectedOption(item);
              props.setPet({ ...props.pet, spayedOrNeutered: item === "Yes" });
            }}
            value={item}
            label={item}
            selectedValue={selectedOption}
            styles={{ marginBottom: index + 1 === data.length ? 0 : 16 }}
          />
        )}
        keyExtractor={(item) => item}
      />
    </Div>
  );
};

export default PetProfileSpayedScreen;

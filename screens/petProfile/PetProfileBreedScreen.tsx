import InputField from "@/components/partials/InputField";
import SelectInput from "@/components/partials/SelectInput";
import { CreatePetPayloadDto } from "@/store/types/pet";
import React, { useState } from "react";
import { Button, Div, Text } from "react-native-magnus";

interface Props {
  pet: CreatePetPayloadDto;
  setPet: (pet: CreatePetPayloadDto) => void;
}

const PetProfileBreedScreen: React.FC<Props> = (props) => {
  const [showManualInput, setShowManualInput] = useState(false);

  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        What breed is {props.pet.name}?
      </Text>

      <SelectInput label="Select a breed" />

      {showManualInput && (
        <InputField
          value={props.pet.breed}
          onChangeText={(text) => {
            props.setPet({ ...props.pet, breed: text });
          }}
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

export default PetProfileBreedScreen;

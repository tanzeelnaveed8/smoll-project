import InputField from "@/components/partials/InputField";
import { CreatePetPayloadDto } from "@/store/types/pet";
import React, { useState } from "react";
import { Div, Text } from "react-native-magnus";

interface Props {
  pet: CreatePetPayloadDto;
  setPet: (pet: CreatePetPayloadDto) => void;
}

const PetProfileBasicDetailScreens: React.FC<Props> = (props) => {
  const [weight, setWeight] = useState(
    props.pet.weight ? props.pet.weight.toString() : ""
  );
  const [chipNumber, setChipNumber] = useState(
    props.pet.chipNumber ? props.pet.chipNumber.toString() : ""
  );

  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        Almost done! We need basic pet details.
      </Text>

      <InputField
        value={weight}
        onChangeText={(text) => {
          setWeight(text);
          props.setPet({ ...props.pet, weight: parseInt(text) });
        }}
        placeholder="Weight (Kg)"
        marginBottom={20}
        inputStyle={{ borderRadius: 12 }}
        keyboardType="numeric"
      />
      <InputField
        value={chipNumber}
        onChangeText={(text) => {
          setChipNumber(text);
          props.setPet({ ...props.pet, chipNumber: parseInt(text) });
        }}
        placeholder="Chip Number (Optional)"
        marginBottom={20}
        inputStyle={{ borderRadius: 12 }}
        keyboardType="numeric"
      />

      <InputField
        placeholder="Any pre-existing conditions (Optional)"
        marginBottom={20}
        multiline
        numberOfLines={10}
        inputStyle={{
          borderRadius: 12,
        }}
      />
    </Div>
  );
};

export default PetProfileBasicDetailScreens;

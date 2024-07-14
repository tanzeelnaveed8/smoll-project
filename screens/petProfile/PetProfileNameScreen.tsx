import InputField from "@/components/partials/InputField";
import { PetPayloadDto } from "@/store/types/pet";
import React from "react";
import { Div, Text } from "react-native-magnus";

interface Props {
  pet: PetPayloadDto;
  setPet: (pet: PetPayloadDto) => void;
}

const PetProfileNameScreen: React.FC<Props> = (props) => {
  console.log("props", props);

  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        What is your pet's name?
      </Text>
      <InputField
        placeholder="Name"
        marginBottom={16}
        floatingPlaceholder
        inputStyle={{ borderRadius: 12 }}
        value={props.pet.name}
        onChangeText={(name) => props.setPet({ ...props.pet, name })}
      />
    </Div>
  );
};

export default PetProfileNameScreen;

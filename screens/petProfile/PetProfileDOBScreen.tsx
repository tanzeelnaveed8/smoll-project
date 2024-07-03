import DatePickerComponent from "@/components/partials/DatePickerComponent";
import { CreatePetPayloadDto } from "@/store/types/pet";
import React from "react";
import { Div, Text } from "react-native-magnus";

interface Props {
  pet: CreatePetPayloadDto;
  setPet: (pet: CreatePetPayloadDto) => void;
}

const PetProfileDOBScreen: React.FC<Props> = (props) => {
  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        Great name! When was {props.pet.name} born?
      </Text>
      <DatePickerComponent
        value={props.pet.dob}
        onChange={(dob) => props.setPet({ ...props.pet, dob })}
      />
    </Div>
  );
};

export default PetProfileDOBScreen;

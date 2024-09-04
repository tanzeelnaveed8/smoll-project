import DatePickerComponent from "@/components/partials/DatePickerComponent";
import { fontHeading } from "@/constant/constant";
import { PetPayloadDto } from "@/store/types/pet";
import React from "react";
import { Div, Text } from "react-native-magnus";

interface Props {
  pet: PetPayloadDto;
  setPet: (pet: PetPayloadDto) => void;
}

const PetProfileDOBScreen: React.FC<Props> = (props) => {
  return (
    <Div>
      <Text fontSize={"4xl"} mb={20} fontFamily={fontHeading}>
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

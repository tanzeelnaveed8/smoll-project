import InputField from "@/components/partials/InputField";
import TextAreaField from "@/components/partials/TextAreaField";
import { PetPayloadDto } from "@/store/types/pet";
import React, { useRef, useState } from "react";
import { Div, Text } from "react-native-magnus";

interface Props {
  pet: PetPayloadDto;
  setPet: (pet: PetPayloadDto) => void;
}

const PetProfileBasicDetailScreens: React.FC<Props> = (props) => {
  const [weight, setWeight] = useState(
    props.pet.weight ? props.pet.weight.toString() : ""
  );
  const [chipNumber, setChipNumber] = useState(
    props.pet.chipNumber ? props.pet.chipNumber.toString() : ""
  );

  const chipNumberRef = useRef<any>(null);
  const preExistingConditionRef = useRef<any>(null);

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
        onSubmitEditing={() => {
          console.log("weight submitted");
          chipNumberRef.current.focus();
        }}
      />
      <InputField
        ref={chipNumberRef}
        value={chipNumber}
        onChangeText={(text) => {
          setChipNumber(text);
          props.setPet({ ...props.pet, chipNumber: parseInt(text) });
        }}
        placeholder="Chip Number (Optional)"
        marginBottom={20}
        inputStyle={{ borderRadius: 12 }}
        keyboardType="numeric"
        onSubmitEditing={() => {
          preExistingConditionRef?.current?.focus();
        }}
      />

      <TextAreaField
        ref={preExistingConditionRef}
        placeholder="Any pre-existing conditions (Optional)"
        mb={30}
      />
    </Div>
  );
};

export default PetProfileBasicDetailScreens;

import RadioButton from "@/components/partials/RadioButton";
import { CreatePetPayloadDto, PetSpeciesEnum } from "@/store/types/pet.d";
import React, { useState } from "react";
import { FlatList } from "react-native";
import { Div, Text } from "react-native-magnus";

interface Props {
  pet: CreatePetPayloadDto;
  setPet: (pet: CreatePetPayloadDto) => void;
}

const data = [PetSpeciesEnum.CAT, PetSpeciesEnum.DOG];

const PetProfileSpeciesScreen: React.FC<Props> = (props) => {
  const [selectedOption, setSelectedOption] = useState(PetSpeciesEnum.CAT);

  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        Is {props.pet.name} a Cat or a Dog?
      </Text>

      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <RadioButton
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

export default PetProfileSpeciesScreen;

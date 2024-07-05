import InputField from "@/components/partials/InputField";
import SelectInput from "@/components/partials/SelectInput";
import { colorPrimary } from "@/constant/constant";
import { usePetStore } from "@/store/modules/pet";
import { PetPayloadDto, PetSpeciesEnum } from "@/store/types/pet.d";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Div, Text } from "react-native-magnus";

interface Props {
  pet: PetPayloadDto;
  setPet: (pet: PetPayloadDto) => void;
}

const PetProfileBreedScreen: React.FC<Props> = (props) => {
  const { petBreeds, fetchPetBreeds } = usePetStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBreeds();
  }, []);

  const breeds = useMemo(() => {
    const species = props.pet.breed === PetSpeciesEnum.DOG ? "dogs" : "cats";

    return (
      petBreeds?.[species]?.map((breed) => ({
        label: breed,
        value: breed,
      })) ?? []
    );
  }, [petBreeds]);

  const fetchBreeds = async () => {
    try {
      setLoading(true);

      if (!petBreeds) {
        await fetchPetBreeds();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Div>
      <Text fontSize={"4xl"} mb={20}>
        What breed is {props.pet.name}?
      </Text>

      <SelectInput
        label="Select a breed"
        loading={loading}
        options={breeds}
        onSelect={(val) => {
          props.setPet({ ...props.pet, breed: val.value });
        }}
        selectedValue={props.pet.breed}
      />

      {/* {showManualInput && (
        <InputField
          value={props.pet.breed}
          onChangeText={(text) => {
            props.setPet({ ...props.pet, breed: text });
          }}
          placeholder="Name"
          marginTop={16}
          floatingPlaceholder
          inputStyle={{ borderRadius: 12 }}
          loading={loading}
          disabled={loading}
        />
      )} */}

      {/* <Button
        fontSize={"lg"}
        color={colorPrimary}
        px={0}
        py={0}
        bg={"transparent"}
        onPress={() => {
          setShowManualInput(true);
        }}
      >
        My pet's breed is missing?
      </Button> */}
    </Div>
  );
};

export default PetProfileBreedScreen;

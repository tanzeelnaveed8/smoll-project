import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { CreatePetPayloadDto, PetGenderEnum } from "@/store/types/pet.d";
import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Div } from "react-native-magnus";
import * as Progress from "react-native-progress";
import AddMedicalHistoryScreen from "../petProfileForm/AddMedicalHistoryScreen";
import PetImageUploadScreen from "../petProfileForm/PetImageUploadScreen";
import PetProfileBasicDetailScreens from "./PetProfileBasicDetailScreens";
import PetProfileBreedScreen from "./PetProfileBreedScreen";
import PetProfileDOBScreen from "./PetProfileDOBScreen";
import PetProfileGenderScreen from "./PetProfileGenderScreen";
import PetProfileNameScreen from "./PetProfileNameScreen";
import PetProfileSpayedScreen from "./PetProfileSpayedScreen";
import PetProfileSpeciesScreen from "./PetProfileSpeciesScreen";
import { usePetStore } from "@/store/modules/pet";
import { useToast } from "react-native-toast-notifications";

const windowWidth = Dimensions.get("window").width;

const PetProfileScreen = () => {
  const toast = useToast();
  const { addPet } = usePetStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pet, setPet] = useState<CreatePetPayloadDto>({
    name: "",
    age: 0,
    weight: 0,
    species: "",
    gender: PetGenderEnum.MALE,
    spayedOrNeutered: false,
    photos: [],
    breed: "",
    dob: new Date().toString(),
    chipNumber: 0,
  });

  const progress = useMemo(() => (currentStep + 1) / 7, [currentStep]);

  const isActionDisabled = useMemo(() => {
    switch (currentStep) {
      case 0:
        return !pet.name.length;
      case 2:
        return !pet.gender.length;
      case 4:
        return !pet.breed.length;
      case 6:
        return !pet.weight;
    }

    return false;
  }, [currentStep, pet]);

  const handleNext = async () => {
    if (currentStep === 6) {
      try {
        setLoading(true);

        await addPet(pet);

        toast.show("Pet profile created successfully");
      } finally {
        setLoading(false);
      }
    }

    setCurrentStep((step) => step + 1);
  };

  return (
    <Layout
      showBack
      onBackPress={() => setCurrentStep((step) => step - 1)}
      style={styles.container}
    >
      <Div style={{ flex: 1 }}>
        {/* progress bar */}
        <Progress.Bar
          progress={progress}
          height={8}
          width={windowWidth - 40}
          borderColor="transparent"
          style={{
            marginBottom: 32,
            backgroundColor: "#EFEFEF",
            borderRadius: 100,
          }}
          color="#427594"
        />

        {/* screens */}
        {currentStep === 0 && (
          <PetProfileNameScreen pet={pet} setPet={setPet} />
        )}
        {currentStep === 1 && <PetProfileDOBScreen pet={pet} setPet={setPet} />}
        {currentStep === 2 && (
          <PetProfileGenderScreen pet={pet} setPet={setPet} />
        )}
        {currentStep === 3 && (
          <PetProfileSpeciesScreen pet={pet} setPet={setPet} />
        )}
        {currentStep === 4 && (
          <PetProfileBreedScreen pet={pet} setPet={setPet} />
        )}
        {currentStep === 5 && (
          <PetProfileSpayedScreen pet={pet} setPet={setPet} />
        )}
        {currentStep === 6 && (
          <PetProfileBasicDetailScreens pet={pet} setPet={setPet} />
        )}
        {currentStep === 7 && <PetImageUploadScreen />}
        {currentStep === 8 && <AddMedicalHistoryScreen />}
      </Div>

      <Div>
        <ButtonPrimary
          bgColor="primary"
          onPress={handleNext}
          disabled={isActionDisabled || loading}
          loading={loading}
        >
          {currentStep === 8 ? "Confirm" : "Next"}
        </ButtonPrimary>
      </Div>
    </Layout>
  );
};

export default PetProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

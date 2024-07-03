import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { CreatePetPayloadDto, PetGenderEnum } from "@/store/types/pet.d";
import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Div } from "react-native-magnus";
import * as Progress from "react-native-progress";
import AddMedicalHistoryScreen from "../petProfileForm/AddMedicalHistoryScreen";
import PetAnimalTypeScreen from "./PetProfileSpeciesScreen";
import PetBasicDetails from "../petProfileForm/PetBasicDetails";
import PetBreedScreen from "./PetProfileBreedScreen";
import PetImageUploadScreen from "../petProfileForm/PetImageUploadScreen";
import PetIsNeutralScreen from "../petProfileForm/PetIsNeutralScreen";
import PetProfileDOBScreen from "./PetProfileDOBScreen";
import PetProfileGenderScreen from "./PetProfileGenderScreen";
import PetProfileNameScreen from "./PetProfileNameScreen";
import PetProfileSpeciesScreen from "./PetProfileSpeciesScreen";
import PetProfileBreedScreen from "./PetProfileBreedScreen";

const windowWidth = Dimensions.get("window").width;

const PetProfileScreen = () => {
  const [currentStep, setCurrentStep] = useState(4);
  const progress = useMemo(() => (currentStep + 1) / 7, [currentStep]);

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

  const isActionDisabled = useMemo(() => {
    switch (currentStep) {
      case 0:
        return !pet.name.length;
      case 1:
        return !pet.dob.length;
      case 2:
        return !pet.gender.length;
    }

    return false;
  }, [currentStep, pet]);

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
        {currentStep === 5 && <PetIsNeutralScreen />}
        {currentStep === 6 && <PetBasicDetails />}
        {currentStep === 7 && <PetImageUploadScreen />}
        {currentStep === 8 && <AddMedicalHistoryScreen />}
      </Div>

      <Div>
        <ButtonPrimary
          bgColor="primary"
          onTouchEnd={() => setCurrentStep((prev) => prev + 1)}
          disabled={isActionDisabled}
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

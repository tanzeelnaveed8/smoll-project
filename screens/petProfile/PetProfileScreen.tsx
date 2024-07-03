import BackButton from "@/components/partials/BackButton";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import Container from "@/components/partials/Container";
import React, { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Div } from "react-native-magnus";
import * as Progress from "react-native-progress";
import AddMedicalHistoryScreen from "../petProfileForm/AddMedicalHistoryScreen";
import PetAnimalTypeScreen from "../petProfileForm/PetAnimalTypeScreen";
import PetBasicDetails from "../petProfileForm/PetBasicDetails";
import PetBirthDateScreen from "../petProfileForm/PetBirthDateScreen";
import PetBreedScreen from "../petProfileForm/PetBreedScreen";
import PetGenderScreen from "../petProfileForm/PetGenderScreen";
import PetImageUploadScreen from "../petProfileForm/PetImageUploadScreen";
import PetIsNeutralScreen from "../petProfileForm/PetIsNeutralScreen";
import PetNameScreen from "../petProfileForm/PetNameScreen";
import Layout from "@/components/app/Layout";

const windowWidth = Dimensions.get("window").width;

const PetProfileScreen = () => {
  const [progress, setProgress] = useState(0.25);
  const [currentStep, setCurrentStep] = useState(8);

  const nextFormHandler = () => {
    setCurrentStep((prev) => prev + 1);
    setProgress((prev) => prev + 1 / 7);
  };

  return (
    <Layout style={styles.container}>
      <Div>
        <BackButton mb={24} />
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
        {currentStep === 0 && <PetNameScreen />}
        {currentStep === 1 && <PetBirthDateScreen />}
        {currentStep === 2 && <PetGenderScreen />}
        {currentStep === 3 && <PetAnimalTypeScreen />}
        {currentStep === 4 && <PetBreedScreen />}
        {currentStep === 5 && <PetIsNeutralScreen />}
        {currentStep === 6 && <PetBasicDetails />}
        {currentStep === 7 && <PetImageUploadScreen />}
        {currentStep === 8 && <AddMedicalHistoryScreen />}
      </Div>

      <Div>
        <ButtonPrimary bgColor="primary" onTouchEnd={nextFormHandler}>
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

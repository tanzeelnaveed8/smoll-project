import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import * as Progress from "react-native-progress";
import { Dimensions } from "react-native";
import PetNameScreen from "./PetNameScreen";
import PetGenderScreen from "./PetGenderScreen";
import PetAnimalTypeScreen from "./PetAnimalTypeScreen";
import PetBirthDateScreen from "./PetBirthDateScreen";
import PetBreedScreen from "./PetBreedScreen";
import PetIsNeutralScreen from "./PetIsNeutralScreen";
import PetBasicDetails from "./PetBasicDetails";
import Container from "@/components/partials/Container";
import PetImageUploadScreen from "./PetImageUploadScreen";
import BackButton from "@/components/partials/BackButton";

const windowWidth = Dimensions.get("window").width;

const PetProfileScreen = () => {
  const [progress, setProgress] = useState(0.25);
  const [currentStep, setCurrentStep] = useState(7);

  const nextFormHandler = () => {
    setCurrentStep((prev) => prev + 1);
    setProgress((prev) => prev + 1 / 7);
  };

  return (
    <Container pt={20} style={styles.container}>
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
      </Div>

      <Div>
        <ButtonPrimary bgColor="primary" onTouchEnd={nextFormHandler}>
          {currentStep === 6 ? "Confirm" : "Next"}
        </ButtonPrimary>
      </Div>
    </Container>
  );
};

export default PetProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

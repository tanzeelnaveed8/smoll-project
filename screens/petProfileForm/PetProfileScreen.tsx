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

const windowWidth = Dimensions.get("window").width;

const PetProfileScreen = () => {
  const [progress, setProgress] = useState(0.25);
  const [currentStep, setCurrentStep] = useState(6);

  const nextFormHandler = () => {
    setCurrentStep((prev) => prev + 1);
    setProgress((prev) => prev + 0.22);
  };

  return (
    <Div style={styles.container}>
      <Div>
        {/* progress bar */}
        <Progress.Bar
          progress={progress}
          height={8}
          width={windowWidth - 40}
          borderColor="transparent"
          style={{ marginBottom: 32, backgroundColor: "#EFEFEF" }}
        />

        {/* screens */}
        {currentStep === 0 && <PetNameScreen />}
        {currentStep === 1 && <PetBirthDateScreen />}
        {currentStep === 2 && <PetGenderScreen />}
        {currentStep === 3 && <PetAnimalTypeScreen />}
        {currentStep === 4 && <PetBreedScreen />}
        {currentStep === 5 && <PetIsNeutralScreen />}
        {currentStep === 6 && <PetBasicDetails />}
      </Div>

      <Div>
        <ButtonPrimary bgColor="primary" onTouchEnd={nextFormHandler}>
          Next
        </ButtonPrimary>
      </Div>
    </Div>
  );
};

export default PetProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

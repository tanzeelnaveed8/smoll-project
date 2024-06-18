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

const windowWidth = Dimensions.get("window").width;

const PetProfileScreen = () => {
  const [progress, setProgress] = useState(0.25);
  const [currentStep, setCurrentStep] = useState(2);

  const nextFormHandler = () => {
    setCurrentStep((prev) => prev + 1);
    setProgress((prev) => prev + 0.25);
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
        {/* dob screen */}
        {currentStep === 2 && <PetGenderScreen />}
        {currentStep === 3 && <PetAnimalTypeScreen />}
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

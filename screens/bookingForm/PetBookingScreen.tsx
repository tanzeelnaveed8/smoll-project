import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import * as Progress from "react-native-progress";
import { Dimensions } from "react-native";
import PetRefuseWaterScreen from "./PetRefuseWaterScreen";
import PetHidingScreen from "./PetHidingScreen";
import PetVomitingQuestionScreen from "./PetVomitingQuestionScreen";
import PetContinuousBleedingQuestionScreen from "./PetContinuousBleedingQuestionScreen";

const windowWidth = Dimensions.get("window").width;

const PetBookingScreen = () => {
  const [progress, setProgress] = useState(0.25);
  const [currentStep, setCurrentStep] = useState(0);

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
        {currentStep === 0 && <PetRefuseWaterScreen />}
        {currentStep === 1 && <PetHidingScreen />}
        {currentStep === 2 && <PetVomitingQuestionScreen />}
        {currentStep === 3 && <PetContinuousBleedingQuestionScreen />}
      </Div>

      <Div>
        <ButtonPrimary bgColor="primary" onTouchEnd={nextFormHandler}>
          Continue
        </ButtonPrimary>
      </Div>
    </Div>
  );
};

export default PetBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

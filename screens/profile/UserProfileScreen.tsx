import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import * as Progress from "react-native-progress";
import { Dimensions } from "react-native";
import ProfileNameScreen from "./ProfileNameScreen";
import ProfileNumberScreen from "./ProfileNumberScreen";
import VerifyEmailScreen from "../auth/VerifyEmailScreen";
import ProfileAddressScreen from "./ProfileAddressScreen";

const windowWidth = Dimensions.get("window").width;

const UserProfileScreen = () => {
  const [progress, setProgress] = useState(0.25);
  const [currentStep, setCurrentStep] = useState(0);

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
        {/* form */}
        {/* {currentStep === 0 ? (
          <ProfileNameScreen />
        ) : currentStep === 1 ? (
          <ProfileNumberScreen />
        ) : currentStep === 2 ? (
          <VerifyEmailScreen />
        ) : currentStep === 3 ? (
          <ProfileAddressScreen />
        ) : } */}

        {currentStep === 0 && <ProfileNameScreen />}
        {currentStep === 1 && <ProfileNumberScreen />}
        {currentStep === 2 && <VerifyEmailScreen />}
        {currentStep === 3 && <ProfileAddressScreen />}
      </Div>

      <Div>
        {currentStep === 3 && (
          <Button
            bg="transparent"
            px={0}
            py={0}
            color="#7B7B7B"
            mx={"auto"}
            mb={32}
            fontSize={"xl"}
          >
            Skip
          </Button>
        )}
        <ButtonPrimary bgColor="primary" onTouchEnd={nextFormHandler}>
          Next
        </ButtonPrimary>
      </Div>
    </Div>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

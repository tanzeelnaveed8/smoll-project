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
import Layout from "@/components/app/Layout";
import { NavigationType } from "@/store/types";
import PetImageUploadScreen from "./PetImageUploadScreen";
import AddMedicalHistoryScreen from "./AddMedicalHistoryScreen";
import PetDetailsModal from "./PetDetailsModal";

const windowWidth = Dimensions.get("window").width;
const totalScreens = 8;

const PetProfileScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [progress, setProgress] = useState(1 / totalScreens);
  const [currentStep, setCurrentStep] = useState(0);

  const nextFormHandler = () => {
    setCurrentStep((prev) => prev + 1);
    setProgress((prev) => prev + 1 / totalScreens);
  };

  React.useEffect(
    () =>
      navigation.addListener(
        "beforeRemove",
        (e: { preventDefault: () => void }) => {
          e.preventDefault();
          if (currentStep === 0) {
            // If we don't have unsaved changes, then we don't need to do anything

            return;
          }
          console.log("currentStep", currentStep);
          if (currentStep === 3) {
            navigation.navigate("Confirmation");
          }

          setCurrentStep((prev) => prev - 1);
          setProgress((prev) => prev - 1 / totalScreens);
        }
      ),
    [navigation, currentStep]
  );

  return (
    <Layout style={{ paddingTop: 20, paddingBottom: 10 }}>
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
          {currentStep === 7 && <PetImageUploadScreen />}
          {currentStep === 8 && <AddMedicalHistoryScreen />}
          {currentStep === 9 && (
            <PetDetailsModal
              onClose={() => {
                console.log("close");
              }}
              open={currentStep === 9}
            />
          )}
        </Div>

        <Div>
          <ButtonPrimary bgColor="primary" onTouchEnd={nextFormHandler}>
            {currentStep === totalScreens ? "Confirm" : "Next"}
          </ButtonPrimary>
        </Div>
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

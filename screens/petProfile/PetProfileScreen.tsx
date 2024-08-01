import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { usePetStore } from "@/store/modules/pet";
import { NavigationType } from "@/store/types";
import {
  PetGenderEnum,
  PetPayloadDto,
  PetSpeciesEnum,
} from "@/store/types/pet.d";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Div, ScrollDiv } from "react-native-magnus";
import * as Progress from "react-native-progress";
import { useToast } from "react-native-toast-notifications";
import PetProfileBasicDetailScreens from "./PetProfileBasicDetailScreens";
import PetProfileBreedScreen from "./PetProfileBreedScreen";
import PetProfileDOBScreen from "./PetProfileDOBScreen";
import PetProfileGenderScreen from "./PetProfileGenderScreen";
import PetImageUploadScreen from "./PetProfileImageScreen";
import PetProfileNameScreen from "./PetProfileNameScreen";
import PetProfileSpayedScreen from "./PetProfileSpayedScreen";
import PetProfileSpeciesScreen from "./PetProfileSpeciesScreen";
import { showMessage } from "react-native-flash-message";

const windowWidth = Dimensions.get("window").width;

interface Props {
  navigation: NavigationType;
}

const totalSteps = 7;

const PetProfileScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const toast = useToast();
  const { addPet, healthHistoryMap } = usePetStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pet, setPet] = useState<PetPayloadDto>({
    name: "",
    age: 0,
    weight: 0,
    species: PetSpeciesEnum.CAT,
    gender: PetGenderEnum.MALE,
    spayedOrNeutered: false,
    photos: [],
    breed: "",
    dob: new Date().toString(),
    chipNumber: 0,
  });

  const progress = useMemo(
    () => (currentStep + 1) / totalSteps - 0.2,
    [currentStep]
  );

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
      case 7:
        return !pet.photos.length;
    }

    return false;
  }, [currentStep, pet, healthHistoryMap]);

  const handleNext = async () => {
    const comingFrom = (route.params as Record<string, string>)?.from;

    if (currentStep === 7) {
      try {
        setLoading(true);

        const { id } = await addPet(pet);

        props.navigation.navigate("PetProfileMedicalHistoryScreen", {
          navigateTo: comingFrom === "modal" ? "HomeScreen" : comingFrom,
          petId: id ?? "",
          petName: pet.name,
          petBg: pet.photos[0].url,
        });

        toast.show("Pet profile created successfully");
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    const comingFrom = (route.params as Record<string, string>)?.from;

    if (currentStep === 0) {
      if (comingFrom === "modal") {
        props.navigation.navigate("HomeScreen", {
          showSetupModal: "true",
        });

        return;
      }

      props.navigation.goBack();
    }

    setCurrentStep((step) => step - 1);
  };

  useEffect(() => {
    console.log(pet);
  }, [pet]);

  return (
    <Layout
      showBack={currentStep !== 8}
      onBackPress={handleBack}
      style={styles.container}
    >
      <ScrollDiv style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
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
        {currentStep === 7 && (
          <PetImageUploadScreen
            navigation={props.navigation}
            pet={pet}
            setPet={setPet}
          />
        )}
      </ScrollDiv>

      <Div>
        <ButtonPrimary
          bgColor="primary"
          onPress={handleNext}
          disabled={isActionDisabled || loading}
          loading={loading}
        >
          Next
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

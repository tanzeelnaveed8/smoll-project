import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import {
  PetPayloadDto,
  PetGenderEnum,
  PetSpeciesEnum,
} from "@/store/types/pet.d";
import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Div } from "react-native-magnus";
import * as Progress from "react-native-progress";
import AddMedicalHistoryScreen from "../petProfileForm/AddMedicalHistoryScreen";
import PetImageUploadScreen from "./PetProfileImageScreen";
import PetProfileBreedScreen from "./PetProfileBreedScreen";
import PetProfileDOBScreen from "./PetProfileDOBScreen";
import PetProfileGenderScreen from "./PetProfileGenderScreen";
import PetProfileNameScreen from "./PetProfileNameScreen";
import PetProfileSpeciesScreen from "./PetProfileSpeciesScreen";
import { usePetStore } from "@/store/modules/pet";
import { useToast } from "react-native-toast-notifications";
import PetProfileSpayedScreen from "./PetProfileSpayedScreen";
import PetProfileBasicDetailScreens from "./PetProfileBasicDetailScreens";
import { useRoute } from "@react-navigation/native";
import { NavigationType } from "@/store/types";
import { useUserStore } from "@/store/modules/user";

const windowWidth = Dimensions.get("window").width;

interface Props {
  navigation: NavigationType;
}

const totalSteps = 8;

const PetProfileScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const toast = useToast();
  const { addPet, healthHistoryMap } = usePetStore();
  const [newPetId, setNewPetId] = useState("");

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

  // console.log("petState:", pet);

  const progress = useMemo(() => (currentStep + 1) / totalSteps, [currentStep]);

  const isActionDisabled = useMemo(() => {
    const healthHistoryLength = healthHistoryMap.get(newPetId)?.length;

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
      case 8:
        return !healthHistoryLength;
    }

    return false;
  }, [currentStep, pet, healthHistoryMap]);

  const handleNext = async () => {
    if (currentStep === 7) {
      try {
        setLoading(true);

        const response = await addPet(pet);
        console.log("response----", response);
        setNewPetId(`${response.id}`);

        toast.show("Pet profile created successfully");
      } finally {
        setLoading(false);
      }
    }

    if (currentStep === 8) {
      props.navigation.navigate("PetCongratulationsScreen");
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

  return (
    <Layout showBack onBackPress={handleBack} style={styles.container}>
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
        {currentStep === 7 && (
          <PetImageUploadScreen
            navigation={props.navigation}
            pet={pet}
            setPet={setPet}
          />
        )}
        {currentStep === 8 && <AddMedicalHistoryScreen petId={newPetId} />}
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

import Layout from "@/components/app/Layout";
import React, { useEffect, useState } from "react";
import { Div } from "react-native-magnus";
import PetProfileNameScreen from "../petProfile/PetProfileNameScreen";
import { usePetStore } from "@/store/modules/pet";
import { PetDetail } from "@/store/types/pet";
import PetProfileDOBScreen from "../petProfile/PetProfileDOBScreen";
import PetProfileSpeciesScreen from "../petProfile/PetProfileSpeciesScreen";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import PetProfileGenderScreen from "../petProfile/PetProfileGenderScreen";
import PetProfileBreedScreen from "../petProfile/PetProfileBreedScreen";
import PetProfileSpayedScreen from "../petProfile/PetProfileSpayedScreen";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { colorPrimary } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { useToast } from "react-native-toast-notifications";

type RouteType = { petId: string; fileName: string };

const PetEditInfoScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const toast = useToast();
  const route = useRoute();
  const petId = (route.params as RouteType)?.petId;
  const fileName = (route.params as RouteType)?.fileName;

  const { petsDetailMap, updatePet } = usePetStore();
  const [form, setForm] = useState<PetDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!petId) return;
    const petDetails = petsDetailMap.get(petId) as PetDetail;
    if (petDetails) {
      setForm(petDetails);
    }
  }, [petId]);

  const handleUpdateDetails = async () => {
    console.log("updated form", form);
    if (!form) return;

    try {
      setLoading(true);

      await updatePet(petId, form);

      toast.show("Pet profile updated successfully");
      navigation.navigate("PetProfileDetailsScreen", { petId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      showBack
      backBtnText=""
      title="Update Info"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      {form && (
        <>
          <Div flex={1}>
            {fileName === "name" && (
              <PetProfileNameScreen pet={form} setPet={setForm} />
            )}

            {fileName === "dob" && (
              <PetProfileDOBScreen pet={form} setPet={setForm} />
            )}

            {fileName === "weight" &&
              //   <PetProfileDOBScreen
              //     pet={{ dob: "" }}
              //     setPet={(e) => {
              //       console.log("petData", e);
              //     }}
              //   />
              ""}

            {fileName === "species" && (
              <PetProfileSpeciesScreen pet={form} setPet={setForm} />
            )}

            {fileName === "gender" && (
              <PetProfileGenderScreen pet={form} setPet={setForm} />
            )}

            {fileName === "breed" && (
              <PetProfileBreedScreen pet={form} setPet={setForm} />
            )}

            {fileName === "spayed/neutered" && (
              <PetProfileSpayedScreen pet={form} setPet={setForm} />
            )}
          </Div>

          <ButtonPrimary
            bgColor="primary"
            onPress={handleUpdateDetails}
            loading={loading}
            disabled={loading}
          >
            Confirm
          </ButtonPrimary>
        </>
      )}

      {!form && (
        <Div flex={1} justifyContent="center">
          <ActivityIndicator size="large" color={colorPrimary} />
        </Div>
      )}
    </Layout>
  );
};

export default PetEditInfoScreen;

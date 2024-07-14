import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Div, Text, Textarea } from "react-native-magnus";
import * as ImagePicker from "expo-image-picker";
import { NavigationType } from "@/store/types";
import InputField from "@/components/partials/InputField";
import { useFileStore } from "@/store/modules/file";
import { UploadedFile } from "@/store/types/file";
import SelectInput from "@/components/partials/SelectInput";
import { useCaseStore } from "@/store/modules/case";
import { usePetStore } from "@/store/modules/pet";
import type { Pet } from "@/store/types/pet";
import { useExpertStore } from "@/store/modules/expert";
import { useRoute } from "@react-navigation/native";

const NoPetOptions = ({
  navigation,
  setShowModal,
}: {
  navigation: NavigationType;
  setShowModal: (showModal: boolean) => void;
}) => {
  return (
    <Div pl={14} pt={14}>
      <Text mb={4} fontSize={"lg"} fontFamily={fontHauoraMedium}>
        No pets found
      </Text>
      <TouchableOpacity
        onPress={() => {
          setShowModal(false);

          setTimeout(() => {
            navigation.navigate("PetProfileScreen", {
              from: "ConsultationCaseBriefScreen",
            });
          });
        }}
      >
        <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} color="primary">
          Add Pet?
        </Text>
      </TouchableOpacity>
    </Div>
  );
};

const ConsultationCaseBriefScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { uploadFile } = useFileStore();
  const { createCase } = useCaseStore();
  const { updateConsultation } = useExpertStore();
  const { pets, fetchPets } = usePetStore();

  const route = useRoute();

  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedPet, setSelectedPet] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const consultationId = (route.params as Record<string, string>)
    ?.consultationId;

  useEffect(() => {
    fetchAllPets();
  }, []);

  const petOptions = useMemo<{ label: string; value: string }[]>(
    () =>
      pets?.map((pet) => ({
        label: pet.name,
        value: pet.id,
      })) || [],
    [pets]
  );

  const isActionDisable = useMemo(
    () => actionLoading || !selectedPet || !description,
    [actionLoading, selectedPet, description]
  );

  const fetchAllPets = async () => {
    try {
      setLoading(true);
      await fetchPets();
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const file = {
        fieldname: "file",
        originalname: result.assets[0].fileName!,
        encoding: "7bit",
        mimetype: result.assets[0].mimeType,
        buffer: await blob.arrayBuffer(),
        size: blob.size,
      } as unknown as File;

      const uploadedFile = await uploadFile([file]);
      setDocuments([...documents, uploadedFile[0]]);
    }
  };

  const handleCreateCase = async () => {
    try {
      setActionLoading(true);

      const { id: caseId } = await createCase({
        description,
        assets: documents,
        petId: selectedPet?.value || "",
      });

      await updateConsultation({
        id: consultationId,
        caseId,
      });

      navigation.navigate("ConsultationWaitingScreen", {
        consultationId,
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout
      showBack
      title="Case Brief"
      loading={loading}
      onBackPress={() => navigation.goBack()}
    >
      <Div flex={1} pt={20}>
        <Text fontSize={"4xl"} mb={12}>
          Tell the vet your pet's condition
        </Text>

        <Text
          mb={24}
          fontFamily={fontHauoraMedium}
          color="darkGreyText"
          fontSize={"lg"}
        >
          Please describe your pet's symptoms, including any changes in
          behaviour, appetite, energy, or physical signs like vomiting,
          diarrhoea, coughing, or unusual discharge.
        </Text>

        <Div mb={12}>
          <SelectInput
            showModal={showModal}
            onOpen={() => setShowModal(true)}
            onClose={() => setShowModal(false)}
            label="Select Pet"
            options={petOptions}
            onSelect={(value) => setSelectedPet(value)}
            selectedValue={selectedPet}
            renderNoOptions={() => NoPetOptions({ navigation, setShowModal })}
          />
        </Div>

        <InputField
          placeholder="e.g. My cat is vomiting and color is white......"
          mb={24}
          h={300}
          value={description}
          onChangeText={setDescription}
        />

        <Text fontFamily={fontHauoraSemiBold} fontSize="xl" mb={8}>
          Documents
        </Text>
        <Text
          fontSize={"lg"}
          fontFamily={fontHauoraMedium}
          color="darkGreyText"
          mb={4}
        >
          Upload supportive docunments
        </Text>

        <Text
          fontSize={"lg"}
          fontFamily={fontHauoraMedium}
          color="darkGreyText"
          mb={16}
        >
          (JPG/JPEG/PNG/PDF) Max size 8 MB
        </Text>

        <Div w={140} h={160} mb={40}>
          <TouchableOpacity style={{ flex: 1 }} onPress={pickImage}>
            <Div
              bg="#F4F6F8"
              justifyContent="center"
              alignItems="center"
              flex={1}
            >
              <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
                Upload
              </Text>
            </Div>
          </TouchableOpacity>
        </Div>
      </Div>
      <ButtonPrimary
        disabled={isActionDisable}
        onPress={handleCreateCase}
        loading={actionLoading}
      >
        Connect
      </ButtonPrimary>
    </Layout>
  );
};

export default ConsultationCaseBriefScreen;

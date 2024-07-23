import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";
import { NavigationType } from "@/store/types";
import { UploadedFile } from "@/store/types/file";
import SelectInput from "@/components/partials/SelectInput";
import { useCaseStore } from "@/store/modules/case";
import { usePetStore } from "@/store/modules/pet";
import { useExpertStore } from "@/store/modules/expert";
import { useRoute } from "@react-navigation/native";
import ImageUpload from "@/components/partials/ImageUpload";
import TextAreaField from "@/components/partials/TextAreaField";
import { CaseStatusEnum, CreateCasePayloadDto } from "@/store/types/case.d";

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
  const { createCase } = useCaseStore();
  const { updateConsultation } = useExpertStore();
  const { pets, fetchPets } = usePetStore();

  const route = useRoute();

  const comingFrom = (route.params as Record<string, string>)?.from;

  // NOTE: When coming from ExpertsListDetailScreen schedule action
  const selectedTime = (route.params as Record<string, string>)?.selectedTime;
  const selectedDate = (route.params as Record<string, string>)?.selectedDate;
  const caseData = (route.params as Record<string, string>)?.caseData;

  // NOTE: Will be there if coming from pet profile creation
  const petId = (route.params as Record<string, string>)?.petId;
  const petName = (route.params as Record<string, string>)?.petName;
  const expertId = (route.params as Record<string, string>)?.expertId;
  const consultationId = (route.params as Record<string, string>)
    ?.consultationId;

  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedPet, setSelectedPet] = useState<{
    label: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    fetchAllPets();
  }, []);

  useEffect(() => {
    setPet();
  }, [petId, petName]);

  useEffect(() => {
    if (!caseData) return;

    const parsedCase = JSON.parse(caseData) as CreateCasePayloadDto;
    const pet = pets?.find((pet) => pet.id === parsedCase.petId);

    setDescription(parsedCase.description);
    setDocuments(parsedCase.assets);
    setSelectedPet({ label: pet?.name ?? "", value: pet?.id ?? "" });
  }, [caseData]);

  const setPet = async () => {
    await fetchAllPets();
    setSelectedPet({ label: petName, value: petId });
  };

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

  const handleImage = async (file: UploadedFile[]) => {
    setDocuments([...documents, ...file]);
  };

  const handleCreateCase = async () => {
    const status =
      comingFrom === "ExpertsListDetailScreen"
        ? CaseStatusEnum.SCHEDULED
        : CaseStatusEnum.OPEN;

    // Don't create case in scheduled
    if (status === CaseStatusEnum.SCHEDULED) {
      navigation.navigate("ExpertsScheduleConfirmationScreen", {
        expertId,
        caseData: JSON.stringify({
          description,
          assets: documents,
          petId: selectedPet?.value || "",
          vetId: expertId,
          status,
        }),
        petId: selectedPet?.value || "",
        selectedTime,
        selectedDate,
      });

      return;
    }

    try {
      setActionLoading(true);

      const { id: caseId } = await createCase({
        description,
        assets: documents,
        petId: selectedPet?.value || "",
        vetId: expertId,
        status,
      });

      await updateConsultation({
        id: consultationId,
        caseId,
      });

      navigation.navigate("ConsultationWaitingScreen", {
        consultationId,
        caseId,
        expertId,
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
      <ScrollDiv flex={1} keyboardShouldPersistTaps="handled">
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

        <TextAreaField
          placeholder="e.g. My cat is vomiting and color is white......"
          value={description}
          onChangeText={setDescription}
          mb={24}
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
          Upload supportive documents
        </Text>

        <Text
          fontSize={"lg"}
          fontFamily={fontHauoraMedium}
          color="darkGreyText"
          mb={16}
        >
          (JPG/JPEG/PNG/PDF) Max size 8 MB
        </Text>

        <ImageUpload
          plusIcon={false}
          w={139}
          h={150}
          onChange={(file) => {
            handleImage(file);
          }}
        />
      </ScrollDiv>
      <ButtonPrimary
        disabled={isActionDisable}
        onPress={handleCreateCase}
        loading={actionLoading}
      >
        {comingFrom === "ExpertsListDetailScreen" ? "Confirm" : "Connect"}
      </ButtonPrimary>
    </Layout>
  );
};

export default ConsultationCaseBriefScreen;

import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import ImageUpload from "@/components/partials/ImageUpload";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { useEffect, useMemo, useState } from "react";
import { Text, Div, Button, ScrollDiv } from "react-native-magnus";
import InputField from "@/components/partials/InputField";
import DatePickerComponent from "@/components/partials/DatePickerComponent";
import { HealthHistory } from "@/store/types/pet";
import { UploadedFile } from "@/store/types/file";
import { usePetStore } from "@/store/modules/pet";
import { useToast } from "react-native-toast-notifications";
import TextAreaField from "@/components/partials/TextAreaField";
import { Keyboard, View } from "react-native";

type PropTypes = {
  open: boolean;
  onClose: () => void;
  petId: string;
  healthHistoryId?: string;
};

const initialState = {
  name: "",
  description: "",
  date: new Date().toISOString(),
  documents: [],
};

const HealthHistoryModal = (props: PropTypes) => {
  const { addHealthHistory, healthHistoryMap, updateHealthHistory } =
    usePetStore();
  const toast = useToast();

  const { open, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<HealthHistory>({ ...initialState });

  useEffect(() => {
    if (!props.healthHistoryId) {
      setForm(initialState);
      return;
    }

    const healthHistory = healthHistoryMap
      .get(props.petId)
      ?.filter((item) => item.id === props.healthHistoryId)
      ?.pop();

    if (healthHistory) {
      setForm({
        name: healthHistory.name,
        date: healthHistory.date,
        description: healthHistory.description,
        documents: healthHistory.documents,
      });
    }
  }, [open]);

  const handleFormChange = (
    key: keyof typeof form,
    value: string | UploadedFile[]
  ) => {
    const formCopy = { ...form };
    if (typeof value === "string" && key !== "documents") {
      formCopy[key] = value;
    } else if (key === "documents" && typeof value === "object") {
      formCopy.documents = value;
    } else if (key === "date") {
      formCopy.date = `${value}`;
    }

    setForm(formCopy);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (props.healthHistoryId) {
        await updateHealthHistory(props.petId, props.healthHistoryId, form);
        toast.show("Pet Health History updated successfully");
      } else {
        await addHealthHistory(props.petId, form);
        toast.show("Pet Health History added successfully");
      }
      props.onClose();
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = useMemo(() => {
    return (
      !form.name || !form.date || !form.description || !form.documents.length
    );
  }, [form]);

  return (
    <BottomSheet
      isVisible={open}
      h="95%"
      px={20}
      style={{ position: "relative" }}
    >
      <Div h={"100%"}>
        <ScrollDiv
          flex={1}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text fontSize={32} lineHeight={40} color="#222222" mb={4}>
            Details
          </Text>
          <Text
            fontFamily={fontHauoraMedium}
            fontSize="xl"
            lineHeight={24}
            color="#494949"
            maxW={350}
            mb={24}
          >
            We need your address to suggest the nearest vet clinic for in-clinic
            visits
          </Text>

          <Div mb={24} style={{ gap: 8 }}>
            <InputField
              placeholder="Vaccine or Surgery"
              h={"auto"}
              value={form.name}
              onChangeText={(e) => {
                handleFormChange("name", e);
              }}
            />

            <DatePickerComponent
              py={14}
              value={form.date}
              onChange={(dob) => {
                handleFormChange("date", dob.toISOString());
              }}
            />

            <TextAreaField
              placeholder="Description"
              value={form.description}
              onChangeText={(e) => {
                handleFormChange("description", e);
              }}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
          </Div>

          <Div>
            <Text
              fontFamily={fontHauoraSemiBold}
              fontSize="xl"
              lineHeight={24}
              color="#222222"
              mb={8}
            >
              Documents
            </Text>
            <Text
              fontFamily={fontHauoraMedium}
              fontSize="lg"
              lineHeight={24}
              color="#494949"
              mb={4}
            >
              Upload supportive docunments
            </Text>
            <Text
              fontFamily={fontHauoraMedium}
              fontSize="lg"
              lineHeight={24}
              color="#494949"
              mb={16}
            >
              (JPG/JPEG/PNG/PDF) Max size 8 MB{" "}
            </Text>

            <ImageUpload
              plusIcon={false}
              w={139}
              h={150}
              onChange={(file) => {
                handleFormChange("documents", file);
              }}
            />
          </Div>
        </ScrollDiv>

        <Div>
          <ButtonPrimary
            bgColor="primary"
            onPress={handleSubmit}
            loading={loading}
            mt={30}
            mb={30}
            disabled={loading || isDisabled}
          >
            Confirm
          </ButtonPrimary>
        </Div>
      </Div>
    </BottomSheet>
  );
};

function Add({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <Div
      py={12}
      borderBottomWidth={1}
      borderColor="#D0D7DC"
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text
        fontFamily={fontHauoraSemiBold}
        fontSize="xl"
        lineHeight={24}
        color="#494949"
      >
        {title}
      </Text>

      <Button
        bg="transparent"
        px={0}
        py={0}
        fontFamily={fontHauoraSemiBold}
        fontSize="lg"
        lineHeight={24}
        color="#427594"
        onPress={onAdd}
      >
        Add
      </Button>
    </Div>
  );
}

export default HealthHistoryModal;

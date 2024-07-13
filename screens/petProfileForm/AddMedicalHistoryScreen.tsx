import { fontHauoraMedium } from "@/constant/constant";
import { Div, Text, Button } from "react-native-magnus";
import {
  IconSquareRoundedPlus,
  IconChevronRight,
} from "@tabler/icons-react-native";
import PetDetailsModal from "./PetDetailsModal";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { usePetStore } from "@/store/modules/pet";

const AddMedicalHistoryScreen: React.FC<{ petId: string }> = ({ petId }) => {
  const { healthHistoryMap } = usePetStore();
  const [open, setOpen] = useState(false);
  const [healthHistoryId, setHealthHistoryId] = useState("");

  return (
    <Div>
      <Text fontSize={32} lineHeight={40} color="#222222" mb={4}>
        Add medical history
      </Text>
      <Text
        fontFamily={fontHauoraMedium}
        fontSize="xl"
        lineHeight={24}
        color="#494949"
        maxW={350}
      >
        We need your address to suggest the nearest vet clinic for in-clinic
        visits
      </Text>

      {healthHistoryMap.get(petId)?.map((item, i) => (
        <Button
          key={i}
          mt={20}
          style={{ width: "100%" }}
          justifyContent="space-between"
          alignItems="center"
          bg="transparent"
          borderColor="#222222"
          borderWidth={1}
          rounded={12}
          color="#494949"
          fontSize="xl"
          lineHeight={24}
          px={16}
          py={12}
          suffix={
            <IconChevronRight size={24} color="#494949" strokeWidth={1.5} />
          }
          onPress={() => {
            setOpen(true);
            setHealthHistoryId(item.id || "");
          }}
        >
          {item.name}
        </Button>
      ))}

      {/* <TouchableOpacity>
        </TouchableOpacity>  */}
      <Button
        mt={16}
        bg="transparent"
        color="#427594"
        fontFamily={fontHauoraMedium}
        fontSize="lg"
        lineHeight={24}
        px={0}
        py={0}
        onPress={() => setOpen(true)}
        prefix={
          <IconSquareRoundedPlus
            size={18}
            color="#427594"
            style={{ marginTop: 2, marginRight: 4 }}
          />
        }
      >
        Add Health History
      </Button>

      <PetDetailsModal
        open={open}
        onClose={() => {
          setOpen(false);
          setHealthHistoryId("");
        }}
        petId={petId}
        healthHistoryId={healthHistoryId}
      />
    </Div>
  );
};

export default AddMedicalHistoryScreen;

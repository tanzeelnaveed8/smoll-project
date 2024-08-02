import Layout from "@/components/app/Layout";
import HealthHistoryModal from "@/components/app/pet/HealthHistoryModal";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraMedium } from "@/constant/constant";
import { usePetStore } from "@/store/modules/pet";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import {
  IconChevronRight,
  IconSquareRoundedPlus,
} from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { Button, Div, Text } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
}

const PetProfileMedicalHistoryScreen: React.FC<Props> = (props) => {
  const route = useRoute();

  const petId = (route.params as Record<string, string>)?.petId;
  const petName = (route.params as Record<string, string>)?.petName;
  const petBg = (route.params as Record<string, string>)?.petBg;
  const navigateTo = (route.params as Record<string, string>)?.navigateTo;

  const { healthHistoryMap } = usePetStore();
  const [open, setOpen] = useState(false);
  const [healthHistoryId, setHealthHistoryId] = useState("");

  const healthHistory = healthHistoryMap.get(petId);

  useEffect(() => {
    // TODO: back gesture disable not working.
    props.navigation.addListener("beforeRemove", () => {
      return;
    });
  }, []);

  const handleConfirm = () => {
    props.navigation.navigate("PetProfileCongratulationsScreen", {
      navigateTo: navigateTo,
      petName: petName,
      petId: petId,
      petBg: petBg,
    });
  };

  return (
    <Layout preventBackGesture={true}>
      <Div flex={1}>
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
          We need your pet's medical history to understand their health better.
        </Text>

        {healthHistory?.map((item, i) => (
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
      </Div>

      <Div>
        <ButtonPrimary
          disabled={!healthHistory || healthHistory.length === 0}
          onPress={handleConfirm}
          bgColor="primary"
        >
          Confirm
        </ButtonPrimary>
      </Div>

      <HealthHistoryModal
        open={open}
        onClose={() => {
          setOpen(false);
          setHealthHistoryId("");
        }}
        petId={petId}
        healthHistoryId={healthHistoryId}
      />
    </Layout>
  );
};

export default PetProfileMedicalHistoryScreen;

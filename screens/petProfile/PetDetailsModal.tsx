import BottomSheet from "@/components/partials/BottomSheet";
import ImageUpload from "@/components/partials/ImageUpload";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { Text, Div } from "react-native-magnus";

const PetDetailsModal = () => {
  return (
    <BottomSheet isVisible h="90%">
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

      <Div mb={24}></Div>

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

        <ImageUpload plusIcon={false} w={139} h={150} />
      </Div>
    </BottomSheet>
  );
};

export default PetDetailsModal;

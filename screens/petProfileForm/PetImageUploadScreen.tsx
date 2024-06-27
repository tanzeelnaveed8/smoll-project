import { Button, Div, Text } from "react-native-magnus";
import { fontHauoraMedium } from "@/constant/constant";
import ImageUpload from "@/components/partials/ImageUpload";

const PetImageUploadScreen = () => {
  return (
    <Div>
      <Text fontSize={32} lineHeight={40} color="#222222" mb={16}>
        Upload three images
      </Text>
      <Div mb={24} flexDir="row" style={{ gap: 12 }}>
        <ImageUpload isPrimary />
        <ImageUpload />
        <ImageUpload />
      </Div>
      <Text
        fontFamily={fontHauoraMedium}
        fontSize="md"
        lineHeight={20}
        color="#494949"
        maxW={350}
      >
        Please make sure to upload three high-quality images in JPEG format so
        that the vet can clearly see your dog's profile.
      </Text>
    </Div>
  );
};

export default PetImageUploadScreen;

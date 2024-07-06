import ImageUpload from "@/components/partials/ImageUpload";
import { fontHauoraMedium } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { UploadedFile } from "@/store/types/file";
import { PetPayloadDto } from "@/store/types/pet";
import { useState } from "react";
import { Div, Text } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
  pet: PetPayloadDto;
  setPet: (pet: PetPayloadDto) => void;
}

const PetProfileImageScreen: React.FC<Props> = (props) => {
  const [images, setImages] = useState<UploadedFile[]>([]);

  const handleImageChange = (files: UploadedFile[], index: number) => {
    const updatedPhotos = [...props.pet.photos];
    updatedPhotos[index] = files[0];

    setImages(updatedPhotos);

    props.setPet({ ...props.pet, photos: updatedPhotos });
  };

  return (
    <Div>
      <Text fontSize={32} lineHeight={40} color="#222222" mb={16}>
        Upload three images
      </Text>
      <Div mb={24} flexDir="row" style={{ gap: 12 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <ImageUpload
            key={index}
            isPrimary={index === 0}
            onChange={(files) => handleImageChange(files, index)}
          />
        ))}
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

export default PetProfileImageScreen;

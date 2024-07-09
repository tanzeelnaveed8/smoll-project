import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Div, Input, Text } from "react-native-magnus";
import * as ImagePicker from "expo-image-picker";
import { NavigationType } from "@/store/types";

const CaseBriefScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [image, setImage] = useState<null | string>(null);

  console.log("image", image);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result?.assets[0]?.uri);

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

      console.log("f", file);

      // const uploadedFile = await uploadFile([file]);

      // if (onChange) {
      //   onChange(uploadedFile);
      // }
    }
  };

  return (
    <Layout showCloseIcon backBtnText="" title="Case Brief">
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

        <InputField
          placeholder="e.g. my cat is vomiting and color is white......"
          multiline
          numberOfLines={6}
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
        onPress={() => {
          navigation.navigate("WaitingRoomScreen");
        }}
      >
        Connect
      </ButtonPrimary>
    </Layout>
  );
};

export default CaseBriefScreen;

import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { IconPlus, IconStarFilled } from "@tabler/icons-react-native";
import { Button, Div, Text } from "react-native-magnus";
import { fontHauoraSemiBold } from "@/constant/constant";

type PropTypes = {
  isPrimary?: Boolean;
  onChange?: (value: ImagePicker.ImagePickerResult) => void;
  uri?: string;
  plusIcon?: boolean;
  w?: number;
  h?: number;
};

const ImageUpload = (props: PropTypes) => {
  const {
    isPrimary = false,
    onChange,
    uri,
    plusIcon = true,
    w = 102,
    h = 100,
  } = props;
  const [image, setImage] = useState<null | string>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      onChange && onChange(result);
      setImage(result?.assets[0]?.uri);
    }
  };

  useEffect(() => {
    if (!uri) return;
    setImage(uri);
  }, [uri]);

  return image ? (
    <Button px={0} py={0} onPress={pickImage}>
      <Div w={w} h={h} rounded={8} bgImg={{ uri: image }} position="relative">
        {isPrimary && (
          <IconStarFilled
            size={21}
            fill="#85C3F1"
            style={{ position: "absolute", right: 8, bottom: 8 }}
          />
        )}
      </Div>
    </Button>
  ) : (
    <Button
      w={w}
      h={h}
      bg="#F4F6F8"
      rounded={8}
      position="relative"
      onPress={pickImage}
    >
      {plusIcon ? (
        <IconPlus size={32} color="#222222" strokeWidth={1.5} />
      ) : (
        <Text fontFamily={fontHauoraSemiBold} fontSize="xl" lineHeight={24}>
          Upload
        </Text>
      )}

      {isPrimary && (
        <IconStarFilled
          size={21}
          fill="#85C3F1"
          style={{ position: "absolute", left: 38, top: 38 }}
        />
      )}
    </Button>
  );
};

export default ImageUpload;

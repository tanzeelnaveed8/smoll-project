import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  IconEditCircle,
  IconPlus,
  IconProps,
  IconStarFilled,
  IconUser,
  IconX,
} from "@tabler/icons-react-native";
import { Button, Div, Text } from "react-native-magnus";
import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
import { useFileStore } from "@/store/modules/file";
import { UploadedFile } from "@/store/types/file";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface Props {
  isPrimary?: boolean;
  onChange?: (files: UploadedFile[]) => void;
  uri?: string;
  plusIcon?: boolean;
  userIcon?: boolean;
  w?: number;
  h?: number;
  editIcon?: boolean;
  onUnSelect?: (e: string) => void;
  hideUnselectBtn?: boolean;
  mr?: number;
  noImage?: boolean;
  disabled?: boolean;
  rounded?: number;
  bg?: string;
}

const ImageUpload: React.FC<Props> = ({
  isPrimary = false,
  onChange,
  uri,
  plusIcon = true,
  w = 102,
  h = 100,
  editIcon,
  onUnSelect,
  hideUnselectBtn,
  noImage,
  mr,
  disabled,
  rounded,
  bg,
  userIcon,
}) => {
  const { uploadFile } = useFileStore();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<null | string>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<null | string>(null);

  const pickImage = async () => {
    if (disabled) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) return;

    setImage(result?.assets[0]?.uri);
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    const localUri = result.assets[0]?.uri;
    const filename = localUri.split("/").pop() as string;

    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const file = { uri: localUri, name: filename, type } as unknown as File;

    try {
      setLoading(true);

      const uploadedFile = await uploadFile([file]);

      setUploadedFileUrl(uploadedFile[0].url);
      if (onChange) {
        onChange(uploadedFile);
      }
      if (noImage) {
        setImage(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!uri) return;
    setImage(uri);
  }, [uri]);

  const handleUnSelect = () => {
    if (onUnSelect && (uploadedFileUrl || uri)) {
      if (uri) {
        onUnSelect(uri);
      } else if (uploadedFileUrl) {
        onUnSelect(uploadedFileUrl);
      }
      setUploadedFileUrl(null);
      setImage(null);
    }
  };

  return (
    <Div alignItems="flex-start">
      <Div position="relative" mr={mr ? mr : 0}>
        {image ? (
          <Button
            px={0}
            rounded={rounded ? rounded : 0}
            py={0}
            onPress={pickImage}
            disabled={loading}
          >
            <Div
              w={w}
              h={h}
              rounded={8}
              bgImg={{ uri: image }}
              position="relative"
              alignItems="center"
              justifyContent="center"
            >
              {!hideUnselectBtn && (
                <Button
                  position="absolute"
                  zIndex={50}
                  top={2}
                  right={2}
                  p={2}
                  onPress={handleUnSelect}
                  bg="#00000061"
                >
                  <IconX width={24} height={24} color={"#fff"} />
                </Button>
              )}
              {isPrimary && (
                <IconStarFilled
                  size={21}
                  fill="#85C3F1"
                  style={{ position: "absolute", right: 8, bottom: 8 }}
                />
              )}
              {loading && (
                <ActivityIndicator size="large" color={colorPrimary} />
              )}
            </Div>
          </Button>
        ) : (
          <Button
            w={w}
            h={h}
            bg={bg ? bg : "#F4F6F8"}
            rounded={rounded ? rounded : 8}
            position="relative"
            onPress={pickImage}
          >
            {plusIcon ? (
              <IconPlus size={32} color="#222222" strokeWidth={1.5} />
            ) : userIcon ? (
              <IconUser size={64} color="#222222" strokeWidth={1.5} />
            ) : (
              <Text
                fontFamily={fontHauoraSemiBold}
                fontSize="xl"
                lineHeight={24}
              >
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
        )}

        {editIcon && image && (
          <Button
            w={32}
            h={32}
            rounded={49}
            bg="#E4E9EC"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            bottom={-10}
            right={-10}
            p={0}
            onPress={pickImage}
          >
            <IconEditCircle width={24} height={24} color={"#222"} />
          </Button>
        )}
      </Div>
    </Div>
  );
};

export default ImageUpload;

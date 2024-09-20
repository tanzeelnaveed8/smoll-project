import { useCallback, useEffect, useRef, useState } from "react";

import * as ImagePicker from "expo-image-picker";
import {
  IconDownload,
  IconEditCircle,
  IconPaperclip,
  IconPlus,
  IconProps,
  IconStarFilled,
  IconUser,
  IconX,
} from "@tabler/icons-react-native";
import {
  Button,
  Div,
  DropdownRef,
  Image,
  Modal,
  Text,
} from "react-native-magnus";
import {
  colorPrimary,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useFileStore } from "@/store/modules/file";
import { UploadedFile } from "@/store/types/file";
import DocumentPicker from "react-native-document-picker";

import RNFetchBlob from "rn-fetch-blob";

import {
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import DocumentTypeDropdown from "./DocumentTypeDropdown";

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
  openImageOnTab?: boolean;
  rounded?: number;
  bg?: string;
  document?: boolean;
  docType?: string;
  documentName?: string;
  onLoading?: (isLoading: boolean) => void;
  disableDownload?: boolean;
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
  openImageOnTab,
  document,
  docType,
  documentName,
  onLoading,
  disableDownload,
}) => {
  const { uploadFile } = useFileStore();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<null | string>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<null | string>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const optionMenuRef = useRef<DropdownRef>(null);

  const pickImage = async () => {
    if (disabled) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    // let result = await DocumentPicker.getDocumentAsync({
    //   type: ["image/*", "application/pdf"],
    // });

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
      if (onLoading) {
        onLoading(true);
      }

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
      if (onLoading) {
        onLoading(false);
      }
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

  const handleOpenImage = () => {
    setModalVisible(true);
  };

  const handleDocumentSelection = useCallback(async () => {
    if (disabled) return;

    try {
      const response = await DocumentPicker.pick({
        presentationStyle: "fullScreen",
        type: [DocumentPicker.types.pdf],
      });

      if (response[0].type?.includes("image")) {
        setImage(response[0].uri);
      }

      setLoading(true);
      if (onLoading) {
        onLoading(true);
      }

      const file = {
        uri: response[0].uri,
        name: response[0].name,
        type: response[0].type,
      } as unknown as File;

      const uploadedFile = await uploadFile([file]);

      setUploadedFileUrl(uploadedFile[0].url);
      if (onChange) {
        onChange(uploadedFile);
      }
      if (noImage) {
        setImage(null);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
      if (onLoading) {
        onLoading(false);
      }
    }
  }, []);

  // download file

  const actualDownload = () => {
    if (!uri) return;

    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS === "ios" ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: uri.split("/").pop(),
        path: `${dirs.DownloadDir}/${uri.split("/").pop()}`,
      },
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: uri.split("/").pop(),
      path: `${dirToSave}/${uri.split("/").pop()}`,
    };
    const configOptions = Platform.select({
      ios: configfb,
      android: configfb,
    });

    RNFetchBlob.config(configOptions || {})
      .fetch("GET", uri, {})
      .then((res) => {
        console.log("file res_-", configfb);

        if (Platform.OS === "ios") {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, "base64");
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        if (Platform.OS === "android") {
          console.log("file downloaded");
          Linking.openURL(configfb.path);
        }

        toast.show("File downloaded successfully");
      })
      .catch((e) => {
        console.log("file Download==>", e);
      });
  };

  const handleDownload = async () => {
    if (downloadLoading) return;
    try {
      setDownloadLoading(true);

      if (Platform.OS === "ios") {
        actualDownload();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            actualDownload();
          } else {
            console.log("please grant permission");
          }
        } catch (err) {
          console.log("display error", err);
        }
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <Div alignItems="flex-start">
      <Div position="relative" mr={mr ? mr : 0}>
        {image ? (
          <Button
            bg="transparent"
            px={0}
            rounded={rounded ? rounded : 0}
            py={0}
            onPress={() => {
              if (openImageOnTab) {
                handleOpenImage();
              } else {
                document ? handleDocumentSelection() : pickImage();
              }
            }}
            disabled={loading}
          >
            <Div
              w={w}
              h={h}
              rounded={8}
              bgImg={{
                uri: image,
              }}
              position="relative"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              {documentName && docType && !docType.includes("image") && (
                <Div
                  position="absolute"
                  top={0}
                  left={0}
                  w={"100%"}
                  h={"100%"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  bg="#ddd"
                  p={10}
                >
                  <Div justifyContent="center" alignItems="center">
                    <IconPaperclip size={44} color="#fff" />
                    {documentName && (
                      <Text
                        fontFamily={fontHauoraSemiBold}
                        textAlign="center"
                        lineHeight={16}
                        fontSize={12}
                        px={2}
                      >
                        {documentName.length > 22
                          ? `${documentName.slice(0, 22)}...`
                          : documentName}
                      </Text>
                    )}
                  </Div>
                </Div>
              )}
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
              {!disableDownload && (
                <Button
                  position="absolute"
                  zIndex={50}
                  top={2}
                  right={40}
                  p={2}
                  onPress={handleDownload}
                  bg="#00000061"
                  // disabled={downloadLoading}
                >
                  {downloadLoading ? (
                    <ActivityIndicator
                      size="small"
                      style={{ width: 24, height: 24 }}
                      color={"#fff"}
                    />
                  ) : (
                    <IconDownload width={24} height={24} color={"#fff"} />
                  )}
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
            bg={bg ? bg : "#ddd"}
            rounded={rounded ? rounded : 8}
            position="relative"
            disabled={loading}
            onPress={() => {
              if (document) {
                if ("current" in optionMenuRef && optionMenuRef.current) {
                  optionMenuRef.current.open();
                }
              } else {
                pickImage();
              }
              // document ? handleDocumentSelection() : pickImage();
            }}
          >
            {loading && <ActivityIndicator size="large" color={colorPrimary} />}
            {!loading && (
              <>
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
              </>
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
            bottom={-7}
            right={-8}
            p={0}
            onPress={() => {
              if (document) {
                if ("current" in optionMenuRef && optionMenuRef.current) {
                  optionMenuRef.current.open();
                }
              } else {
                pickImage();
              }
              // document ? handleDocumentSelection() : pickImage();
            }}
          >
            <IconEditCircle width={24} height={24} color={"#222"} />
          </Button>
        )}
      </Div>

      <DocumentTypeDropdown
        ref={optionMenuRef}
        onSelect={(value) => {
          if (value === "Browse") {
            handleDocumentSelection();
          } else {
            pickImage();
          }
        }}
      />

      <Modal
        isVisible={modalVisible}
        // h={"100%"}
        bg="transparent"
        onSwipeCancel={() => setModalVisible(false)}
        onSwipeMove={() => setModalVisible(false)}
        swipeDirection={"down"}
      >
        <Div flex={1}>
          {image && (
            <Div
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Image
                source={{ uri: image }} // Display the selected image
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
            </Div>
          )}
        </Div>
      </Modal>
    </Div>
  );
};

export default ImageUpload;

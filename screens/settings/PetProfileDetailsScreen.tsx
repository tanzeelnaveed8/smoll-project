import Layout from "@/components/app/Layout";
import ImageUpload from "@/components/partials/ImageUpload";
import {
  colorPrimary,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";
import ProfileOptionButton from "./ProfileOptionButton";
import AddButton from "@/components/partials/AddButton";
import { useRoute } from "@react-navigation/native";
import { usePetStore } from "@/store/modules/pet";
import { PetDetail } from "@/store/types/pet";
import { UploadedFile } from "@/store/types/file";
import { useToast } from "react-native-toast-notifications";
import { showMessage } from "react-native-flash-message";

const btns = ["Basic Details", "Health History", "Cases"];

const healthHistoryDat = [
  { name: "DA2PP Vaccination" },
  { name: "DA2PP Vaccination" },
  { name: "DA2PP Vaccination" },
];

type RouteType = { petId: string };

const PetProfileDetailsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const toast = useToast();
  const id = (route.params as RouteType)?.petId;
  const { petsDetailMap, fetchPetDetails, updatePet } = usePetStore();
  const [profileImg, setProfileImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const petDetailsData = petsDetailMap.get(id);
  const [activeTab, setActiveTab] = useState(btns[0]);

  useEffect(() => {
    if (!id) return;
    console.log("running use Effect");

    const fetchData = async () => {
      const data = petsDetailMap.get(id);
      try {
        setLoading(true);

        if (!data) {
          await fetchPetDetails(id);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, petsDetailMap, id && petsDetailMap.get(id)]);

  useEffect(() => {
    if (!petDetailsData) return;

    for (let i = 0; i < petDetailsData.photos.length; i++) {
      const image = petDetailsData.photos[i];
      if (image && image.url) {
        setProfileImg(image.url);
        break;
      }
    }
  }, [petDetailsData]);

  const handleUpdateImage = async (file: UploadedFile[]) => {
    if (!petDetailsData) return;
    console.log("handleUpdateImage files", file);

    const filesArr = [...file, ...petDetailsData?.photos];

    try {
      setImageLoading(true);

      await updatePet(id, { photos: filesArr });

      toast.show("Pet Profile Image updated successfully");
    } finally {
      setImageLoading(false);
    }
  };

  const petDetails = [
    {
      title: "Name",
      value: petDetailsData?.name,
      link: "PetEditInfoScreen",
      fileName: "name",
    },
    {
      title: "Date of Birth",
      value: petDetailsData?.dob,
      link: "PetEditInfoScreen",
      fileName: "dob",
    },
    {
      title: "Weight",
      value: `${petDetailsData?.weight} kg`,
      link: "EditInfoScreen",
      heading: "Please enter pet's Weight",
      placeholder: "Weight",
      fieldKey: "weight",
      dataValue: petDetailsData?.weight,
    },
    {
      title: "Species",
      value: petDetailsData?.species,
      link: "PetEditInfoScreen",
      fileName: "species",
    },
    {
      title: "Gender",
      value: petDetailsData?.gender,
      link: "PetEditInfoScreen",
      fileName: "gender",
    },
    {
      title: "Breed",
      value: petDetailsData?.breed,
      link: "PetEditInfoScreen",
      fileName: "breed",
    },
    {
      title: "Chip Number (Optional)",
      value: petDetailsData?.chipNumber,
      link: "EditInfoScreen",
      heading: "Please add Pet's Chip Number",
      placeholder: "Chip Number",
      fieldKey: "chipNumber",
      dataValue: petDetailsData?.chipNumber,
    },
    {
      title: "Spayed/Neutered",
      value: petDetailsData?.spayedOrNeutered ? "Yes" : "No",
      link: "PetEditInfoScreen",
      fileName: "spayed/neutered",
    },
    {
      title: "Any Pre-Existing Conditions",
      value: "Add Conditions",
    },
  ];

  return (
    <Layout
      showBack
      title="Profile"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      {!loading && (
        <Div flex={1} pt={20}>
          <Div flexDir="row" alignItems="center" mb={35}>
            <Div
              w={118}
              h={115}
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Image
                source={require("../../assets/images/pet-profile-bg.png")}
                position="absolute"
                w={"100%"}
                h={"100%"}
                style={{}}
              />

              <Div mx={"auto"}>
                <ImageUpload
                  h={92}
                  w={93}
                  editIcon
                  uri={profileImg}
                  onChange={handleUpdateImage}
                />
              </Div>
            </Div>
            <Text fontSize={"4xl"} fontFamily={fontHauoraMedium} ml={14}>
              {petDetailsData?.name}
            </Text>
          </Div>

          <Div flexDir="row" style={{ gap: 24 }} position="relative" mb={20}>
            {btns.map((item) => (
              <TouchableOpacity
                key={item}
                style={{}}
                onPress={() => {
                  setActiveTab(item);
                }}
              >
                <Button
                  key={item}
                  py={0}
                  flexDir="column"
                  px={4}
                  bg="transparent"
                  pointerEvents="none"
                >
                  <Text
                    fontSize={"lg"}
                    fontFamily={fontHauoraSemiBold}
                    mb={8}
                    color={activeTab === item ? "#222" : "darkGreyText"}
                  >
                    {item}
                  </Text>

                  {item === activeTab && (
                    <Div
                      h={7}
                      bg={true ? "#427594" : "transparent"}
                      w={"100%"}
                      style={{
                        borderTopRightRadius: 4,
                        borderTopLeftRadius: 4,
                      }}
                    />
                  )}
                </Button>
              </TouchableOpacity>
            ))}

            <Div
              borderBottomWidth={1}
              borderBottomColor="#D0D7DC"
              h={4}
              w={"200%"}
              position="absolute"
              bottom={0}
              left={-100}
            />
          </Div>

          {activeTab === btns[0] && (
            <FlatList
              data={petDetails}
              renderItem={({ item }) => (
                <ProfileOptionButton
                  title={item.title}
                  value={item.value}
                  editable
                  onEdit={() => {
                    if (item.fileName) {
                      navigation.navigate(item.link, {
                        petId: id,
                        fileName: item.fileName,
                      });
                    }

                    if (item.heading) {
                      navigation.navigate(item.link, {
                        heading: item.heading,
                        placeholder: item.placeholder,
                        fieldKey: item.fieldKey,
                        value: `${item.dataValue || ""}`,
                        petId: id,
                      });
                    }
                  }}
                />
              )}
              keyExtractor={(item, i) => `${i}`}
            />
          )}

          {activeTab === btns[1] && (
            <Div>
              {petDetailsData?.healthHistory && (
                <FlatList
                  style={{ marginBottom: 32 }}
                  data={petDetailsData?.healthHistory}
                  renderItem={({ item, index }) => (
                    <HealthHistoryCard
                      mb={index + 1 === healthHistoryDat.length ? 0 : 12}
                    />
                  )}
                  keyExtractor={(item, index) => `${index}`}
                />
              )}

              <AddButton text="Add Health History" />
            </Div>
          )}
        </Div>
      )}

      {loading && (
        <Div flex={1} justifyContent="center">
          <ActivityIndicator size="large" color={colorPrimary} />
        </Div>
      )}
    </Layout>
  );
};

export default PetProfileDetailsScreen;

const HealthHistoryCard: React.FC<{ mb?: number }> = ({ mb }) => {
  return (
    <Div
      flexDir="row"
      justifyContent="space-between"
      py={12}
      borderBottomWidth={1}
      borderColor="#E0E0E0"
      mb={typeof mb === "number" ? mb : 0}
    >
      <Div>
        <Text fontSize={"sm"} fontFamily={fontHauoraMedium}>
          Title
        </Text>
        <Text fontSize={"xl"} fontFamily={fontHauoraMedium}>
          DA2PP Vaccination
        </Text>
      </Div>

      <Button p={0} bg="transparent" color="#f10" alignSelf="center">
        Delete
      </Button>
    </Div>
  );
};

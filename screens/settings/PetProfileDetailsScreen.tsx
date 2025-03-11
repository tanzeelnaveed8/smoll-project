import Layout from "@/components/app/Layout";
import ImageUpload from "@/components/partials/ImageUpload";
import {
  colorErrorText,
  colorPrimary,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import {
  Button,
  Div,
  DropdownRef,
  Image,
  Tag,
  Text,
} from "react-native-magnus";
import ProfileOptionButton from "./ProfileOptionButton";
import AddButton from "@/components/partials/AddButton";
import { useRoute } from "@react-navigation/native";
import { usePetStore } from "@/store/modules/pet";
import { HealthHistory, PetDetail } from "@/store/types/pet";
import { UploadedFile } from "@/store/types/file";
import { useToast } from "react-native-toast-notifications";
import { showMessage } from "react-native-flash-message";
import ConfirmationModal from "@/components/partials/ConfirmationModal";
import { IconDots } from "@tabler/icons-react-native";
import Dropdown from "@/components/partials/Dropdown";
import HealthHistoryModal from "@/components/app/pet/HealthHistoryModal";

const btns = ["Basic Details", "Health History"];

type RouteType = { petId: string };

const PetProfileDetailsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const toast = useToast();
  const id = (route.params as RouteType)?.petId;
  const {
    petsDetailMap,
    fetchPetDetails,
    updatePet,
    deleteHealthHistory,
    deletePet,
  } = usePetStore();
  // const [healthHistoryDataState, setHealthHistoryDataState] = useState<
  //   HealthHistory[] | null
  // >(null);

  const optionMenuRef = useRef<DropdownRef>(null);
  const [profileImg, setProfileImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [deleteHealthHistoryLoading, setDeleteHealthHistoryLoading] =
    useState("");
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [showDeletePetModal, setShowDeletePetModal] = useState(false);
  const [deletePetLoading, setDeletePetLoading] = useState(false);

  const petDetailsData = petsDetailMap.get(id);
  const healthHistoryDataState = petsDetailMap.get(id)?.healthHistory;

  const [activeTab, setActiveTab] = useState(btns[0]);

  const [open, setOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [healthHistoryId, setHealthHistoryId] = useState("");

  useEffect(() => {
    if (!id) return;

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

  // useEffect(() => {
  //   if (petDetailsData && petDetailsData.healthHistory) {
  //     setHealthHistoryDataState(petDetailsData.healthHistory);
  //   }
  // }, []);

  const handleUpdateImage = async (file: UploadedFile[]) => {
    if (!petDetailsData) return;

    const filesArr = [...file, ...petDetailsData?.photos];

    try {
      setImageLoading(true);

      await updatePet(id, { photos: filesArr });

      toast.show("Pet Profile Image updated successfully");
    } finally {
      setImageLoading(false);
    }
  };

  const deleteHealthHistoryHandler = async () => {
    const historyId = showDeleteModal;
    // if (!healthHistoryDataState) return;
    try {
      setDeleteHealthHistoryLoading(historyId);
      await deleteHealthHistory(id, historyId);

      // const updatedHealthHistoryState = healthHistoryDataState.filter(
      //   (item) => item.id?.toString() !== historyId
      // );
      // console.log("updatedHealthHistoryState", updatedHealthHistoryState);
      // setHealthHistoryDataState(updatedHealthHistoryState);
    } finally {
      setDeleteHealthHistoryLoading("");
      setShowDeleteModal("");
    }
  };
  // deleteHealthHistoryHandler(`${item.id}`);

  const petDetails = [
    {
      title: "Name",
      value: petDetailsData?.name,
      link: "PetEditInfoScreen",
      fileName: "name",
    },
    {
      title: "Age",
      value: petDetailsData?.age,
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
      value: petDetailsData?.preExistingConditions,
      link: "EditInfoScreen",
      heading: "Any Pre-Existing Conditions",
      placeholder: "Pre-Existing Conditions",
      fieldKey: "preExistingConditions",
      dataValue: petDetailsData?.preExistingConditions,
    },
  ];

  const handleMenuDropdownSelect = (value: string) => {
    setTimeout(() => {
      if (value === "Delete Pet") {
        setShowDeletePetModal(true);
      }

      if (value === "Deceased") {
        handleUpdateDeceased();
      }
    }, 500);
  };

  const handleUpdateDeceased = async () => {
    if (!petDetailsData) return;
    try {
      const updatedValue = petDetailsData?.isDeceased ? false : true;
      await updatePet(id, { isDeceased: updatedValue });
    } finally {
      setDeletePetLoading(false);
    }
  };

  const handleDeletePet = async () => {
    try {
      setDeletePetLoading(true);
      await deletePet(id);

      navigation.navigate("PetProfileListScreen");
    } finally {
      setDeletePetLoading(false);
    }
  };

  return (
    <Layout
      showBack
      title="Profile"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      {!loading && (
        <Div flex={1}>
          <Div flexDir="row" alignItems="center" mb={35}>
            <Div
              w={118}
              h={115}
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Div mx={"auto"}>
                <ImageUpload
                  h={92}
                  w={93}
                  editIcon
                  rounded={100}
                  uri={profileImg}
                  hideUnselectBtn
                  openImageOnTab
                  onChange={handleUpdateImage}
                  disableDownload
                />
              </Div>
            </Div>
            <Div ml={14}>
              <Text fontSize={"4xl"} fontFamily={fontHauoraMedium}>
                {petDetailsData?.name}
              </Text>

              {petDetailsData?.isDeceased && (
                <Tag
                  fontSize={"md"}
                  mt={8}
                  p={0}
                  bg={colorErrorText}
                  color="#fff"
                >
                  Deceased
                </Tag>
              )}
            </Div>
          </Div>

          <Div flexDir="row" position="relative" mb={20}>
            {btns.map((item) => (
              <TouchableOpacity
                key={item}
                style={{ marginRight: 24 }}
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

            <TouchableOpacity
              style={{ marginLeft: "auto" }}
              onPress={() => {
                if ("current" in optionMenuRef && optionMenuRef.current) {
                  optionMenuRef.current.open();
                }
              }}
            >
              <IconDots width={26} height={26} color={"#222"} />
            </TouchableOpacity>

            <Dropdown
              ref={optionMenuRef}
              onSelect={handleMenuDropdownSelect}
              isDeceased={petDetailsData?.isDeceased ?? false}
            />

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
              showsVerticalScrollIndicator={false}
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
              {healthHistoryDataState && healthHistoryDataState.length > 0 && (
                <FlatList
                  style={{ marginBottom: 32 }}
                  data={healthHistoryDataState}
                  renderItem={({ item, index }) => (
                    <HealthHistoryCard
                      onOpen={() => {
                        if (!petDetailsData) return;

                        setOpen(true);
                        setSelectedPetId(id || "");
                        setHealthHistoryId(item.id || "");

                        // navigation.navigate("PetProfileMedicalHistoryScreen", {
                        //   navigateTo: "PetProfileDetailsScreen",
                        //   petId: id ?? "",
                        //   petName: petDetailsData.name,
                        //   petBg: petDetailsData.photos[0]?.url,
                        //   showBackBtn: "true",
                        //   historyId: item.id,
                        // });
                      }}
                      isLoading={
                        item.id?.toString() === deleteHealthHistoryLoading
                      }
                      name={item.name}
                      onDelete={() => setShowDeleteModal(`${item.id}`)}
                      mb={index + 1 === healthHistoryDataState.length ? 0 : 12}
                    />
                  )}
                  keyExtractor={(item, index) => `${index}`}
                />
              )}

              <AddButton
                text="Add New Record"
                onPress={() => {
                  if (!petDetailsData) return;

                  navigation.navigate("PetProfileMedicalHistoryScreen", {
                    navigateTo: "PetProfileDetailsScreen",
                    petId: id ?? "",
                    petName: petDetailsData.name,
                    petBg: petDetailsData.photos[0]?.url,
                    showBackBtn: "true",
                  });
                }}
              />

              <HealthHistoryModal
                open={open}
                onClose={() => {
                  setOpen(false);
                  setSelectedPetId("");
                  setHealthHistoryId("");
                }}
                petId={selectedPetId}
                healthHistoryId={healthHistoryId}
              />
            </Div>
          )}
        </Div>
      )}

      <ConfirmationModal
        heading="Delete Health History"
        text="Are you sure you want to delete this health history?"
        isLoading={deleteHealthHistoryLoading === showDeleteModal}
        showModal={showDeleteModal ? true : false}
        onClose={() => setShowDeleteModal("")}
        onConfirm={deleteHealthHistoryHandler}
        confirmText="Confirm"
        cancelText="Cancel"
        confirmBgColor={colorErrorText}
      />

      <ConfirmationModal
        heading="Delete Pet"
        text="Are you sure you want to delete this pet? Deleting it will remove all the data associated with it, even your bookings."
        isLoading={deletePetLoading}
        height={365}
        showModal={showDeletePetModal}
        onClose={() => setShowDeletePetModal(false)}
        onConfirm={handleDeletePet}
        confirmText="Confirm"
        cancelText="Cancel"
        confirmBgColor={colorErrorText}
      />

      {loading && (
        <Div flex={1} justifyContent="center">
          <ActivityIndicator size="large" color={colorPrimary} />
        </Div>
      )}
    </Layout>
  );
};

export default PetProfileDetailsScreen;

const HealthHistoryCard: React.FC<{
  mb?: number;
  onDelete: () => void;
  name: string;
  isLoading: boolean;
  onOpen: () => void;
}> = ({ mb, onDelete, name, isLoading, onOpen }) => {
  return (
    <Div
      flexDir="row"
      justifyContent="space-between"
      py={12}
      borderBottomWidth={1}
      borderColor="#E0E0E0"
      mb={typeof mb === "number" ? mb : 0}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={onOpen}>
        <Text fontSize={"sm"} fontFamily={fontHauoraMedium}>
          Title
        </Text>
        <Text fontSize={"xl"} fontFamily={fontHauoraMedium}>
          {name}
        </Text>
      </TouchableOpacity>

      <Button
        p={0}
        bg="transparent"
        color="#f10"
        alignSelf="center"
        onPress={onDelete}
        pr={isLoading ? 10 : 0}
        loading={isLoading}
        loaderColor="#222"
      >
        Delete
      </Button>
    </Div>
  );
};

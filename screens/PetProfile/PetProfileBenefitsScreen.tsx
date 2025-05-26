import Layout from "@/components/app/Layout";
import ImageUpload from "@/components/partials/ImageUpload";
import {
  colorErrorText,
  colorPrimary,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { Button, Div, DropdownRef, Image, Tag, Text } from "react-native-magnus";
import AddButton from "@/components/partials/AddButton";
import { useRoute } from "@react-navigation/native";
import { usePetStore } from "@/store/modules/pet";
import { useToast } from "react-native-toast-notifications";
import SubscriptionBenefitsList from "@/components/app/subscription/SubscriptionBenefitsList";
import PlanCTA from "../Subscription/PlanCTA";

type RouteType = { petId: string };

const planFeatures = [
  {
    label: "Grooming",
    sessions: 4,
    ussageCount: 0,
  },
  { label: "Nail Trim", sessions: 2, ussageCount: 0 },
  {
    label: "Expert tips",
    sessions: 1,
    ussageCount: 0,
  },
  {
    label: "Consultations",
    sessions: 4,
    ussageCount: 0,
  },
  {
    label: "Vet Calls",
    sessions: 4,
    ussageCount: 0,
  },
  {
    label: "Deworming",
    sessions: 2,
    ussageCount: 0,
  },
  {
    label: "Dental check up",
    sessions: 3,
    ussageCount: 0,
  },
  {
    label: "Ear cleaning",
    sessions: 3,
    ussageCount: 0,
  },
  {
    label: "Free wellness checkup",
    sessions: 1,
    ussageCount: 0,
  },
  {
    label: "Blood test",
    sessions: 2,
    ussageCount: 0,
  },
  {
    label: "Urine test",
    sessions: 1,
    ussageCount: 0,
  },
  {
    label: "Microchipping",
    sessions: 1,
    ussageCount: 0,
  },
];

const PetProfileBenefitsScreen: React.FC<{ navigation: NavigationType }> = ({ navigation }) => {
  const route = useRoute();
  const toast = useToast();
  const id = (route.params as RouteType)?.petId;
  const { petsDetailMap, fetchPetDetails } = usePetStore();
  const [profileImg, setProfileImg] = useState("");
  const [loading, setLoading] = useState(false);
  const petDetailsData = petsDetailMap.get(id);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const data = petsDetailMap.get(id);
      try {
        setLoading(true);

        if (!data) {
          await fetchPetDetails(id);
          //IF PET IS SMOLLCARE MEMBER
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

  const handleOnEnrollPress = () => {
    navigation.navigate("paymentSuccess");
  };

  return (
    <Layout
      showBack
      title="Benefits"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      {!loading && (
        <>
          <Div>
            <Div flexDir="row" alignItems="center" mb={26}>
              <Div w={118} h={115} justifyContent="flex-end" alignItems="flex-end">
                <Div mx={"auto"}>
                  <ImageUpload
                    h={92}
                    w={93}
                    rounded={100}
                    uri={profileImg}
                    hideUnselectBtn
                    openImageOnTab
                    disableDownload
                  />
                </Div>
              </Div>
              <Div ml={14} mt={16}>
                <Div>
                  <Text fontSize={"4xl"} fontFamily={fontHauoraSemiBold}>
                    {petDetailsData?.name}
                  </Text>
                  <Text fontSize="xl" color="#565656" fontFamily={fontHauoraSemiBold}>
                    179-188-C23
                  </Text>
                </Div>

                {petDetailsData?.isDeceased && (
                  <Tag fontSize={"md"} mt={8} p={0} bg={colorErrorText} color="#fff">
                    Deceased
                  </Tag>
                )}
              </Div>
            </Div>
          </Div>
          <SubscriptionBenefitsList planFeatures={planFeatures} />
          <PlanCTA petName={petDetailsData?.name} onEnrollPress={handleOnEnrollPress} />
        </>
      )}
      {loading && (
        <Div flex={1} justifyContent="center">
          <ActivityIndicator size="large" color={colorPrimary} />
        </Div>
      )}
    </Layout>
  );
};

export default PetProfileBenefitsScreen;

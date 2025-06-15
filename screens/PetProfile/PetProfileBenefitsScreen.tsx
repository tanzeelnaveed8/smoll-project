import Layout from "@/components/app/Layout";
import ImageUpload from "@/components/partials/ImageUpload";
import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Div, Image, Text } from "react-native-magnus";
import { useRoute } from "@react-navigation/native";
import { usePetStore } from "@/store/modules/pet";
import PlanCTA from "../Subscription/PlanCTA";
import BackButton from "@/components/partials/BackButton";
import BenefitsList from "@/components/app/subscription/BenefitsList";
import { Benefit } from "@/store/types/pet";

type RouteType = { petId: string };

const PetProfileBenefitsScreen: React.FC<{ navigation: NavigationType }> = ({ navigation }) => {
  const route = useRoute();
  const id = (route.params as RouteType)?.petId;
  const { petsDetailMap, fetchPetDetails } = usePetStore();
  const [profileImg, setProfileImg] = useState("");
  const [loading, setLoading] = useState(false);
  const petDetailsData = petsDetailMap.get(id);
  const { plan } = usePetStore();

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

  const renderHeader = () => (
    <>
      <Div flexDir="row" alignItems="center" mt={12}>
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
          showCloseIcon={false}
        />
        <Div flexDir="row" alignItems="center" ml={12}>
          <Div alignItems="center">
            <Div mx={"auto"}>
              <ImageUpload
                h={54}
                w={54}
                docType="image/"
                rounded={100}
                uri={profileImg}
                hideUnselectBtn
                openImageOnTab
                disableDownload
              />
            </Div>
          </Div>
          <Div ml={24}>
            <Text
              lineHeight={24}
              fontSize={"4xl"}
              fontFamily={fontHauoraSemiBold}
              ellipsizeMode="tail"
              numberOfLines={1}
              maxW={200}
            >
              {petDetailsData?.name}
            </Text>
          </Div>
        </Div>
      </Div>

      <Div flexDir="row" alignSelf="center" mt={38} mb={38}>
        <Div flexDir="row" alignItems="center">
          <Image source={require("@/assets/images/congratulation-tick.png")} w={46} h={46} />
          <Div h={42} ml={12}>
            <Image source={require("@/assets/icons/smollcare-logo.png")} w={122} h={22} />
            <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} numberOfLines={2} maxW={300}>
              {petDetailsData?.name} will receive the below
            </Text>
          </Div>
        </Div>
      </Div>
    </>
  );

  const renderFooter = () => (
    <PlanCTA
      petName={petDetailsData?.name}
      onButtonPress={() => {
        navigation.replace("PetProfileSmollcarePaymentScreen", {
          pet: petDetailsData,
          planPrice: plan?.price,
        });
      }}
    />
  );

  return (
    <Layout disableHeader style={{ flex: 1 }}>
      {!loading && (
        <FlatList
          data={[{ key: "benefits" }]}
          renderItem={() => <BenefitsList planFeatures={plan?.benefits as Benefit[]} />}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
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

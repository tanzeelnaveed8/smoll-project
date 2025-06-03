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
import { Button, Div, DropdownRef, Image, Tag, Text } from "react-native-magnus";
import AddButton from "@/components/partials/AddButton";
import { useRoute } from "@react-navigation/native";
import { usePetStore } from "@/store/modules/pet";
import { useToast } from "react-native-toast-notifications";
import SubscriptionBenefitsList from "@/components/app/subscription/SubscriptionBenefitsList";
import PlanCTA from "../Subscription/PlanCTA";
import { initPaymentSheet, presentPaymentSheet, StripeProvider } from "@stripe/stripe-react-native";
import { useUserStore } from "@/store/modules/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetupParams } from "@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet";
import { showMessage } from "react-native-flash-message";
import FlashCustomContent from "@/components/partials/FlashCustomContent";

type RouteType = { petId: string };

const PetProfileBenefitsScreen: React.FC<{ navigation: NavigationType }> = ({ navigation }) => {
  const route = useRoute();
  const toast = useToast();
  const id = (route.params as RouteType)?.petId;

  const { user } = useUserStore();
  const paymentIntentRef = useRef<string | undefined>(undefined);
  const [envs, setEnvs] = useState<any>(null);
  const paymentIntentId = "";

  const { petsDetailMap, fetchPetDetails } = usePetStore();
  const [profileImg, setProfileImg] = useState("");
  const [loading, setLoading] = useState(false);
  const petDetailsData = petsDetailMap.get(id);
  const { benefits, buySubscription } = usePetStore();
  const [btnLoader, setBtnLoader] = useState(false);

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

  const initStripe = async () => {
    setLoading(true);

    setEnvs(JSON.parse((await AsyncStorage.getItem("envs")) as string));

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const { ephemeralKey, paymentIntent, paymentIntentClientSecret } = await buySubscription(id);

      paymentIntentRef.current = paymentIntent;

      const { error } = await initPaymentSheet({
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntentClientSecret,
        merchantDisplayName: "Smoll",
        customerId: user!.stripeCustomerId,
        applePay: {
          merchantCountryCode: "AE",
        },
        defaultBillingDetails: {
          name: user?.name,
        },
        appearance: {
          shapes: {
            borderRadius: 12,
            borderWidth: 0.5,
          },
          primaryButton: {
            colors: {
              background: "#000000",
              text: "#ffffff",
            },
            shapes: {
              borderRadius: 20,
            },
          },
          colors: {
            primary: "#000000",
            background: "#ffffff",
            componentBackground: "#f3f8fa",
            componentBorder: "#f3f8fa",
            componentDivider: "#000000",
            primaryText: "#000000",
            secondaryText: "#000000",
            componentText: "#000000",
            placeholderText: "#73757b",
          },
        },
      } as SetupParams);

      if (error) {
        console.error("Stripe initialization error:", error);
        showMessage({
          message: "",
          renderCustomContent: () => (
            <FlashCustomContent message={`Stripe error: ${error.message}`} />
          ),
          type: "danger",
        });

        navigation.goBack();
      }
    } catch (error) {
      console.error("Error initializing Stripe:", error);
      showMessage({
        message: "",
        renderCustomContent: () => (
          <FlashCustomContent message="Failed to initialize payment. Please try again." />
        ),
        type: "danger",
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const initialize = async () => {
    if (paymentIntentId) {
      paymentIntentRef.current = paymentIntentId;
    } else {
      await initStripe();
    }
  };

  const openPaymentSheet = async () => {
    setBtnLoader(true);
    const { error } = await presentPaymentSheet();

    if (error) {
      setBtnLoader(false);
      showMessage({
        message: "",
        renderCustomContent: () => (
          <FlashCustomContent message="Could not process payment, please try again" />
        ),
        type: "danger",
      });

      return;
    }
    //On Success
    await fetchPetDetails(id);

    await new Promise((resolve: any) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
    setBtnLoader(false);

    navigation.replace("paymentSuccess", {
      petId: id,
      petName: petDetailsData?.name,
    });
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <StripeProvider
      publishableKey={envs?.STRIPE_PUBLISHABLE_KEY ?? ""}
      merchantIdentifier="merchant.me.smoll.smollapp" // required for Apple Pay
    >
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
                      docType="image/"
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
                  </Div>
                </Div>
              </Div>
            </Div>
            <SubscriptionBenefitsList planFeatures={benefits} petName={petDetailsData?.name} />
            <PlanCTA
              loading={btnLoader}
              petName={petDetailsData?.name}
              onEnrollPress={openPaymentSheet}
            />
          </>
        )}
        {loading && (
          <Div flex={1} justifyContent="center">
            <ActivityIndicator size="large" color={colorPrimary} />
          </Div>
        )}
      </Layout>
    </StripeProvider>
  );
};

export default PetProfileBenefitsScreen;

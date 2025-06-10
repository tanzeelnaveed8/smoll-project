import Layout from "@/components/app/Layout";
import BackButton from "@/components/partials/BackButton";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import FlashCustomContent from "@/components/partials/FlashCustomContent";
import ImageUpload from "@/components/partials/ImageUpload";
import {
  colorPrimary,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { usePetStore } from "@/store/modules/pet";
import { useUserStore } from "@/store/modules/user";
import { PetDetail } from "@/store/types/pet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { initPaymentSheet, presentPaymentSheet, StripeProvider } from "@stripe/stripe-react-native";
import { SetupParams } from "@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Div, Image, Text } from "react-native-magnus";
import { useToast } from "react-native-toast-notifications";

type RouteType = { pet: PetDetail };

export default function PetProfileSmollcarePayementScreen() {
  const { user } = useUserStore();
  const { fetchPetDetails } = usePetStore();

  const navigation = useNavigation();
  const toast = useToast();
  const route = useRoute();
  const petDetailsData = (route.params as RouteType)?.pet;
  const paymentIntentRef = useRef<string | undefined>(undefined);
  const [envs, setEnvs] = useState<any>(null);
  const paymentIntentId = "";

  const [loading, setLoading] = useState(false);
  const [profileImg, setProfileImg] = useState("");

  const { buySubscription } = usePetStore();
  const [btnLoader, setBtnLoader] = useState(false);

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
      const { ephemeralKey, paymentIntent, paymentIntentClientSecret } = await buySubscription(
        petDetailsData.id as string
      );

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
    await fetchPetDetails(petDetailsData.id as string);

    await new Promise((resolve: any) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
    setBtnLoader(false);

    navigation.replace("paymentSuccess", {
      petId: petDetailsData.id as string,
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
      <Layout disableHeader style={{ flex: 1 }}>
        {!loading && (
          <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "space-between" }}>
            <Div alignItems="flex-end" w={"100%"}>
              <BackButton
                onPress={() => {
                  navigation.goBack();
                }}
                showCloseIcon={true}
              />
              <Div mt={42} px={18} w={"100%"}>
                <Div
                  justifyContent="space-between"
                  h={200}
                  rounded={14}
                  bg="#6e99f0"
                  py={20}
                  px={30}
                >
                  <Div flexDir="row" alignItems="center">
                    <ImageUpload
                      h={66}
                      w={66}
                      docType="image/"
                      rounded={100}
                      uri={profileImg}
                      hideUnselectBtn
                      openImageOnTab
                      disableDownload
                    />
                    <Text ml={14} mb={6} color="#fff" fontSize={"4xl"} fontFamily={fontHauoraBold}>
                      {petDetailsData?.name}
                    </Text>
                  </Div>
                  <Image
                    source={require("@/assets/icons/smollcare-member-logo.png")}
                    w={140}
                    h={52}
                  />
                </Div>
                <Div mt={32} px={30}>
                  <Div borderBottomWidth={1} borderColor="#dbdad7" pb={18}>
                    <Text fontSize="2xl" fontFamily={fontHauoraMedium}>
                      {petDetailsData.name}'s Wellness Plan
                    </Text>
                    <Div
                      flexDir="row"
                      alignItems="flex-start"
                      style={{
                        gap: 24,
                      }}
                      mt={16}
                    >
                      <Div>
                        <Text fontSize={"4xl"} fontFamily={fontHauoraBold}>
                          12
                        </Text>
                        <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                          Months
                        </Text>
                      </Div>

                      <Text fontSize={"4xl"} fontFamily={fontHauoraBold}>
                        x
                      </Text>

                      <Div>
                        <Div flexDir="row" alignItems="flex-end">
                          <Text fontSize={"4xl"} fontFamily={fontHauoraBold}>
                            AED125
                          </Text>
                          <Text ml={8} fontFamily={fontHauoraSemiBold}>
                            (Vat Included)
                          </Text>
                        </Div>

                        <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                          Per month
                        </Text>
                      </Div>
                    </Div>
                  </Div>
                  <Div mt={12}>
                    <Text fontSize={"xl"} fontFamily={fontHauoraMedium}>
                      Due today
                    </Text>
                    <Text fontFamily={fontHauoraMedium} color="#6e99f0" fontSize={"6xl"}>
                      AED 1499.00
                    </Text>
                  </Div>
                </Div>
                <Div mt={30}>
                  <ButtonPrimary
                    onPress={openPaymentSheet}
                    disabled={btnLoader}
                    loading={btnLoader}
                    bg="#2b44ff"
                    fontFamily={fontHauoraSemiBold}
                  >
                    Enroll {petDetailsData.name} in smoll® Care now!
                  </ButtonPrimary>
                  <Text
                    color="#494949"
                    textAlign="center"
                    mt={10}
                    fontSize={"lg"}
                    fontFamily={fontHauoraMedium}
                  >
                    Cancel anytime
                  </Text>
                </Div>
              </Div>
            </Div>

            <Div mb={12}>
              <Div flexDir="row" justifyContent="center">
                <Text
                  fontSize={"lg"}
                  textAlign="center"
                  color="#585858"
                  fontFamily={fontHauoraMedium}
                >
                  Have code?
                </Text>
                <TouchableOpacity activeOpacity={0.6}>
                  <Text
                    fontSize={"lg"}
                    textAlign="center"
                    color="#585858"
                    fontFamily={fontHauoraMedium}
                    ml={4}
                  >
                    Apply next screen
                  </Text>
                </TouchableOpacity>
              </Div>

              <Div flexDir="row" alignItems="flex-end" mt={4} justifyContent="center">
                <Text
                  fontSize={"lg"}
                  textAlign="center"
                  color="#B2B2B2"
                  fontFamily={fontHauoraSemiBold}
                >
                  Payment securenly processed by
                </Text>
                <Image ml={4} source={require("@/assets/icons/stripe-logo.png")} w={44} h={20} />
              </Div>

              <Text
                mt={4}
                fontSize={"lg"}
                textAlign="center"
                color="#5A5A5A"
                fontFamily={fontHauoraMedium}
              >
                By starting your membership, you agree to smoll Terms of Service and Privacy Policy.
              </Text>
            </Div>
          </View>
        )}
        {loading && (
          <Div flex={1} justifyContent="center">
            <ActivityIndicator size="large" color={colorPrimary} />
          </Div>
        )}
      </Layout>
    </StripeProvider>
  );
}

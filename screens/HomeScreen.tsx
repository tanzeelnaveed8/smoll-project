import Layout from "@/components/app/Layout";
import IconButton from "@/components/partials/IconButton";
import {
  colorPrimary,
  fontCooper,
  fontCooperBold,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
  fontHeading,
} from "@/constant/constant";
import {
  IconArrowRight,
  IconBell,
  IconChevronRight,
  IconMichelinStar,
  IconSettings,
  IconUserCircle,
  IconX,
  IconXboxX,
} from "@tabler/icons-react-native";
import {
  ActivityIndicator,
  FlatList,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button, Div, Icon, Image, ScrollDiv, Text } from "react-native-magnus";

import AccountSetupModal from "@/components/app/account/AccountSetupModal";
import OnboardingCongratsModal from "@/components/app/onboarding/OnboardingCongratsModal";
import AccountSetupProgress from "@/components/partials/AccountSetupProgress";
import { useCounsellorStore } from "@/store/modules/counsellor";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import TabNavigationBar from "@/components/app/TabNavigationBar";
import { showMessage } from "react-native-flash-message";
import { useNotificationStore } from "@/store/modules/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  navigation: NavigationType;
  isNewUser?: boolean;
}

interface OptionTab {
  name: string;
  description: string;
  value: "counselling" | "petProfileScreen" | "appointments";
  loading: boolean;
  img: ImageSourcePropType;
  h: number;
  w: number;
}

const HomeScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const { user } = useUserStore();
  const { sessions, fetchSessions } = useCounsellorStore();
  const { fetchNotifications, notifications } = useNotificationStore();

  const [options, setOptions] = useState<OptionTab[]>([
    {
      name: "Appointments",
      value: "appointments",
      description: "All your appointment shows here",
      loading: false,
      img: require("../assets/images/appointment_.png"),
      h: 65,
      w: 55,
    },
    {
      name: "Human Counselling",
      value: "counselling",
      description: "Talk to somone knows how it feels loosing a pet",
      loading: false,
      img: require("../assets/images/human-counselling.png"),
      h: 50,
      w: 50,
    },
    {
      name: "PetID",
      value: "petProfileScreen",
      description: "Add and track your pet’s records",
      loading: false,
      img: require("../assets/images/pet-id.png"),
      h: 60,
      w: 60,
    },
  ]);

  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showAccountSetupButton, setShowAccountSetupButton] = useState(false);

  useEffect(() => {
    fetchNotifications(1, 20);

    // handling showAccountSetupButton
    const checkAccountSetupStatus = async () => {
      const hideAccountSetupBtn = await AsyncStorage.getItem(
        "hideAccountSetupBtn"
      );

      if (hideAccountSetupBtn) {
        setShowAccountSetupButton(false);
      } else {
        setShowAccountSetupButton(true);
      }
    };

    checkAccountSetupStatus();
  }, []);

  useEffect(() => {
    const showSetupModal =
      (route.params as Record<string, string>)?.showSetupModal === "true";

    const isNewUser =
      (route.params as Record<string, string>)?.isNewUser === "true";

    if (isNewUser) {
      setTimeout(() => {
        setShowCongratsModal(true);
      }, 500);
    }

    if (showSetupModal) {
      setShowAccountSetupModal(true);
    }
  }, [route.params]);

  const completedStep = useMemo(() => {
    const basicInfoExist = Boolean(user?.address?.length);
    const emailInfoExist = user?.email && user?.isEmailVerified;
    const petInfoExist = (user?.petCount ?? 0) > 0;

    const completedStep = [basicInfoExist, emailInfoExist, petInfoExist].filter(
      (step) => step
    ).length;

    return completedStep;
  }, [user]);

  const handleOptionTabPress = async (item: OptionTab) => {
    if (item.value === "counselling") {
      showMessage({
        message: "🚀 Coming Soon! 🎉",
        description: "Get ready for some pawsome counselling! 🐾",
        type: "info",
      });
    } else if (item.value === "petProfileScreen") {
      props.navigation.navigate("PetProfileListScreen", {
        navigateTo: "HomeScreen",
      });
    } else if (item.value === "appointments") {
      props.navigation.navigate("AppointmentsScreen");
    }
  };

  const hideAccountSetupModal = () => {
    AsyncStorage.setItem("hideAccountSetupBtn", "true");
    setShowAccountSetupButton(false);
  };

  return (
    <>
      <Layout
        style={{
          justifyContent: "flex-start",
        }}
      >
        <ScrollDiv showsVerticalScrollIndicator={false}>
          <Div
            mb={20}
            mt={5}
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Div flexDir="row" alignItems="center" style={{ gap: 12 }}>
              <Image w={100} h={27} source={require("../assets/logo.png")} />
            </Div>

            <Div flexDir="row" alignItems="center" style={{ gap: 8 }}>
              <Div position="relative">
                {notifications && notifications.count > 0 && (
                  <Text style={styles.notificationCount}>
                    {notifications?.count}
                  </Text>
                )}

                <IconButton
                  style={{ overflow: "visible" }}
                  onPress={() => {
                    props.navigation.navigate("NotificationTestScreen");
                  }}
                >
                  <IconBell
                    width={32}
                    height={32}
                    color={"#222222"}
                    strokeWidth={1.5}
                  />
                </IconButton>
              </Div>
              <IconButton
                onPress={() => {
                  props.navigation.navigate("SettingsMainScreen");
                }}
              >
                <IconSettings
                  width={32}
                  height={32}
                  color={"#222222"}
                  strokeWidth={1.5}
                />
              </IconButton>
            </Div>
          </Div>

          <Div mb={16}>
            <Text fontSize={"5xl"} fontFamily={fontHeading}>
              Hi, {user?.name}
            </Text>
            <Text fontSize={"lg"}>How can we help you today?</Text>
          </Div>

          <TouchableOpacity
            style={{
              borderWidth: 1.4,
              borderColor: "#222",
              borderRadius: 40,
              paddingVertical: 15,
              flexDirection: "row",
              marginBottom: 20,
            }}
            onPress={() => {
              props.navigation.navigate("ExpertsListScreen");
            }}
          >
            <Div justifyContent="space-between" px={24}>
              <Div mb={16} mt={12}>
                <Text
                  fontSize={"2xl"}
                  fontFamily={fontCooperBold}
                  lineHeight={24}
                >
                  Chat with pet
                </Text>
                <Text
                  fontSize={"2xl"}
                  fontFamily={fontCooperBold}
                  lineHeight={24}
                >
                  wellness expert
                </Text>

                <Text fontFamily={fontHauoraSemiBold}>Completly Free!</Text>
              </Div>

              <Div
                style={{
                  paddingVertical: 2,
                  flexDirection: "row",
                  gap: 6,
                }}
              >
                <Text
                  fontFamily={fontHauoraSemiBold}
                  fontSize={"xl"}
                  bg="#222"
                  color="#fff"
                  rounded={20}
                  py={9}
                  px={20}
                >
                  Start Now
                </Text>
                <IconArrowRight
                  width={34}
                  height={34}
                  strokeWidth={2.7}
                  color="#222"
                  style={{ alignSelf: "center" }}
                />
                {/* <Icon
                  alignSelf="center"
                  name="chevron-right"
                  fontFamily="Feather"
                  fontSize={24}
                  color="#222"
                /> */}
              </Div>
            </Div>

            <Image
              source={require("../assets/images/homescreen-hero.png")}
              w={200}
              h={170}
              style={{ objectFit: "contain" }}
              // position="absolute"
              // right={0}
              // bottom={0}
            />
          </TouchableOpacity>

          <Div>
            <Div flexDir="row" style={{ gap: 8 }} alignItems="center" mb={16}>
              <Image
                source={require("../assets/images/home-start-icon-dark.png")}
                w={24}
                h={24}
                mt={2}
              />
              {/* <IconMichelinStar
                width={24}
                height={24}
                color={"#222"}
                fill={"#222"}
                style={{ marginTop: 2 }}
              /> */}
              <Text fontFamily={fontHauoraBold} fontSize={"xl"}>
                Other services you can do
              </Text>
            </Div>

            {options.map((item, index) => (
              <Button
                key={item.value}
                px={16}
                py={12}
                borderWidth={1.2}
                borderColor="#222"
                mb={index + 1 === options.length ? 0 : 8}
                rounded={20}
                w={"100%"}
                disabled={item.loading}
                onPress={() => handleOptionTabPress(item)}
                bg="#fff"
                underlayColor="#f3f3f3"
              >
                <Div flex={1} flexDir="row" alignItems="center">
                  <Image
                    source={item.img}
                    w={item.w}
                    h={item.h}
                    mr={12}
                    style={index !== 0 ? { objectFit: "contain" } : {}}
                  />
                  <Div flex={1}>
                    <Text
                      fontSize={"xl"}
                      fontFamily={fontHauoraBold}
                      lineHeight={20}
                    >
                      {item.name}
                    </Text>
                    <Text
                      fontSize={"md"}
                      fontFamily={fontHauoraMedium}
                      lineHeight={18}
                    >
                      {item.description}
                    </Text>
                  </Div>
                </Div>
                {item.loading ? (
                  <ActivityIndicator color={colorPrimary} />
                ) : (
                  <IconChevronRight width={24} height={24} color={"#222222"} />
                )}
              </Button>
            ))}
          </Div>

          <Div h={50} />
        </ScrollDiv>

        {completedStep < 3 && showAccountSetupButton && (
          <Div
            mb={16}
            position="absolute"
            bottom={15}
            zIndex={20}
            w={"100%"}
            alignSelf="center"
          >
            <TouchableOpacity
              style={styles.actionSetupCloseBtn}
              onPress={hideAccountSetupModal}
            >
              <IconX width={20} height={20} color={"#000"} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowAccountSetupModal(true);
              }}
            >
              <AccountSetupProgress
                progress={completedStep / 3}
                completedStepCount={completedStep}
              />
            </TouchableOpacity>
          </Div>
        )}

        <OnboardingCongratsModal
          isVisible={showCongratsModal}
          onSuccess={async () => {
            setShowCongratsModal(false);
          }}
        />

        {/* remove it for now */}
        <AccountSetupModal
          isVisible={showAccountSetupModal}
          onBack={() => setShowAccountSetupModal(false)}
          navigation={props.navigation}
        />
      </Layout>

      <TabNavigationBar navigation={props.navigation} />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  actionSetupCloseBtn: {
    position: "absolute",
    top: 3,
    right: 4,
    zIndex: 10,
    padding: 2,
  },

  notificationCount: {
    position: "absolute",
    top: -4,
    right: -1,
    backgroundColor: "#F44336",
    borderRadius: 12,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    color: "#FFFFFF",
    zIndex: 10,
    textAlign: "center",
    width: 20,
    height: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
});

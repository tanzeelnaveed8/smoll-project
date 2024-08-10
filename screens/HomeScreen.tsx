import Layout from "@/components/app/Layout";
import IconButton from "@/components/partials/IconButton";
import {
  colorPrimary,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import {
  IconBell,
  IconChevronRight,
  IconUserCircle,
} from "@tabler/icons-react-native";
import {
  ActivityIndicator,
  FlatList,
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

interface Props {
  navigation: NavigationType;
  isNewUser?: boolean;
}

interface OptionTab {
  name: string;
  description: string;
  value: "counselling" | "vet";
  loading: boolean;
}

const HomeScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const { user } = useUserStore();
  const { sessions, fetchSessions } = useCounsellorStore();
  const { fetchNotifications, notifications } = useNotificationStore();

  const [options, setOptions] = useState<OptionTab[]>([
    {
      name: "Human Counselling",
      value: "counselling",
      description: "Therapy aids coping, enhances functioning",
      loading: false,
    },
    {
      name: "Chat with Vet",
      value: "vet",
      description: "Ask vet about food, concerns",
      loading: false,
    },
  ]);

  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  useEffect(() => {
    fetchNotifications(1, 20);
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

  const setLoading = (option: OptionTab["value"], loading: boolean) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      const counsellingTab = newOptions.find((tab) => tab.value === option);
      if (counsellingTab) counsellingTab.loading = loading;
      return newOptions;
    });
  };

  const handleOptionTabPress = async (item: OptionTab) => {
    if (item.value === "counselling") {
      showMessage({
        message: "🚀 Coming Soon! 🎉",
        description: "Get ready for some pawsome counselling! 🐾",
        type: "info",
      });

      // TODO: Need to fix it properly
      // let _sessions = sessions;

      // if (!sessions) {
      //   try {
      //     setLoading("counselling", true);
      //     _sessions = await fetchSessions();
      //   } finally {
      //     setLoading("counselling", false);
      //   }
      // }

      // if (!_sessions?.length) {
      //   props.navigation.navigate("CounsellingRequestScreen");
      // } else {
      //   props.navigation.navigate("CounsellingInboxScreen");
      // }
    } else if (item.value === "vet") {
      props.navigation.navigate("ExpertsInboxScreen");
    }
  };

  return (
    <>
      <Layout
        style={{
          justifyContent: "flex-start",
        }}
      >
        <ScrollDiv>
          <Div
            mb={20}
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Div flexDir="row" alignItems="center" style={{ gap: 12 }}>
              <Image w={100} h={27} source={require("../assets/logo.png")} />
              <Image
                w={56}
                h={56}
                source={require("../assets/images/dog.png")}
              />
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
                    // props.navigation.navigate("AppointmentsScreen");
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
                <IconUserCircle
                  width={32}
                  height={32}
                  color={"#222222"}
                  strokeWidth={1.5}
                />
              </IconButton>
            </Div>
          </Div>

          <Div mb={16}>
            <Text fontSize={"5xl"}>Hi, {user?.name}</Text>
            <Text fontSize={"lg"}>How can we help you today?</Text>
          </Div>

          {completedStep < 3 && (
            <Div mb={16}>
              <TouchableOpacity
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

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("ExpertsListScreen");
            }}
          >
            <Div
              bg="#F3F9FC"
              px={16}
              py={18}
              style={{ borderRadius: 12 }}
              borderWidth={1}
              borderColor="#D0D7DC"
              mb={24}
            >
              <Div w={212} mb={16}>
                <Text fontSize={"2xl"}>Expert Advice for</Text>
                <Text fontSize={"2xl"} color="primary" mb={4}>
                  Happier, Healthier Pets
                </Text>
                <Text>Receive a consultation for your pet</Text>
              </Div>

              <Div style={{ paddingVertical: 2, flexDirection: "row", gap: 6 }}>
                <Text fontFamily={fontHauoraSemiBold} fontSize={"lg"}>
                  Get Started
                </Text>
                <Icon
                  alignSelf="center"
                  name="chevron-right"
                  fontFamily="Feather"
                  fontSize={24}
                  color="#222"
                />
              </Div>

              <Image
                source={require("../assets/images/home-page-highfy.png")}
                w={200}
                h={170}
                position="absolute"
                right={0}
                bottom={0}
              />
            </Div>
          </TouchableOpacity>

          <Div>
            <Div flexDir="row" style={{ gap: 8 }} alignItems="center" mb={16}>
              <Image
                source={require("../assets/images/home-start-icon.png")}
                w={24}
                h={24}
                mt={2}
              />
              <Text fontFamily={fontHauoraBold} fontSize={"xl"}>
                What do you want to do today?
              </Text>
            </Div>

            {options.map((item, index) => (
              <Button
                key={item.value}
                px={16}
                py={12}
                borderWidth={1}
                borderColor="#D0D7DC"
                mb={index + 1 === options.length ? 0 : 8}
                rounded={12}
                w={"100%"}
                disabled={item.loading}
                onPress={() => handleOptionTabPress(item)}
                bg="#fff"
                underlayColor="#f3f3f3"
              >
                <Div flex={1}>
                  <Text fontSize={"lg"} fontFamily={fontHauoraBold}>
                    {item.name}
                  </Text>
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    {item.description}
                  </Text>
                </Div>
                {item.loading ? (
                  <ActivityIndicator color={colorPrimary} />
                ) : (
                  <IconChevronRight width={24} height={24} color={"#222222"} />
                )}
              </Button>
            ))}
          </Div>
        </ScrollDiv>

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

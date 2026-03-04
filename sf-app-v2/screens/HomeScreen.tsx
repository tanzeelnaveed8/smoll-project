import Layout from "@/components/app/Layout";
import IconButton from "@/components/partials/IconButton";
import { colorPrimary, fontHauoraBold, fontHauoraMedium, fontHeading } from "@/constant/constant";
import { IconBell, IconChevronRight } from "@tabler/icons-react-native";
import {
  ActivityIndicator,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
} from "react-native";
import { Button, Div, Image, ScrollDiv, Text } from "react-native-magnus";

import HomeScreenBanner from "@/components/app/HomeScreenBanner";
import OnboardingCongratsModal from "@/components/app/onboarding/OnboardingCongratsModal";
import ClockIcon from "@/components/icons/ClockIcon";
import IconCustomUser from "@/components/icons/IconCustomUser";
import { useCounsellorStore } from "@/store/modules/counsellor";
import { useNotificationStore } from "@/store/modules/notification";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";

interface Props {
  navigation: NavigationType;
  isNewUser?: boolean;
}

interface OptionTab {
  name: string;
  description: string;
  value: "chat" | "petProfileScreen" | "appointments" | string;
  loading: boolean;
  icon?: React.JSX.Element;
  img?: ImageSourcePropType;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}

const HomeScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const { user } = useUserStore();
  const { sessions, fetchSessions } = useCounsellorStore();
  const { fetchNotifications, notifications } = useNotificationStore();

  const [options, setOptions] = useState<OptionTab[]>([
    {
      name: "Chat with Expert",
      value: "chat",
      description: "Quick and Easy",
      loading: false,
      icon: (
        <Div style={{ marginRight: 10, transform: [{ translateX: 2 }] }}>
          <Image
            source={require("../assets/images/homepage-boy-img.png")}
            w={60}
            h={60}
            style={{ objectFit: "contain" }}
          />
        </Div>
      ),
    },
    {
      name: "Network",
      value: "clinics",
      description: "Locate our partners clinics",
      loading: false,
      // icon: <OnboardingIcon5 width={55} height={55} />,
      img: require("@/assets/images/home-clinic.png"),
      width: 71,
      height: 68,
      style: {
        transform: [{ translateX: 5 }, { translateY: 2 }],
        objectFit: "contain",
      },
      // icon: <DogIcon width={70} height={70} />,
    },
    {
      name: "Appointments",
      value: "appointments",
      description: "All your appointment shows here",
      loading: false,
      // icon: <OnboardingIcon2 width={65} height={65} />,
      icon: (
        <Div style={{ transform: [{ translateY: 3 }] }}>
          <ClockIcon width={70} height={70} />
        </Div>
      ),
    },
  ]);

  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showAccountSetupButton, setShowAccountSetupButton] = useState(false);

  useEffect(() => {
    fetchNotifications(1, 20);

    // handling showAccountSetupButton
    const checkAccountSetupStatus = async () => {
      const hideAccountSetupBtn = await AsyncStorage.getItem("hideAccountSetupBtn");

      if (hideAccountSetupBtn) {
        setShowAccountSetupButton(false);
      } else {
        setShowAccountSetupButton(true);
      }
    };

    checkAccountSetupStatus();
  }, []);

  useEffect(() => {
    const showSetupModal = (route.params as Record<string, string>)?.showSetupModal === "true";

    const isNewUser = (route.params as Record<string, string>)?.isNewUser === "true";

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
    if (item.value === "chat") {
      props.navigation.navigate("ExpertsListScreen");
    } else if (item.value === "clinics") {
      props.navigation.navigate("ClinicListScreen");
    } else if (item.value === "appointments") {
      props.navigation.navigate("AppointmentsScreen");
    }
  };

  const hideAccountSetupModal = () => {
    AsyncStorage.setItem("hideAccountSetupBtn", "true");
    setShowAccountSetupButton(false);
  };

  // const handleLogout = async () => {
  //   await AsyncStorage.setItem("accessToken", "");
  //   AsyncStorage.removeItem("hideAccountSetupBtn");
  // };

  // useEffect(() => {
  //   handleLogout();
  // }, []);

  return (
    <>
      <Layout
        style={{
          justifyContent: "flex-start",
        }}
      >
        <ScrollDiv showsVerticalScrollIndicator={false}>
          <Div mb={40} mt={5} flexDir="row" justifyContent="space-between" alignItems="center">
            <Div flexDir="row" alignItems="center" style={{ gap: 12 }}>
              <Image w={100} h={27} source={require("../assets/logo.png")} />
            </Div>

            <Div flexDir="row" alignItems="center" style={{ gap: 8 }}>
              <Div position="relative">
                {notifications && notifications.count > 0 && (
                  <Div
                    w={20}
                    h={20}
                    rounded={100}
                    bg="#F44336"
                    style={styles.notificationCount}
                    pointerEvents="none"
                  >
                    <Text color="#fff">{notifications?.count}</Text>
                  </Div>
                )}

                <IconButton
                  bg="bgColor"
                  style={{
                    overflow: "visible",
                  }}
                  onPress={() => {
                    props.navigation.navigate("NotificationScreen");
                  }}
                >
                  <IconBell width={32} height={32} color={"#222222"} strokeWidth={1.5} />
                </IconButton>
              </Div>
              <IconButton
                bg="bgColor"
                style={{ marginLeft: -8 }}
                onPress={() => {
                  props.navigation.navigate("SettingsMainScreen");
                }}
              >
                <IconCustomUser color="#222" />
              </IconButton>
            </Div>
          </Div>

          <Div mb={16}>
            <Text fontSize={"5xl"} fontFamily={fontHeading}>
              Hi{user?.name ? `, ${user?.name}` : ""}
            </Text>
            <Text fontSize={"lg"}>How can we help you today?</Text>
          </Div>

          <HomeScreenBanner navigation={props.navigation} />

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
                px={14}
                py={12}
                borderWidth={1.2}
                borderColor="#222"
                mb={index + 1 === options.length ? 0 : 8}
                rounded={25}
                w={"100%"}
                h={83}
                disabled={item.loading}
                onPress={() => handleOptionTabPress(item)}
                bg="transparent"
                underlayColor="#f3f3f3"
              >
                <Div flex={1} flexDir="row" alignItems="center" style={{ gap: 12 }}>
                  {item.icon ? (
                    item.icon
                  ) : (
                    <Image source={item.img} w={item.width} h={item.height} style={item.style} />
                  )}

                  <Div flex={1}>
                    <Text fontSize={"xl"} fontFamily={fontHauoraBold} lineHeight={20}>
                      {item.name}
                    </Text>
                    <Text
                      fontSize={"sm"}
                      fontFamily={fontHauoraMedium}
                      lineHeight={18}
                      maxW={"90%"}
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

        {/* {completedStep < 3 && showAccountSetupButton && (
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
        )} */}

        <OnboardingCongratsModal
          isVisible={showCongratsModal}
          onSuccess={async () => {
            setShowCongratsModal(false);
          }}
        />

        {/* remove it for now */}
        {/* <AccountSetupModal
          isVisible={showAccountSetupModal}
          onBack={() => setShowAccountSetupModal(false)}
          navigation={props.navigation}
        /> */}
      </Layout>

      {/* <TabNavigationBar navigation={props.navigation} /> */}
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
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    zIndex: 10,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
});

import Layout from "@/components/app/Layout";
import HomeScreenBanner from "@/components/app/HomeScreenBanner";
import OnboardingCongratsModal from "@/components/app/onboarding/OnboardingCongratsModal";
import {
  colorPrimary,
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
  fontHeading,
} from "@/constant/constant";
import { useNotificationStore } from "@/store/modules/notification";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import {
  IconBell,
  IconChevronRight,
  IconMessage,
  IconSearch,
  IconSettings,
  IconUser,
} from "@tabler/icons-react-native";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Div, ScrollDiv, Text } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
  isNewUser?: boolean;
}

function getTimeBasedGreeting(): string {
  const hour = dayjs().hour();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

const HomeScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const { user } = useUserStore();
  const { fetchNotifications, notifications } = useNotificationStore();
  const [greeting] = useState(getTimeBasedGreeting());
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  useEffect(() => {
    fetchNotifications(1, 20);
  }, []);

  useEffect(() => {
    const isNewUser = (route?.params as Record<string, string>)?.isNewUser === "true";
    if (isNewUser) {
      setTimeout(() => setShowCongratsModal(true), 500);
    }
  }, [route?.params]);

  const displayName = user?.name ? `${user.name} & Bella` : "Sarah & Bella";
  const hasNotifications = Boolean(notifications?.count && notifications.count > 0);

  return (
    <>
      <Layout style={{ justifyContent: "flex-start" }} disableHeader>
        <ScrollDiv showsVerticalScrollIndicator={false}>
          {/* Header: avatar + greeting + name, then profile/settings/notifications */}
          <Div
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
            pt={8}
            pb={6}
            mb={2}
          >
            <Div flexDir="row" alignItems="center" style={{ gap: 12 }} flex={1}>
              <Div
                w={56}
                h={56}
                rounded={100}
                bg="#FFC107"
                overflow="hidden"
                style={styles.avatarWrap}
              >
                {user?.profileImg?.url ? (
                  <Image
                    source={{ uri: user.profileImg.url }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Div flex={1} justifyContent="center" alignItems="center">
                    <IconUser size={28} color="#222" />
                  </Div>
                )}
              </Div>
              <Div>
                <Text
                  fontSize={10}
                  fontFamily={fontHauoraBold}
                  color="#9BA1A7"
                  letterSpacing={2}
                  style={{ textTransform: "uppercase" }}
                >
                  {greeting}
                </Text>
                <Div flexDir="row" alignItems="center" style={{ gap: 4 }}>
                  <Text fontSize={"xl"} fontFamily={fontHeading} color="#222">
                    {displayName}
                  </Text>
                  <Text fontSize={"lg"} color="#4E4485">
                    🐾
                  </Text>
                </Div>
              </Div>
            </Div>
            <Div flexDir="row" alignItems="center" style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("SettingPersonalInfoScreen")}
                style={styles.iconButton}
              >
                <IconUser size={20} color="#9CA3AF" strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("SettingsMainScreen")}
                style={styles.iconButton}
              >
                <IconSettings size={20} color="#9CA3AF" strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("NotificationScreen")}
                style={styles.iconButton}
              >
                <Div position="relative">
                  <IconBell size={20} color="#9CA3AF" strokeWidth={1.5} />
                  {hasNotifications && (
                    <Div
                      position="absolute"
                      top={-2}
                      right={-2}
                      w={6}
                      h={6}
                      rounded={100}
                      bg="#EF4444"
                      borderWidth={2}
                      borderColor="#fff"
                    />
                  )}
                </Div>
              </TouchableOpacity>
            </Div>
          </Div>

          {/* Search bar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.navigation.navigate("ExpertsListScreen")}
            style={styles.searchBar}
          >
            <IconSearch size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
            <Text fontSize={"sm"} color="#9CA3AF" fontFamily={fontHauora}>
              Find a specialist, service...
            </Text>
          </TouchableOpacity>

          <HomeScreenBanner navigation={props.navigation} />

          {/* What do you need? */}
          <Div mb={10}>
            <Text fontSize={"xl"} fontFamily={fontHauoraBold} color="#222" mb={6}>
              What do you need?
            </Text>
            <Div style={{ gap: 16 }}>
              <Button
                bg="white"
                p={24}
                rounded={32}
                flexDir="row"
                alignItems="center"
                justifyContent="space-between"
                onPress={() => props.navigation.navigate("ExpertsListScreen")}
                style={styles.actionCard}
                underlayColor="#f9fafb"
              >
                <Div flexDir="row" alignItems="center" style={{ gap: 20 }} flex={1}>
                  <Div
                    w={64}
                    h={64}
                    bg="#F0F5FF"
                    rounded={16}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <IconMessage size={32} color={colorPrimary} strokeWidth={1.5} />
                  </Div>
                  <Div flex={1}>
                    <Text fontSize={"lg"} fontFamily={fontHauoraBold} color="#222">
                      Talk to a Vet
                    </Text>
                    <Text
                      fontSize={"sm"}
                      fontFamily={fontHauoraMedium}
                      color="#6B7280"
                      mt={4}
                      lineHeight={18}
                    >
                      Instant video consultation with a licensed veterinarian.
                    </Text>
                  </Div>
                </Div>
                <Div
                  w={40}
                  h={40}
                  bg="#F7F8FA"
                  rounded={100}
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconChevronRight size={20} color="#D1D5DB" strokeWidth={2} />
                </Div>
              </Button>

              <Button
                bg="white"
                p={24}
                rounded={32}
                flexDir="row"
                alignItems="center"
                justifyContent="space-between"
                onPress={() => props.navigation.navigate("HomeServicesScreen")}
                style={styles.actionCard}
                underlayColor="#f9fafb"
              >
                <Div flexDir="row" alignItems="center" style={{ gap: 20 }} flex={1}>
                  <Div
                    w={64}
                    h={64}
                    bg="#FFF2EA"
                    rounded={16}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={28}>🛒</Text>
                  </Div>
                  <Div flex={1}>
                    <Text fontSize={"lg"} fontFamily={fontHauoraBold} color="#222">
                      Home Services
                    </Text>
                    <Text
                      fontSize={"sm"}
                      fontFamily={fontHauoraMedium}
                      color="#6B7280"
                      mt={4}
                      lineHeight={18}
                    >
                      Grooming, vaccinations, and checkups at your doorstep.
                    </Text>
                  </Div>
                </Div>
                <Div
                  w={40}
                  h={40}
                  bg="#F7F8FA"
                  rounded={100}
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconChevronRight size={20} color="#D1D5DB" strokeWidth={2} />
                </Div>
              </Button>
            </Div>
          </Div>

          {/* Upcoming */}
          <Div mb={10} style={{ width: "100%" }}>
            <Div flexDir="row" justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize={"xl"} fontFamily={fontHauoraBold} color="#222">
                Upcoming
              </Text>
              <TouchableOpacity onPress={() => props.navigation.navigate("AppointmentsScreen")}>
                <Text fontSize={"sm"} fontFamily={fontHauoraSemiBold} color={colorPrimary}>
                  See all
                </Text>
              </TouchableOpacity>
            </Div>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => props.navigation.navigate("ClinicListScreen")}
              style={[styles.upcomingCard, styles.upcomingCardTouchable]}
            >
              <Div flexDir="column" w="100%" style={{ overflow: "hidden" }}>
                <Div flexDir="row" alignItems="flex-start" style={{ gap: 16 }} mb={16}>
                  <Div
                    w={56}
                    h={56}
                    bg="rgba(255,255,255,0.1)"
                    rounded={16}
                    justifyContent="center"
                    alignItems="center"
                    style={{ flexShrink: 0 }}
                  >
                    <Text fontSize={28}>📅</Text>
                  </Div>
                  <Div flex={1} style={{ minWidth: 0 }}>
                    <Text fontSize={"lg"} fontFamily={fontHauoraBold} color="white">
                      Vaccination Due
                    </Text>
                    <Text
                      fontSize={"sm"}
                      fontFamily={fontHauoraMedium}
                      color="rgba(255,255,255,0.7)"
                      mt={4}
                    >
                      Bella needs her annual rabies shot.
                    </Text>
                  </Div>
                </Div>
                <Div
                  bg="white"
                  py={14}
                  rounded={16}
                  alignItems="center"
                  justifyContent="center"
                  w="100%"
                >
                  <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#1A3B70">
                    Schedule Now
                  </Text>
                </Div>
              </Div>
            </TouchableOpacity>
          </Div>

          <Div h={50} />
        </ScrollDiv>

        <OnboardingCongratsModal
          isVisible={showCongratsModal}
          onSuccess={async () => setShowCongratsModal(false)}
        />
      </Layout>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  avatarWrap: {
    overflow: "hidden",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  upcomingCard: {
    backgroundColor: "#1A3B70",
    padding: 24,
    borderRadius: 32,
    shadowColor: "rgba(26, 54, 110, 0.15)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  upcomingCardTouchable: {
    width: "100%",
    overflow: "hidden",
  },
});

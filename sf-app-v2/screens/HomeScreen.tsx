import Layout from "@/components/app/Layout";
import OnboardingCongratsModal from "@/components/app/onboarding/OnboardingCongratsModal";
import { fontHauora, fontHauoraBold, fontHauoraMedium, fontHeading } from "@/constant/constant";
import { DEMO_MODE } from "@/utils/config";
import { useNotificationStore } from "@/store/modules/notification";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import { IconArrowRight, IconBell, IconUser } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";

const smollHomeIllustration = require("../stitch-export/home-final/Illustrations/smol-home.png");
const smollVetIllustration = require("../stitch-export/home-final/Illustrations/smoll-vet.png");
const appointmentIllustration = require("../stitch-export/home-final/Illustrations/appointments.png");
const networkIllustration = require("../stitch-export/home-final/Illustrations/network.png");

interface Props {
  navigation: NavigationType;
  isNewUser?: boolean;
}

const HomeScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const { user } = useUserStore();
  const { fetchNotifications, notifications } = useNotificationStore();
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

  const displayName = user?.name ? user.name : "Jane";
  const displayFirstName = displayName.split(" ")[0] || "Jane";
  const hasNotifications = Boolean(notifications?.count && notifications.count > 0);

  return (
    <>
      <Layout style={{ justifyContent: "flex-start" }} disableHeader>
        <ScrollDiv showsVerticalScrollIndicator={false}>
          {DEMO_MODE && (
            <Div
              bg="#EFF6FF"
              py={4}
              px={10}
              mb={4}
              alignSelf="flex-start"
              rounded={999}
            >
              <Text fontSize={11} fontFamily={fontHauoraMedium} color="#3B82F6">
                Demo mode
              </Text>
            </Div>
          )}
          {/* Header: logo + notifications/profile */}
          <Div
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
            pt={8}
            pb={6}
            mb={10}
          >
            <Div flexDir="row" alignItems="center" style={{ gap: 8 }}>
              <Image
                source={require("../assets/logo.png")}
                style={{ width: 100, height: 28, resizeMode: "contain" }}
              />
            </Div>
            <Div flexDir="row" alignItems="center" style={{ gap: 8 }}>
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
              <TouchableOpacity
                onPress={() => props.navigation.navigate("SettingPersonalInfoScreen")}
                style={styles.iconButton}
              >
                <IconUser size={20} color="#9CA3AF" strokeWidth={1.5} />
              </TouchableOpacity>
            </Div>
          </Div>

          {/* Greeting */}
          <Div mt={12} mb={24}>
            <Text fontSize={"4xl"} fontFamily={fontHeading} color="#111111" mb={6}>
              Hi, {displayFirstName}
            </Text>
            <Text fontSize={"lg"} fontFamily={fontHauora} color="#494949">
              How can we help you today?
            </Text>
          </Div>

          {/* Primary cards: smoll Home & smoll Vet */}
          <Div style={{ gap: 16 }} mb={16}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => props.navigation.navigate("HomeServicesScreen")}
              style={styles.primaryCard}
            >
              <Div>
                <Text fontSize={"xl"} fontFamily={fontHauoraBold} color="#111827" mb={6}>
                  smoll®Home
                </Text>
                <Text fontSize={"md"} fontFamily={fontHauoraMedium} color="#6B7280" lineHeight={20}>
                  Book Home Visits
                </Text>
              </Div>

              <Image source={smollHomeIllustration} style={styles.primaryHomeImage} />
              <Div style={styles.primaryArrowWrap}>
                <IconArrowRight size={28} color="#111827" strokeWidth={2.5} />
              </Div>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => props.navigation.navigate("ExpertsListScreen")}
              style={styles.primaryCard}
            >
              <Div>
                <Text fontSize={"xl"} fontFamily={fontHauoraBold} color="#111827" mb={6}>
                  smoll®Vet
                </Text>
                <Text fontSize={"md"} fontFamily={fontHauoraMedium} color="#6B7280" lineHeight={20}>
                  Consult over Video
                </Text>
              </Div>

              <Image source={smollVetIllustration} style={styles.primaryVetImage} />
              <Div style={styles.primaryArrowWrap}>
                <IconArrowRight size={28} color="#111827" strokeWidth={2.5} />
              </Div>
            </TouchableOpacity>
          </Div>

          {/* Secondary grid cards */}
          <Div flexDir="row" style={{ gap: 16 }} mb={32}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => props.navigation.navigate("AppointmentsScreen")}
              style={[styles.secondaryCard, { flex: 1 }]}
            >
              <Div flex={1} justifyContent="space-between">
                <Image
                  source={appointmentIllustration}
                  style={styles.secondaryIconImage}
                />
                <Div>
                  <Text
                    fontSize={"lg"}
                    fontFamily={fontHauoraBold}
                    color="#111827"
                    mb={4}
                  >
                    Appointment
                  </Text>
                  <Text
                    fontSize={"sm"}
                    fontFamily={fontHauoraMedium}
                    color="#6B7280"
                    lineHeight={18}
                  >
                    Your appointment
                  </Text>
                </Div>
              </Div>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => props.navigation.navigate("ClinicListScreen")}
              style={[styles.secondaryCard, { flex: 1 }]}
            >
              <Div flex={1} justifyContent="space-between">
                <Image
                  source={networkIllustration}
                  style={styles.secondaryIconImage}
                />
                <Div>
                  <Text
                    fontSize={"lg"}
                    fontFamily={fontHauoraBold}
                    color="#111827"
                    mb={4}
                  >
                    Network
                  </Text>
                  <Text
                    fontSize={"sm"}
                    fontFamily={fontHauoraMedium}
                    color="#6B7280"
                    lineHeight={18}
                  >
                    Our partners clinics
                  </Text>
                </Div>
              </Div>
            </TouchableOpacity>
          </Div>

          <Div h={80} />
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
  primaryCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 32,
    paddingHorizontal: 28,
    minHeight: 220,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  primaryHomeImage: {
    position: "absolute",
    right: 4,
    bottom: -4,
    width: 200,
    height: 176,
    resizeMode: "contain",
  },
  primaryVetImage: {
    position: "absolute",
    right: 18,
    bottom: -10,
    width: 170,
    height: 190,
    resizeMode: "contain",
  },
  primaryArrowWrap: {
    position: "absolute",
    left: 24,
    bottom: 36,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  secondaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    aspectRatio: 1,
    overflow: "hidden",
  },
  secondaryIconWrap: {
    // no longer used; kept for compatibility
  },
  secondaryIconImage: {
    width: 72,
    height: 72,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 16,
  },
});

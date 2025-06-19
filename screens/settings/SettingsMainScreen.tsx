import { useAppVersion } from "@/app/hooks/useAppVersion";
import Layout from "@/components/app/Layout";
import ConfirmationModal from "@/components/partials/ConfirmationModal";
import SettingButton from "@/components/partials/SettingButton";
import { colorErrorText, fontHauora, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { logout } from "@/utils/chat.v2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IconBell,
  IconChecklist,
  IconCreditCard,
  IconGavel,
  IconHelp,
  IconLogout,
  IconPaw,
  IconUserCircle,
  IconWorld,
} from "@tabler/icons-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  AppState,
  AppStateStatus,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";
import { OneSignal } from "react-native-onesignal";

interface OptionType {
  id: number;
  title: string;
  description?: string;
  toggleBtn?: boolean;
  iconFontSize?: number;
  link?: string;
  disabled?: boolean;
  externalLink?: boolean;
}

interface GroupType {
  id: number;
  groupName: string;
  options: OptionType[];
}

const options: GroupType[] = [
  {
    id: 1,
    groupName: "General",
    options: [
      {
        id: 1,
        title: "Personal Information",
        link: "SettingPersonalInfoScreen",
      },
      {
        id: 2,
        title: "Pets",
        link: "PetProfileListScreen",
      },
      { id: 3, title: "Quotations", link: "CasesQuotesListScreen" },
    ],
  },
  {
    id: 2,
    groupName: "Settings",
    options: [
      {
        id: 4,
        title: "Push Notification",
        link: "",
      },
      {
        id: 3,
        title: "Language (soon)",
        disabled: true,
        externalLink: true,
        link: "/",
      },
    ],
  },
  {
    id: 3,
    groupName: "Privacy & Help",
    options: [
      {
        id: 2,
        title: "Legal",
        externalLink: true,
        link: "https://smoll.me/terms-and-conditions",
      },
      {
        id: 3,
        title: "Help",
        externalLink: true,
        link: "https://smoll.me/help",
      },
    ],
  },
];

const getOptionIcon = (title: string): React.ReactElement | undefined => {
  const iconSize = 26;
  const iconColor = "#222222";

  switch (title) {
    case "Personal Information":
      return <IconUserCircle size={iconSize} color={iconColor} />;
    case "Pets":
      return <IconPaw size={iconSize} color={iconColor} />;
    case "Quotations":
      return <IconChecklist size={iconSize} color={iconColor} />;
    case "Push Notification":
      return <IconBell size={iconSize} color={iconColor} />;
    case "Language (soon)":
      return <IconWorld size={iconSize} color={iconColor} />;
    case "Legal":
      return <IconGavel size={iconSize} color={iconColor} />;
    case "Help":
      return <IconHelp size={iconSize} color={iconColor} />;
    default:
      return undefined;
  }
};

// Todos:
// 1. Person icon needs to be changed
// 2. Remaining icons needs to be added
const SettingsMainScreen: React.FC<{ navigation: NavigationType }> = ({ navigation }) => {
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const checkPushNotificationStatus = useCallback(async () => {
    const deviceState = await OneSignal.Notifications.getPermissionAsync();
    setPushNotificationEnabled(deviceState ?? false);
  }, []);

  const { version, buildNumber } = useAppVersion();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    // Check status on initial mount
    checkPushNotificationStatus();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        console.log("App has come to the foreground!");
        checkPushNotificationStatus();
      }
    },
    [checkPushNotificationStatus]
  );

  const handlePushNotificationToggle = async (newValue: boolean) => {
    if (newValue) {
      const deviceState = await OneSignal.Notifications.getPermissionAsync();

      if (!deviceState) {
        const status = await OneSignal.Notifications.requestPermission(true);

        setPushNotificationEnabled(status);
      } else {
        setPushNotificationEnabled(true);
      }
    } else {
      // For turning off, we can't revoke permissions programmatically
      // So we'll just update the UI state
      Alert.alert(
        "Push Notifications",
        "Please go to your device settings to turn off push notifications.\n\nNote: This will disable all push notifications from the app, even the chat notifications.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Settings", onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await AsyncStorage.setItem("accessToken", "");
    AsyncStorage.removeItem("hideAccountSetupBtn");

    navigation.navigate("NewOnboardingScreen");
    logout();
  };

  return (
    <Layout showBack onBackPress={() => navigation.goBack()} title="You">
      <ScrollDiv showsVerticalScrollIndicator={false}>
        {options.map((group) => (
          <Div key={`${group?.id}`} mb={20} borderBottomWidth={1} borderBottomColor="#E0E0E0">
            <Text
              fontWeight="400"
              color="primary"
              fontSize={"lg"}
              fontFamily={fontHauora}
              lineHeight={24}
              mb={8}
            >
              {group.groupName}
            </Text>
            <Div>
              {group.options.map((option) => (
                <SettingButton
                  key={`${option?.id}`}
                  title={option.title}
                  icon={getOptionIcon(option.title)}
                  description={option?.description}
                  toggleBtn={option.title === "Push Notification"}
                  disabled={option?.disabled}
                  onPress={() => {
                    if (option.externalLink) {
                      Linking.openURL(option.link as string);
                    } else if (option.title === "Push Notification") {
                      handlePushNotificationToggle(!pushNotificationEnabled);
                    } else if (option.link) {
                      navigation.navigate(option.link);
                    }
                  }}
                  toggleValue={
                    option.title === "Push Notification" ? pushNotificationEnabled : undefined
                  }
                />
              ))}
            </Div>
          </Div>
        ))}

        <Div mt="auto" my={20}>
          <TouchableOpacity onPress={() => setShowLogoutModal(true)} style={{ marginBottom: 10 }}>
            <Div flexDir="row" alignItems="center">
              <Div mr={12} mt={3}>
                <IconLogout size={26} color="#6e99f0" />
              </Div>
              <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} lineHeight={24} color="#6e99f0">
                Logout
              </Text>
            </Div>
          </TouchableOpacity>

          <Text
            fontWeight="400"
            fontSize={"lg"}
            fontFamily={fontHauora}
            lineHeight={16}
            mb={6}
            color="#7B7B7B"
            mt={10}
          >
            App v {version} {Platform.OS === "ios" ? `(${buildNumber})` : ""}
          </Text>
        </Div>
      </ScrollDiv>

      <ConfirmationModal
        heading="Logout?"
        text="Are you sure you want to logout?"
        isLoading={false}
        showModal={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        confirmText="Confirm"
        cancelText="Cancel"
        confirmBgColor={colorErrorText}
        cancelBgColor="#222"
      />
    </Layout>
  );
};

export default SettingsMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

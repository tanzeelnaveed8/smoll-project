import Layout from "@/components/app/Layout";
import SettingButton from "@/components/partials/SettingButton";
import { fontHauora } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IconBell,
  IconCreditCard,
  IconGavel,
  IconPaw,
  IconUserCircle,
  IconWritingSign,
} from "@tabler/icons-react-native";
import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";
import { OneSignal } from "react-native-onesignal";

interface OptionType {
  id: number;
  title: string;
  description?: string;
  toggleBtn?: boolean;
  iconFontSize?: number;
  icon: any;
  link?: string;
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
        title: "Personal Info",
        icon: IconUserCircle,
        link: "SettingPersonalInfoScreen",
      },
      // {
      //   id: 2,
      //   title: "Address",
      //   icon: IconMap,
      //   link: "AccountSetupAddressScreen",
      // },
      {
        id: 3,
        title: "Pets Profile",
        icon: IconPaw,
        link: "PetProfileListScreen",
      },
      {
        id: 4,
        title: "Push Notification",
        icon: IconBell,
        description: "Enable push notifications to receive important messages.",
        toggleBtn: true,
        link: "",
      },
    ],
  },
  {
    id: 2,
    groupName: "Order & Cases",
    options: [
      // {
      //   id: 1,
      //   title: "Medicine Order",
      //   icon: IconPrescription,
      // },
      {
        id: 2,
        title: "Cases",
        icon: IconWritingSign,
        link: "CasesListScreen",
      },
    ],
  },
  {
    id: 3,
    groupName: "Billing and Security",
    options: [
      {
        id: 1,
        title: "Payment",
        icon: IconCreditCard,
      },
      {
        id: 3,
        title: "Legal",
        icon: IconGavel,
      },
    ],
  },
];

// Todos:
// 1. Person icon needs to be changed
// 2. Remaining icons needs to be added
const SettingsMainScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(false);

  useEffect(() => {
    checkPushNotificationStatus();
  }, []);

  const checkPushNotificationStatus = async () => {
    const deviceState = await OneSignal.Notifications.getPermissionAsync();

    console.log("deviceState", deviceState);
    setPushNotificationEnabled(deviceState ?? false);
  };

  const handlePushNotificationToggle = async (newValue: boolean) => {
    if (newValue) {
      const deviceState = await OneSignal.Notifications.getPermissionAsync();
      if (!deviceState) {
        const status = await OneSignal.Notifications.requestPermission(false);
        setPushNotificationEnabled(status);
      } else {
        setPushNotificationEnabled(true);
      }
    } else {
      // For turning off, we can't revoke permissions programmatically
      // So we'll just update the UI state
      setPushNotificationEnabled(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.setItem("accessToken", "");
    AsyncStorage.removeItem("hideAccountSetupBtn");

    navigation.navigate("NewOnboardingScreen");
  };

  return (
    <Layout showBack onBackPress={() => navigation.goBack()} title="Settings">
      <ScrollDiv showsVerticalScrollIndicator={false}>
        {options.map((group) => (
          <React.Fragment key={group.id}>
            <Text
              fontWeight="400"
              fontSize={"xl"}
              fontFamily={fontHauora}
              lineHeight={24}
              mb={8}
            >
              {group.groupName}
            </Text>
            <Div mb={24}>
              {group.options.map((option) => (
                <SettingButton
                  key={option.id}
                  title={option.title}
                  description={option?.description}
                  toggleBtn={option?.toggleBtn}
                  Icon={option.icon}
                  onPress={() => {
                    if (option.title === "Push Notification") {
                      handlePushNotificationToggle(!pushNotificationEnabled);
                    } else if (option.link) {
                      navigation.navigate(option.link);
                    }
                  }}
                  toggleValue={
                    option.title === "Push Notification"
                      ? pushNotificationEnabled
                      : undefined
                  }
                />
              ))}
            </Div>
          </React.Fragment>
        ))}

        <Div mt="auto" mb={20}>
          <TouchableOpacity onPress={handleLogout} style={{ marginBottom: 10 }}>
            <Text
              fontWeight="400"
              fontSize={18}
              fontFamily={fontHauora}
              lineHeight={24}
              color="#0189F9"
            >
              Logout
            </Text>
          </TouchableOpacity>

          <Text
            fontWeight="400"
            fontSize={18}
            fontFamily={fontHauora}
            lineHeight={24}
            mb={6}
            color="#7B7B7B"
          >
            App v 12.81
          </Text>
        </Div>
      </ScrollDiv>
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

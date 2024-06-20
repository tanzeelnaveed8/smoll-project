import { StyleSheet } from "react-native";
import React from "react";
import { Div, Text, ScrollDiv } from "react-native-magnus";
import { fontHauora } from "@/constant/constant";
import SettingButton from "@/components/partials/SettingButton";
import { iconFontFamilyType } from "react-native-magnus/lib/typescript/src/ui/icon/icon.type";

const options: GroupType[] = [
  {
    id: 1,
    groupName: "General",
    options: [
      {
        id: 1,
        title: "Personal Info",
        iconName: "user",
        iconFamily: "EvilIcons",
        iconFontSize: 38,
      },
      {
        id: 2,
        title: "Address",
        iconName: "map-outline",
        iconFamily: "Ionicons",
      },
      {
        id: 3,
        title: "Pets Profile",
        iconName: "paw-outline",
        iconFamily: "Ionicons",
      },
      {
        id: 4,
        title: "Push Notification",
        iconName: "notifications-outline",
        iconFamily: "Ionicons",
        description: "Enable push notifications to receive important messages.",
        toggleBtn: true,
      },
    ],
  },
  {
    id: 2,
    groupName: "Order & Cases",
    options: [
      {
        id: 1,
        title: "Medicine Order",
        iconName: "",
        iconFamily: "",
      },
      {
        id: 2,
        title: "Cases",
        iconName: "",
        iconFamily: "",
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
        iconName: "",
        iconFamily: "",
      },
      {
        id: 2,
        title: "Change Password",
        iconName: "",
        iconFamily: "",
      },
      {
        id: 3,
        title: "Legal",
        iconName: "",
        iconFamily: "",
      },
    ],
  },
];

const SettingsMainScreen = () => {
  return (
    <ScrollDiv style={styles.container} showsVerticalScrollIndicator={false}>
      <Text
        fontWeight="400"
        fontSize={"5xl"}
        fontFamily={fontHauora}
        lineHeight={36}
        mb={24}
      >
        Settings
      </Text>
      {options.map((group) => (
        <React.Fragment key={group.id}>
          <Text
            fontWeight="400"
            fontSize={18}
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
                iconName={option.iconName}
                iconFamily={option.iconFamily}
                iconFontSize={option?.iconFontSize}
                description={option?.description}
                toggleBtn={option?.toggleBtn}
              />
            ))}
          </Div>
        </React.Fragment>
      ))}

      <Div mt="auto" mb={20}>
        <Text
          fontWeight="400"
          fontSize={18}
          fontFamily={fontHauora}
          lineHeight={24}
          mb={8}
          color="#0189F9"
        >
          Logout
        </Text>
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
  );
};

export default SettingsMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

interface OptionType {
  id: number;
  title: string;
  iconName: string;
  iconFamily: iconFontFamilyType;
  description?: string;
  toggleBtn?: boolean;
  iconFontSize?: number;
}

interface GroupType {
  id: number;
  groupName: string;
  options: OptionType[];
}

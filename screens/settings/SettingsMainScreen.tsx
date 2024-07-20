import React, { ReactElement } from "react";
import { StyleSheet } from "react-native";
import { Div, Text, ScrollDiv } from "react-native-magnus";
import { fontHauora } from "@/constant/constant";
import SettingButton from "@/components/partials/SettingButton";
import {
  IconUserCircle,
  IconMap,
  IconPaw,
  IconBell,
  IconPrescription,
  IconWritingSign,
  IconCreditCard,
  IconSquareAsterisk,
  IconGavel,
  Icon,
} from "@tabler/icons-react-native";
import Container from "@/components/partials/Container";
import Layout from "@/components/app/Layout";
import { NavigationType } from "@/store/types";

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
      {
        id: 2,
        title: "Address",
        icon: IconMap,
        link: "",
      },
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
  return (
    <>
      <Layout
        style={{ paddingBottom: 0 }}
        onBackPress={() => navigation.goBack()}
      >
        <Div mb={20}>
          <Text
            fontWeight="400"
            fontSize={"5xl"}
            fontFamily={fontHauora}
            lineHeight={36}
            mb={24}
          >
            Settings
          </Text>

          <ScrollDiv>
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
                      // iconName={option.icon}
                      // iconFamily={option.iconFamily}
                      // iconFontSize={option?.iconFontSize}
                      description={option?.description}
                      toggleBtn={option?.toggleBtn}
                      Icon={option.icon}
                      onPress={() => {
                        option.link && navigation.navigate(option.link);
                      }}
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
        </Div>
      </Layout>
    </>
  );
};

export default SettingsMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

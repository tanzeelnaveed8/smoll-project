import { StyleSheet } from "react-native";
import React from "react";
import { Button, Div, Icon, Text } from "react-native-magnus";
import { fontHauora } from "@/constant/constant";
import SettingButton from "@/components/partials/SettingButton";

const SettingsMainScreen = () => {
  return (
    <Div style={styles.container}>
      <Text
        fontWeight="400"
        fontSize={"5xl"}
        fontFamily={fontHauora}
        lineHeight={36}
        mb={24}
      >
        Settings
      </Text>

      <Text
        fontWeight="400"
        fontSize={18}
        fontFamily={fontHauora}
        lineHeight={24}
        mb={6}
      >
        General
      </Text>

      <SettingButton />

      <Text
        fontWeight="400"
        fontSize={18}
        fontFamily={fontHauora}
        lineHeight={24}
        mb={8}
      >
        Order & Cases
      </Text>
      <Div mb={24}>
        <Text>Options....</Text>
      </Div>
      <Text
        fontWeight="400"
        fontSize={18}
        fontFamily={fontHauora}
        lineHeight={24}
        mb={8}
      >
        Billing and Security
      </Text>
      <Div mb={40}>
        <Text>Options....</Text>
      </Div>

      <Div mt="auto">
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
    </Div>
  );
};

export default SettingsMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

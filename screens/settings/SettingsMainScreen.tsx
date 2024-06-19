import { StyleSheet } from "react-native";
import React from "react";
import { Div, Text } from "react-native-magnus";
import { fontHauora } from "@/constant/constant";

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
      <Div mb={24}>
        <Text>Options....</Text>
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

import { fontHauoraBold, fontHauoraMedium } from "@/constant/constant";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Div, Icon, Image, Text } from "react-native-magnus";
import * as Progress from "react-native-progress";

const windowWidth = Dimensions.get("window").width;

const AccountSetupProgress: React.FC<{ mb?: number; progress: number }> = ({
  mb,
  progress,
}) => {
  return (
    <Div style={styles.accountSetupTrackerContainer} mb={mb}>
      <Div mb={14} flexDir="row" justifyContent="space-between">
        <Div
          flexDir="row"
          style={{
            alignItems: "center",
          }}
        >
          <Text fontSize={"xl"} fontFamily={fontHauoraBold} mr={2}>
            Account setup
          </Text>
          <Icon
            name="info"
            fontFamily="Feather"
            fontSize={24}
            color="#E02A2A"
            style={{ padding: 2, paddingTop: 5 }}
          />
        </Div>
        <Div flexDir="row" style={{ gap: 4, alignItems: "center" }}>
          <Image
            w={24}
            h={24}
            mx={"auto"}
            source={require("../../assets/images/flag-icon.png")}
          />
          <Text fontFamily={fontHauoraMedium} fontSize={"xl"} color="#222222">
            1/3
          </Text>
        </Div>
      </Div>

      <Progress.Bar
        progress={progress}
        height={8}
        width={windowWidth - 40}
        borderColor="transparent"
        color="#427594"
        style={{ backgroundColor: "#EFEFEF", width: "100%" }}
      />
    </Div>
  );
};

export default AccountSetupProgress;

const styles = StyleSheet.create({
  accountSetupTrackerContainer: {
    paddingVertical: 22,
    paddingHorizontal: 12,
    backgroundColor: "#DFE9EF",
    borderRadius: 12,
    // marginBottom: 42,
  },
});

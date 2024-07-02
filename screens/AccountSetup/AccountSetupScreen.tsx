import AccountSetupProgress from "@/components/partials/AccountSetupProgress";
import BottomSheet from "@/components/partials/BottomSheet";
import ModalCard from "@/components/partials/ModalCard";
import {
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";
import * as Progress from "react-native-progress";

const windowWidth = Dimensions.get("window").width;

const stepsBtn = [
  {
    name: "Basic Details",
    link: "ProfileAddressScreen",
  },
  {
    name: "Email Verification",
    link: "VerifyEmail",
  },
  {
    name: "Pet Profile",
    link: "PetProfileForm",
  },
];

const AccountSetupScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const showModal = true;

  const [completedSteps, setCompletedSteps] = useState(["Basic Details"]);

  const [isVisible, setIsVisible] = useState(showModal ? showModal : true);

  useEffect(() => {
    const showModal = route.params?.showModal === "true";
    if (showModal) {
      setIsVisible(showModal);
    }
  }, [route.params]);

  return (
    <BottomSheet isVisible={isVisible} h="95%">
      <Div>
        <Text fontSize={"6xl"} mb={12}>
          Jane, let’s finish setting up your account
        </Text>

        {/* <Div style={styles.accountSetupTrackerContainer}>
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
              <Text
                fontFamily={fontHauoraMedium}
                fontSize={"xl"}
                color="#222222"
              >
                1/3
              </Text>
            </Div>
          </Div>

          <Progress.Bar
            progress={0.3}
            height={8}
            width={windowWidth - 40}
            borderColor="transparent"
            color="#427594"
            style={{ backgroundColor: "#EFEFEF", width: "100%" }}
          />
        </Div> */}

        <AccountSetupProgress mb={42} progress={0.3} />

        <FlatList
          data={stepsBtn}
          renderItem={({ item }) => {
            return (
              <Button
                style={styles.stepBtn}
                p={0}
                w={"100%"}
                bg="transparent"
                onPress={() => {
                  setIsVisible(false);
                  navigation.navigate(item.link);
                }}
              >
                <Div style={styles.btnTextContainer}>
                  <Text
                    fontSize={"xl"}
                    fontFamily={fontHauoraSemiBold}
                    style={{
                      ...(completedSteps.includes(item.name)
                        ? styles.completedStepStyle
                        : {}),
                    }}
                  >
                    {item.name}
                  </Text>

                  {!completedSteps.includes(item.name) && (
                    <Icon
                      name="chevron-right"
                      fontFamily="Feather"
                      color="#222222"
                      fontSize={24}
                    />
                  )}
                </Div>

                {completedSteps.includes(item.name) ? (
                  <Icon
                    name="checkcircle"
                    fontFamily="AntDesign"
                    fontSize={24}
                    color="#368526"
                  />
                ) : (
                  <Div style={styles.emptyCheckbox} />
                )}
              </Button>
            );
          }}
          keyExtractor={(item) => item.name}
        />
      </Div>
    </BottomSheet>
  );
};

export default AccountSetupScreen;

const styles = StyleSheet.create({
  accountSetupTrackerContainer: {
    paddingVertical: 22,
    paddingHorizontal: 12,
    backgroundColor: "#DFE9EF",
    marginBottom: 42,
    borderRadius: 12,
  },
  stepBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: "#D0D7DC",
  },
  btnTextContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: "auto",
  },
  emptyCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 50,
    backgroundColor: "#F3F3F3",
  },
  completedStepStyle: {
    color: "#494949",
    textDecorationLine: "line-through",
  },
});

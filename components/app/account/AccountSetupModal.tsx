import BottomSheet from "@/components/partials/BottomSheet";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";
import * as Progress from "react-native-progress";

interface Props {
  navigation: NavigationType;
  isVisible: boolean;
  onBack: () => void;
}

const windowWidth = Dimensions.get("window").width;

const stepsBtn: {
  name: string;
  value: "basic" | "email" | "pet";
  link: string;
}[] = [
  {
    name: "Basic Details",
    value: "basic",
    link: "ProfileAddressScreen",
  },
  {
    name: "Email Verification",
    value: "email",
    link: "VerifyEmail",
  },
  {
    name: "Pet Profile",
    value: "pet",
    link: "PetProfileForm",
  },
];

const AccountSetupModal: React.FC<Props> = (props) => {
  const { user } = useUserStore();

  const [completedSteps, setCompletedSteps] = useState({
    basic: false,
    email: false,
    pet: false,
  });

  const completedStepCount = useMemo(
    () => Object.values(completedSteps).filter((step) => step).length,
    [completedSteps]
  );

  useEffect(() => {
    if (user?.address) {
      setCompletedSteps((s) => ({
        ...s,
        basic: true,
      }));
    }

    if (user?.email && user.isEmailVerified) {
      setCompletedSteps((s) => ({
        ...s,
        email: true,
      }));
    }

    // if(user.pet)
  }, [user]);

  const handleStepPress = (value: "basic" | "email" | "pet") => {
    // closing the modal
    props.onBack();

    if (value === "basic") {
      props.navigation.navigate("AccountSetupAddressScreen");
    } else if (value === "email") {
      props.navigation.navigate("AccountSetupEmailScreen");
    } else if (value === "pet") {
      props.navigation.navigate("PetProfileForm");
    }
  };

  return (
    <BottomSheet isVisible={props.isVisible} h="92%">
      <Div>
        <Text fontSize={"6xl"} mb={12}>
          Jane, let’s finish setting up your account
        </Text>

        <Div style={styles.accountSetupTrackerContainer}>
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
                source={require("../../../assets/images/flag-icon.png")}
              />
              <Text
                fontFamily={fontHauoraMedium}
                fontSize={"xl"}
                color="#222222"
              >
                {`${completedStepCount}/${stepsBtn.length}`}
              </Text>
            </Div>
          </Div>

          <Progress.Bar
            progress={completedStepCount / stepsBtn.length}
            height={8}
            width={windowWidth - 40}
            borderColor="transparent"
            style={{ backgroundColor: "#EFEFEF", width: "100%" }}
          />
        </Div>

        <FlatList
          data={stepsBtn}
          renderItem={({ item }) => {
            return (
              <Button
                style={styles.stepBtn}
                p={0}
                w={"100%"}
                bg="transparent"
                disabled={completedSteps[item.value]}
                onPress={() => handleStepPress(item.value)}
              >
                <Div style={styles.btnTextContainer}>
                  <Text
                    fontSize={"xl"}
                    fontFamily={fontHauoraSemiBold}
                    style={{
                      ...(completedSteps[item.value]
                        ? styles.completedStepStyle
                        : {}),
                    }}
                  >
                    {item.name}
                  </Text>

                  {!completedSteps[item.value] && (
                    <Icon
                      name="chevron-right"
                      fontFamily="Feather"
                      color="#222222"
                      fontSize={24}
                    />
                  )}
                </Div>

                {completedSteps[item.value] ? (
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

export default AccountSetupModal;

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

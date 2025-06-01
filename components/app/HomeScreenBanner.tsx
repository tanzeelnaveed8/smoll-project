import { fontHauoraBold, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { IconArrowRight } from "@tabler/icons-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Div, Image, Tag, Text, WINDOW_WIDTH } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
  isCarePlanUser: boolean;
}

const HomeScreenBanner: React.FC<Props> = ({ navigation, isCarePlanUser }) => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1.4,
        borderColor: "#6e99f0",
        borderRadius: 40,
        paddingVertical: 15,
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "center",
      }}
      onPress={() => {
        if (isCarePlanUser) {
          navigation.navigate("ExpertsListScreen");
        } else {
          navigation.navigate("SubscriptionScreen");
        }
      }}
    >
      <Div px={20} pr={0} h={191} flexDir="column" justifyContent="space-between">
        <Div mt={29}>
          <Image w={220} h={40} source={require("@/assets/icons/smollcare-logo.png")} />
        </Div>

        <Div
          style={{
            paddingVertical: 2,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Tag
            fontFamily={fontHauoraBold}
            fontSize={"lg"}
            bg="#6e99f0"
            h={42}
            color="#fff"
            rounded={25}
            pb={9.48}
            pt={7.52}
            px={25}
            pointerEvents="none"
          >
            {isCarePlanUser ? "Access your plan" : "Enroll your pet"}
          </Tag>

          <IconArrowRight
            width={28}
            height={28}
            strokeWidth={2.7}
            color="#6e99f0"
            style={{ alignSelf: "center" }}
          />

          {/* <Icon
          alignSelf="center"
          name="chevron-right"
          fontFamily="Feather"
          fontSize={24}
          color="#222"
            /> */}
        </Div>
      </Div>
    </TouchableOpacity>
  );
};

export default HomeScreenBanner;

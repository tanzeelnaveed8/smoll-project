import { fontHauoraBold, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { IconArrowRight } from "@tabler/icons-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Div, Image, Tag, Text, WINDOW_WIDTH } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
  isCarePlanUser: boolean;
  showButton?: boolean;
}

const HomeScreenBanner: React.FC<Props> = ({ navigation, isCarePlanUser, showButton = true }) => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1.4,
        borderColor: "#222",
        borderRadius: 40,
        paddingVertical: 15,
        flexDirection: "row",
        marginBottom: showButton ? 20 : 0,
        alignItems: "center",
      }}
      onPress={() => {
        if (isCarePlanUser) {
          navigation.navigate("ExpertsListScreen");
        } else {
          navigation.navigate("SubscriptionScreen");
        }
      }}
      disabled={!showButton}
    >
      <Div px={20} pr={0} h={191}>
        <Div mb={30} mt={showButton ? 34 : 64}>
          <Text fontSize={"4xl"} fontFamily={fontHauoraBold} lineHeight={27}>
            {isCarePlanUser ? "Chat with pet" : "‘Pawfect’ pet"}
          </Text>
          <Text fontSize={"4xl"} fontFamily={fontHauoraBold} lineHeight={27} mb={3}>
            {isCarePlanUser ? "wellness expert" : "care plan"}
          </Text>

          {isCarePlanUser && (
            <Text fontFamily={fontHauoraSemiBold} fontSize="lg" lineHeight={20}>
              Completly Free!
            </Text>
          )}
        </Div>

        {showButton && (
          <Div
            style={{
              paddingVertical: 2,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Tag
              fontFamily={fontHauoraSemiBold}
              fontSize={"md"}
              bg="#222"
              color="#fff"
              rounded={25}
              pb={9.48}
              pt={7.52}
              px={25}
              pointerEvents="none"
            >
              {isCarePlanUser ? "Chat Now" : "Enroll your pet"}
            </Tag>
            {isCarePlanUser && (
              <IconArrowRight
                width={28}
                height={28}
                strokeWidth={2.7}
                color="#222"
                style={{ alignSelf: "center" }}
              />
            )}
            {/* <Icon
          alignSelf="center"
          name="chevron-right"
          fontFamily="Feather"
          fontSize={24}
          color="#222"
            /> */}
          </Div>
        )}
      </Div>

      {/* <OnboardingIcon1 width={130} height={130} /> */}

      <Div
        style={{
          transform: [{ translateX: WINDOW_WIDTH <= 375 ? -40 : -0 }],
        }}
      >
        <Image
          source={
            isCarePlanUser
              ? require("@/assets/images/homepage-boy-img.png")
              : require("@/assets/images/homepage-pets-img.png")
          }
          w={200}
          h={190}
          style={{ objectFit: "contain", aspectRatio: "1/1" }}
        />
      </Div>
    </TouchableOpacity>
  );
};

export default HomeScreenBanner;

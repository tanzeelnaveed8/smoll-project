import Layout from "@/components/app/Layout";
import {
  fontHauora,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";

const NewOnboardingScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  return (
    <Layout>
      <Div px={8} justifyContent="space-between" flex={1}>
        <Div
          flexDir="row"
          justifyContent="space-between"
          alignItems="center"
          mb={150}
        >
          <Image
            w={90}
            h={30}
            style={{ objectFit: "contain" }}
            source={require("./../assets/logo.png")}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignupScreen");
            }}
          >
            <Button
              bg="transparent"
              px={8}
              py={2}
              rounded={30}
              borderWidth={1.5}
              borderColor="#222"
              color="#222"
              pointerEvents="none"
              fontFamily={fontHauoraSemiBold}
            >
              Get Started
            </Button>
          </TouchableOpacity>
        </Div>

        <Div mb={20}>
          <Text fontFamily={fontHauora} fontSize={74} lineHeight={74}>
            Access
          </Text>
          <Text fontFamily={fontHauora} fontSize={74} lineHeight={74}>
            to Pet
          </Text>
          <Text fontFamily={fontHauora} fontSize={74} lineHeight={74}>
            Experts
          </Text>
        </Div>

        <Image
          w={"100%"}
          h={400}
          mb={40}
          mx={"auto"}
          style={{ objectFit: "contain" }}
          source={require("./../assets/icons/splash-screen-image.png")}
        />
      </Div>
    </Layout>
  );
};

export default NewOnboardingScreen;

import Layout from "@/components/app/Layout";
import { NavigationType } from "@/store/types";
import React from "react";
import { Button, Div, Image, Text } from "react-native-magnus";
import { fontHauoraBold, fontHauoraSemiBold, fontHeading } from "@/constant/constant";
import { IconArrowRight } from "@tabler/icons-react-native";
import { useUserStore } from "@/store/modules/user";
import { Dimensions, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";

export default function SubscriptionScreen({ navigation }: { navigation: NavigationType }) {
  const { user } = useUserStore();

  const { height } = Dimensions.get("window");

  return (
    <Layout
      showBack
      onBackPress={() => {
        navigation.goBack();
      }}
      style={{ position: "relative", justifyContent: "flex-start", flex: 1 }}
    >
      <Div>
        <Div mt={4}>
          <Text fontSize="2xl" color="#679FF0" fontFamily={fontHeading}>
            Welcome To
          </Text>
          <Image w={157} h={28} mt={10} source={require("@/assets/icons/smollcare-logo.png")} />
        </Div>
        <Div alignItems="center" mt={32}>
          <Image
            w={"80%"}
            h={height * 0.45}
            source={require("@/assets/images/smollcare-screen.png")}
          />
        </Div>
        <Div mt={14}>
          <Div alignItems="center">
            <Div alignItems="center">
              <Text fontSize="xl" fontFamily={fontHauoraSemiBold} textAlign="center">
                Your smoll number is
              </Text>
              <Div position="relative" mt={8}>
                <Image source={require("@/assets/images/careId-bg.png")} w={300} h={70} />
                <Text
                  style={{ position: "absolute" }}
                  fontSize="8xl"
                  fontFamily={fontHauoraBold}
                  color="#1655C8"
                  textAlignVertical="center"
                  alignSelf="center"
                  lineHeight={68}
                >
                  {user?.careId}
                </Text>
              </Div>
            </Div>
            <Text
              mt={20}
              fontSize="md"
              maxW={210}
              textAlign="center"
              fontFamily={fontHauoraSemiBold}
              lineHeight={16}
            >
              Present this number at any of our partner locations and enjoy your smoll® Care
              benefits
            </Text>
          </Div>
          <Button
            fontSize={"lg"}
            fontFamily={fontHauoraSemiBold}
            color="primary"
            flexDir="row"
            alignItems="center"
            mx={"auto"}
            style={{ gap: 4 }}
            p={0}
            bg="transparent"
            onPress={() => {
              navigation.navigate("PetProfileListScreen");
            }}
            mt={32}
            mb={24}
          >
            <Text color="primary" fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
              My Pets
            </Text>
            <IconArrowRight
              width={24}
              height={24}
              color={"#427594"}
              strokeWidth={2}
              style={{ marginTop: 4 }}
            />
          </Button>
        </Div>
      </Div>
    </Layout>
  );
}

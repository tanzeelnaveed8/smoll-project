import Layout from "@/components/app/Layout";
import { NavigationType } from "@/store/types";
import React from "react";
import { Button, Div, Image, ScrollDiv, Text } from "react-native-magnus";
import {
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
  fontHeading,
} from "@/constant/constant";
import { IconArrowRight } from "@tabler/icons-react-native";
import { useUserStore } from "@/store/modules/user";
import { Dimensions } from "react-native";

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
      <ScrollDiv showsVerticalScrollIndicator={false}>
        <Div mt={4}>
          <Text fontSize="2xl" color="#679FF0" fontFamily={fontHeading}>
            Welcome to
          </Text>
          <Image w={157} h={28} mt={10} source={require("@/assets/icons/smollcare-logo.png")} />
        </Div>
        <Div alignItems="center" mt={32}>
          <Image
            w={"80%"}
            h={height * 0.44}
            style={{ objectFit: "contain" }}
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
                  fontFamily={fontHauora}
                  color="#1655C8"
                  textAlignVertical="center"
                  alignSelf="center"
                  lineHeight={64}
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
            color="#679FF0"
            flexDir="row"
            alignItems="center"
            mx={"auto"}
            style={{ gap: 4 }}
            p={0}
            bg="transparent"
            onPress={() => {
              navigation.navigate("PetProfileListScreen");
            }}
            mt={28}
            mb={24}
          >
            <Text color="primary" fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
              My Pets
            </Text>
            <IconArrowRight
              width={24}
              height={24}
              color="#679FF0"
              strokeWidth={2}
              style={{ marginTop: 4 }}
            />
          </Button>
        </Div>
      </ScrollDiv>
    </Layout>
  );
}

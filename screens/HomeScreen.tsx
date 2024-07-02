import Layout from "@/components/app/Layout";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";
import AccountCreatedCongratulationScreen from "./AccountSetup/AccountCreatedCongratulationScreen";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import {
  IconBell,
  IconChevronRight,
  IconUserCircle,
} from "@tabler/icons-react-native";
import BlankButton from "@/components/partials/BlankButton";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const suggestionList = [
  {
    name: "Human Counselling",
    description: "Therapy aids coping, enhances functioning",
    link: "",
  },
  {
    name: "Chat with Vet",
    description: "Ask vet about food, concerns",
    link: "",
  },
];

const HomeScreen = () => {
  return (
    <Layout
      style={{
        paddingTop: 20,
        justifyContent: "flex-start",
      }}
    >
      <Div
        mb={20}
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Div flexDir="row" alignItems="center" style={{ gap: 12 }}>
          <Image w={100} h={27} source={require("../assets/logo.png")} />
          <Image w={56} h={56} source={require("../assets/images/dog.png")} />
        </Div>

        <Div flexDir="row" alignItems="center" style={{ gap: 8 }}>
          <BlankButton>
            <IconBell
              width={32}
              height={32}
              color={"#222222"}
              strokeWidth={1.5}
            />
          </BlankButton>
          <BlankButton>
            <IconUserCircle
              width={32}
              height={32}
              color={"#222222"}
              strokeWidth={1.5}
            />
          </BlankButton>
        </Div>
      </Div>

      <Div mb={16}>
        <Text fontSize={"5xl"}>Hi, Jane Doe</Text>
        <Text fontSize={"lg"}>How can we help you today?</Text>
      </Div>

      <Div
        bg="#F3F9FC"
        px={16}
        py={18}
        style={{ borderRadius: 12 }}
        borderWidth={1}
        borderColor="#D0D7DC"
        mb={24}
      >
        <Div w={212} mb={16}>
          <Text fontSize={"2xl"}>Expert Advice for</Text>
          <Text fontSize={"2xl"} color="primary" mb={4}>
            Happier, Healthier Pets
          </Text>
          <Text>Receive a consultation for your pet</Text>
        </Div>

        <Button bg="transparent" p={0} py={2} style={{ gap: 12 }}>
          <Text fontFamily={fontHauoraSemiBold} fontSize={"lg"}>
            Get Started
          </Text>
          <Icon
            alignSelf="center"
            name="chevron-right"
            fontFamily="Feather"
            fontSize={24}
            mt={2}
            color="#222"
          />
        </Button>

        <Image
          source={require("../assets/images/home-page-highfy.png")}
          w={200}
          h={170}
          position="absolute"
          right={0}
          bottom={0}
        />
      </Div>

      <Div>
        <Div flexDir="row" style={{ gap: 8 }} alignItems="center" mb={16}>
          <Image
            source={require("../assets/images/home-start-icon.png")}
            w={24}
            h={24}
            mt={2}
          />
          <Text fontFamily={fontHauoraBold} fontSize={"xl"}>
            What do you want to do today?
          </Text>
        </Div>

        <FlatList
          data={suggestionList}
          renderItem={({ item, index }) => (
            <Button
              px={16}
              py={12}
              borderWidth={1}
              borderColor="#D0D7DC"
              mb={index + 1 === suggestionList.length ? 0 : 8}
              rounded={12}
              w={"100%"}
              bg="#fff"
              underlayColor="#f3f3f3"
            >
              <Div flex={1}>
                <Text fontSize={"lg"} fontFamily={fontHauoraBold}>
                  {item.name}
                </Text>
                <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                  {item.description}
                </Text>
              </Div>
              <IconChevronRight width={24} height={24} color={"#222222"} />
            </Button>
          )}
          keyExtractor={(item) => item.name}
        />
      </Div>
    </Layout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

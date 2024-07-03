import Layout from "@/components/app/Layout";
import IconButton from "@/components/partials/IconButton";
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
import { FlatList, StyleSheet } from "react-native";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";

import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import AccountSetupModal from "@/components/app/account/AccountSetupModal";
import OnboardingCongratsModal from "@/components/app/onboarding/OnboardingCongratsModal";
import TouchableWrapper from "@/components/partials/TouchableWrapper";

interface Props {
  navigation: NavigationType;
  isNewUser?: boolean;
}

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

const HomeScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const { user } = useUserStore();

  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  console.log("s", showAccountSetupModal);

  useEffect(() => {
    const showSetupModal =
      (route.params as Record<string, string>)?.showSetupModal === "true";

    const isNewUser =
      (route.params as Record<string, string>)?.isNewUser === "true";

    console.log("isNewUser", isNewUser, route.params);

    if (isNewUser) {
      setShowCongratsModal(true);
    }

    if (showSetupModal) {
      setShowAccountSetupModal(true);
    }
  }, [route.params]);

  // TODO: Add pet profile exist check.
  // Also check if congrats modal is open ( for new user ) if yes, don't do this.
  useEffect(() => {
    const basicInfoExist = Boolean(user?.address?.length);
    const emailInfoExist = user?.isEmailVerified;

    console.log("b", basicInfoExist, user, showCongratsModal);

    if ((!basicInfoExist || !emailInfoExist) && !showCongratsModal) {
      setTimeout(() => {
        setShowAccountSetupModal(true);
      }, 500);
    }
  }, [user]);

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
          <IconButton>
            <IconBell
              width={32}
              height={32}
              color={"#222222"}
              strokeWidth={1.5}
            />
          </IconButton>
          <IconButton>
            <IconUserCircle
              width={32}
              height={32}
              color={"#222222"}
              strokeWidth={1.5}
            />
          </IconButton>
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

        <TouchableWrapper
          style={{ paddingVertical: 2, flexDirection: "row", gap: 12 }}
        >
          {/* <Button bg="transparent" p={0} py={2} style={{ gap: 12 }}> */}
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
          {/* </Button> */}
        </TouchableWrapper>

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

      <OnboardingCongratsModal
        isVisible={showCongratsModal}
        onSuccess={async () => {
          setShowCongratsModal(false);

          setTimeout(() => {
            setShowAccountSetupModal(true);
          }, 500);
        }}
      />

      {/* remove it for now */}
      {/* <AccountSetupModal
        isVisible={showAccountSetupModal}
        onBack={() => setShowAccountSetupModal(false)}
        navigation={props.navigation}
      /> */}
    </Layout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

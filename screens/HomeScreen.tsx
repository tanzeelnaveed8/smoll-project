import Layout from "@/components/app/Layout";
import IconButton from "@/components/partials/IconButton";
import {
  colorPrimary,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import {
  IconBell,
  IconChevronRight,
  IconUserCircle,
} from "@tabler/icons-react-native";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";

import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import AccountSetupModal from "@/components/app/account/AccountSetupModal";
import OnboardingCongratsModal from "@/components/app/onboarding/OnboardingCongratsModal";
import TouchableWrapper from "@/components/partials/TouchableWrapper";
import AccountSetupProgress from "@/components/partials/AccountSetupProgress";
import { useCounsellorStore } from "@/store/modules/counsellor";
import { Session } from "@/store/types/counsellor";
import TabNaivationBar from "@/components/app/TabNaivationBar";

interface Props {
  navigation: NavigationType;
  isNewUser?: boolean;
}

interface OptionTab {
  name: string;
  description: string;
  value: "counselling" | "vet";
  loading: boolean;
}

const HomeScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const { user } = useUserStore();
  const { sessions, fetchSessions } = useCounsellorStore();

  const [options, setOptions] = useState<OptionTab[]>([
    {
      name: "Human Counselling",
      value: "counselling",
      description: "Therapy aids coping, enhances functioning",
      loading: false,
    },
    {
      name: "Chat with Vet",
      value: "vet",
      description: "Ask vet about food, concerns",
      loading: false,
    },
  ]);

  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  useEffect(() => {
    const showSetupModal =
      (route.params as Record<string, string>)?.showSetupModal === "true";

    const isNewUser =
      (route.params as Record<string, string>)?.isNewUser === "true";

    if (isNewUser) {
      setTimeout(() => {
        setShowCongratsModal(true);
      }, 500);
    }

    if (showSetupModal) {
      setShowAccountSetupModal(true);
    }
  }, [route.params]);

  const completedStep = useMemo(() => {
    const basicInfoExist = Boolean(user?.address?.length);
    const emailInfoExist = user?.isEmailVerified;
    const petInfoExist = (user?.petCount ?? 0) > 0;

    const completedStep = [basicInfoExist, emailInfoExist, petInfoExist].filter(
      (step) => step
    ).length;

    return completedStep;
  }, [user]);

  const setLoading = (option: OptionTab["value"], loading: boolean) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      const counsellingTab = newOptions.find((tab) => tab.value === option);
      if (counsellingTab) counsellingTab.loading = loading;
      return newOptions;
    });
  };

  const handleOptionTabPress = async (item: OptionTab) => {
    if (item.value === "counselling") {
      let _sessions = sessions;

      if (!sessions) {
        try {
          setLoading("counselling", true);
          _sessions = await fetchSessions();
        } finally {
          setLoading("counselling", false);
        }
      }

      if (!_sessions?.length) {
        props.navigation.navigate("CounsellingRequestScreen");
      } else {
        props.navigation.navigate("CounsellingInboxScreen");
      }
    }
  };

  useEffect(() => {
    console.log("ss", sessions);
  }, [sessions]);

  return (
    <>
      <Layout
        style={{
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
            <IconButton
              onPress={() => {
                props.navigation.navigate("Account");
              }}
            >
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
          <Text fontSize={"5xl"}>Hi, {user?.name}</Text>
          <Text fontSize={"lg"}>How can we help you today?</Text>
        </Div>

        {completedStep < 3 && (
          <Div mb={16}>
            <TouchableOpacity
              onPress={() => {
                setShowAccountSetupModal(true);
              }}
            >
              <AccountSetupProgress
                progress={(completedStep + 0.35) / 3}
                completedStepCount={completedStep}
              />
            </TouchableOpacity>
          </Div>
        )}

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
            data={options}
            renderItem={({ item, index }) => (
              <Button
                px={16}
                py={12}
                borderWidth={1}
                borderColor="#D0D7DC"
                mb={index + 1 === options.length ? 0 : 8}
                rounded={12}
                w={"100%"}
                disabled={item.loading}
                onPress={() => handleOptionTabPress(item)}
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
                {item.loading ? (
                  <ActivityIndicator color={colorPrimary} />
                ) : (
                  <IconChevronRight width={24} height={24} color={"#222222"} />
                )}
              </Button>
            )}
            keyExtractor={(item) => item.name}
          />
        </Div>

        <OnboardingCongratsModal
          isVisible={showCongratsModal}
          onSuccess={async () => {
            setShowCongratsModal(false);
          }}
        />

        {/* remove it for now */}
        <AccountSetupModal
          isVisible={showAccountSetupModal}
          onBack={() => setShowAccountSetupModal(false)}
          navigation={props.navigation}
        />
      </Layout>

      <TabNaivationBar navigation={props.navigation} />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

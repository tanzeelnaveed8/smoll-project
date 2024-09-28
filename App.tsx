import { StripeProvider } from "@stripe/stripe-react-native";
import { SafeAreaView, StyleSheet } from "react-native";
import { Div, Text, ThemeProvider } from "react-native-magnus";

import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { fontHauora, fontHauoraSemiBold } from "./constant/constant";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountSetupAddressScreen from "./screens/AccountSetup/AccountSetupAddressScreen";
import AccountSetupEmailOtpScreen from "./screens/AccountSetup/AccountSetupEmailOtpScreen";
import AccountSetupEmailScreen from "./screens/AccountSetup/AccountSetupEmailScreen";
import OnboardingScreen from "./screens/OnboardingScreen";

import { ToastProvider } from "react-native-toast-notifications";
import CounsellingChatScreen from "./screens/Counselling/CounsellingChatScreen";
import CounsellingInboxScreen from "./screens/Counselling/CounsellingInboxScreen";
import CounsellingRequestScreen from "./screens/Counselling/CounsellingRequestScreen";
import HomeScreen from "./screens/HomeScreen";
import { SocketProvider } from "./socket/provider";

import PartnerVetConfirmationScreen from "./screens/Cases/PartnerVetConfirmationScreen";
import PartnerVetDetailScreen from "./screens/Cases/PartnerVetDetailScreen";
import PartnerVetScreen from "./screens/Cases/PartnerVetScreen";
import PartnerVetSuccessfullScreen from "./screens/Cases/PartnerVetSuccessfullScreen";
import ConsultationCaseBriefScreen from "./screens/Consultation/ConsultationCaseBriefScreen";
import ConsultationFeedbackScreen from "./screens/Consultation/ConsultationFeedbackScreen";
import ConsultationVideoScreen from "./screens/Consultation/ConsultationVideoScreen";
import ConsultationWaitingScreen from "./screens/Consultation/ConsultationWaitingScreen";
import ExpertsChatScreen from "./screens/Experts/ExpertsChatScreen";
import ExpertsInboxScreen from "./screens/Experts/ExpertsInboxScreen";
import ExpertsListDetailScreen from "./screens/Experts/ExpertsListDetailScreen";
import ExpertsListScreen from "./screens/Experts/ExpertsListScreen";
// import PetProfileCongratulationsScreen from "./screens/PetProfile/PetProfileCongratulationsScreen";
import PetProfileCongratulationsScreen from "./screens/PetProfile/PetProfileCongratulationsScreen";
import PetProfileMedicalHistoryScreen from "./screens/PetProfile/PetProfileMedicalHistoryScreen";
import PetProfileScreen from "./screens/PetProfile/PetProfileScreen";

import SlotBookingScreen from "./screens/doctorsScreens/SlotBookingScreen";
import EditInfoScreen from "./screens/settings/EditInfoScreen";
import PetEditInfoScreen from "./screens/settings/PetEditInfoScreen";
import PetProfileDetailsScreen from "./screens/settings/PetProfileDetailsScreen";
import PetProfileListScreen from "./screens/settings/PetProfileListScreen";
import SettingPersonalInfoScreen from "./screens/settings/SettingPersonalInfoScreen";
import SettingsMainScreen from "./screens/settings/SettingsMainScreen";
import { useUserStore } from "./store/modules/user";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import FlashMessage from "react-native-flash-message";
import { LogLevel, OneSignal } from "react-native-onesignal";
import CaseDetailScreen from "./screens/Cases/CaseDetailScreen";
import RequestCallBackScreen from "./screens/Consultation/UnavailableScreen";
import ExpertsScheduleConfirmationScreen from "./screens/Experts/ExpertsScheduleConfirmationScreen";
import ExpertsScheduleSuccessScreen from "./screens/Experts/ExpertsScheduleSuccessScreen";
import NotificationScreen from "./screens/NotificationScreen";
import NotificationTestScreen from "./screens/NotificationTestScreen";
import SplashScreen from "./screens/SplashScreen";
import * as rootNavigation from "./utils/root-navigation";
import { navigationRef } from "./utils/root-navigation";

import SignupScreen from "./components/app/onboarding/SignupScreen";
import AppointmentDetailsScreen from "./screens/Appointments/AppointmentDetailsScreen";
import AppointmentsScreen from "./screens/Appointments/AppointmentsScreen";
import CaseQuoteDescriptionScreen from "./screens/Cases/CaseQuoteDescriptionScreen";
import CaseQuotesScreen from "./screens/Cases/CaseQuotesScreen";
import CasesQuotesListScreen from "./screens/Cases/CasesQuotesListScreen";
import PaymentDetailsScreen from "./screens/Cases/PaymentDetailsScreen";
import UnavailableScreen from "./screens/Consultation/UnavailableScreen";
import NewOnboardingScreen from "./screens/NewOnboardingScreen";
import { initializeSendbird } from "./utils/chat.v2";
import {
  IconChecklist,
  IconMessage,
  IconWindow,
} from "@tabler/icons-react-native";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

async function loadFonts() {
  await Font.loadAsync({
    Hauora: require("./assets/fonts/Hauora//Hauora-Regular.ttf"),
    HauoraMedium: require("./assets/fonts/Hauora/Hauora-Medium.ttf"),
    HauoraSemiBold: require("./assets/fonts/Hauora/Hauora-SemiBold.ttf"),
    HauoraBold: require("./assets/fonts/Hauora/Hauora-Bold.ttf"),

    Cooper: require("./assets/fonts/Cooper/CooperLtBT-Regular.ttf"),
    CooperMedium: require("./assets/fonts/Cooper/CooperMdBT-Regular.ttf"),
    CooperBold: require("./assets/fonts/Cooper/CooperBlkBT-Regular.ttf"),
  });
}

const theme = {
  fontSize: {
    "5xl": 28,
    "2xl": 20,
    xl: 18,
    lg: 16,
    md: 14,
  },
  colors: {
    primary: "#427594",
    primaryLight: "#518cb0",
    bgColor: "#FAF8F5",
    // primaryLight: "#f10",
    darkGreyText: "#494949",
  },
  components: {
    Text: {
      fontFamily: fontHauora,
      color: "#222",
    },
    Input: {
      fontFamily: fontHauora,
    },
    Button: {
      fontFamily: fontHauora,
    },
  },
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const TabButton: React.FC<{ focused: boolean; icon: React.ReactNode }> = ({
    focused,
    icon,
  }) => {
    return (
      <>
        <Div
          h={4}
          bg={focused ? "#000" : "transparent"}
          w={60}
          mb={2}
          style={{
            borderBottomRightRadius: 4,
            borderBottomLeftRadius: 4,
          }}
        />
        {icon}
      </>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: fontHauoraSemiBold,
        },
        tabBarInactiveTintColor: "#494949",
        tabBarActiveTintColor: "#222",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabButton
              focused={focused}
              icon={
                <IconWindow
                  width={28}
                  height={28}
                  color={focused ? "#000" : "#494949"}
                />
              }
            />
          ),
        }}
      />

      {/* <Tab.Screen
        name="HumanCounsellingMessage"
        component={HumanCounsellingMessageScreen}
        options={{
          title: "Chats",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconMessage
              width={28}
              height={28}
              color={focused ? "#427594" : "#494949"}
            />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Chats"
        component={ExpertsInboxScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabButton
              focused={focused}
              icon={
                <IconMessage
                  width={28}
                  height={28}
                  color={focused ? "#000" : "#494949"}
                />
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="Quotations"
        component={CasesQuotesListScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabButton
              focused={focused}
              icon={
                <IconChecklist
                  width={28}
                  height={28}
                  color={focused ? "#000" : "#494949"}
                />
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const { user } = useUserStore();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));

    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    // OneSignal Initialization
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID as string);
    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.Notifications.requestPermission(true);
    // Method for listening for notification clicks

    OneSignal.Notifications.addEventListener("click", (event) => {
      const additionalData = event.notification?.additionalData as {
        notificationType?: string;
        consultationId?: string;
      };
      if (additionalData?.notificationType === "consultation-notification") {
        rootNavigation.navigate("ConsultationWaitingScreen", {
          consultationId: additionalData.consultationId,
        });
      }

      if (event.notification?.additionalData?.notificationType === "chat") {
        const expertId = event.notification?.additionalData?.expertId;
        const expertName = event.notification?.additionalData?.expertName;

        if (expertId) {
          rootNavigation.navigate("ExpertsChatScreen", {
            expertId,
            expertName,
          });
        }
      }

      if (
        event.notification?.additionalData?.notificationType ===
          "quote-submitted" ||
        event.notification?.additionalData?.notificationType === "quote-updated"
      ) {
        const caseId = event.notification?.additionalData?.caseId;
        const partnerId = event.notification?.additionalData?.partnerId;

        rootNavigation.navigate("CaseQuoteDescriptionScreen", {
          caseId,
          id: partnerId,
        });
      }
    });

    // Method for listening for notifications received
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      (event) => {
        console.log("event", event);

        // @ts-ignore
        if (event.notification?.additionalData?.notificationType === "chat") {
          const currentRoute = rootNavigation.getCurrentRoute();
          // @ts-ignore
          const expertId = event.notification?.additionalData?.expertId;
          // @ts-ignore
          const expertName = event.notification?.additionalData?.expertName;

          if (
            currentRoute?.name !== "ExpertsChatScreen" &&
            // @ts-ignore
            currentRoute?.params?.expertId !== expertId &&
            // @ts-ignore
            currentRoute?.params?.expertName !== expertName
          ) {
            event.notification.display();
          }
        } else {
          event.notification.display();
        }
      }
    );

    return () => {
      OneSignal.Notifications.removeEventListener("click", () => {});
      OneSignal.Notifications.removeEventListener(
        "foregroundWillDisplay",
        () => {}
      );
    };
  }, []);

  useEffect(() => {
    if (user) {
      OneSignal.login(user.playerId);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !user.name) return;
    // const sendbirdUserId = "419772";
    // const sendbirdAccessToken = "d75dad4fde9a54d0518efeb8b62d9ac42d267930";

    initializeSendbird(user.id, user.playerId, user.name, user.profileImg?.url);
  }, [user]);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Or any other loading component
  }

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ThemeProvider theme={theme}>
        <NavigationContainer ref={navigationRef}>
          <ToastProvider
            placement="bottom"
            textStyle={{
              textTransform: "capitalize",
            }}
            duration={2500}
          >
            <SocketProvider>
              <StripeProvider
                publishableKey={
                  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
                }
                merchantIdentifier="merchant.identifier" // required for Apple Pay
                urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
              >
                <Stack.Navigator
                  initialRouteName="SplashScreen"
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="SplashScreen" component={SplashScreen} />

                  <Stack.Screen
                    name="OnboardingScreen"
                    component={OnboardingScreen}
                  />
                  <Stack.Screen
                    name="NewOnboardingScreen"
                    component={NewOnboardingScreen}
                  />
                  <Stack.Screen name="SignupScreen" component={SignupScreen} />

                  <Stack.Screen
                    name="AccountSetupAddressScreen"
                    component={AccountSetupAddressScreen}
                  />
                  <Stack.Screen
                    name="AccountSetupEmailScreen"
                    component={AccountSetupEmailScreen}
                  />
                  <Stack.Screen
                    name="AccountSetupEmailOtpScreen"
                    component={AccountSetupEmailOtpScreen}
                  />
                  {/* <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                  /> */}

                  <Stack.Screen
                    name="HomeScreen"
                    component={TabNavigation}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="NotificationScreen"
                    component={NotificationScreen}
                  />
                  <Stack.Screen
                    name="NotificationTestScreen"
                    component={NotificationTestScreen}
                  />
                  <Stack.Screen
                    name="PetProfileScreen"
                    component={PetProfileScreen}
                  />
                  <Stack.Screen
                    name="PetProfileMedicalHistoryScreen"
                    component={PetProfileMedicalHistoryScreen}
                  />
                  <Stack.Screen
                    name="PetProfileCongratulationsScreen"
                    component={PetProfileCongratulationsScreen}
                  />
                  <Stack.Screen
                    name="CounsellingRequestScreen"
                    component={CounsellingRequestScreen}
                  />
                  <Stack.Screen
                    name="CounsellingInboxScreen"
                    component={CounsellingInboxScreen}
                  />
                  <Stack.Screen
                    name="CounsellingChatScreen"
                    component={CounsellingChatScreen}
                  />
                  <Stack.Screen
                    name="ExpertsListScreen"
                    component={ExpertsListScreen}
                  />
                  <Stack.Screen
                    name="ExpertsListDetailScreen"
                    component={ExpertsListDetailScreen}
                  />
                  <Stack.Screen
                    name="ExpertsInboxScreen"
                    component={ExpertsInboxScreen}
                  />
                  <Stack.Screen
                    name="ExpertsChatScreen"
                    component={ExpertsChatScreen}
                  />
                  <Stack.Screen
                    name="ConsultationCaseBriefScreen"
                    component={ConsultationCaseBriefScreen}
                  />
                  <Stack.Screen
                    name="ConsultationWaitingScreen"
                    component={ConsultationWaitingScreen}
                    options={{
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name="UnavailableScreen"
                    component={UnavailableScreen}
                  />
                  <Stack.Screen
                    name="ConsultationVideoScreen"
                    component={ConsultationVideoScreen}
                    options={{
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name="RequestCallBackScreen"
                    component={RequestCallBackScreen}
                  />

                  <Stack.Screen
                    name="ExpertsScheduleConfirmationScreen"
                    component={ExpertsScheduleConfirmationScreen}
                  />
                  <Stack.Screen
                    name="ExpertsScheduleSuccessScreen"
                    component={ExpertsScheduleSuccessScreen}
                    options={{
                      gestureEnabled: false,
                    }}
                  />

                  <Stack.Screen
                    name="CasesQuotesListScreen"
                    component={CasesQuotesListScreen}
                  />

                  <Stack.Screen
                    name="CaseDetailScreen"
                    component={CaseDetailScreen}
                  />

                  <Stack.Screen
                    name="CaseQuotesScreen"
                    component={CaseQuotesScreen}
                  />
                  <Stack.Screen
                    name="CaseQuoteDescriptionScreen"
                    component={CaseQuoteDescriptionScreen}
                  />

                  <Stack.Screen
                    name="PartnerVetScreen"
                    component={PartnerVetScreen}
                  />
                  <Stack.Screen
                    name="SlotBookingScreen"
                    component={SlotBookingScreen}
                  />
                  <Stack.Screen
                    name="PartnerVetDetailScreen"
                    component={PartnerVetDetailScreen}
                  />
                  <Stack.Screen
                    name="PartnerVetConfirmationScreen"
                    component={PartnerVetConfirmationScreen}
                  />
                  <Stack.Screen
                    name="PartnerVetSuccessfullScreen"
                    component={PartnerVetSuccessfullScreen}
                  />
                  <Stack.Screen
                    name="SettingPersonalInfoScreen"
                    component={SettingPersonalInfoScreen}
                  />
                  <Stack.Screen
                    name="EditInfoScreen"
                    component={EditInfoScreen}
                  />
                  <Stack.Screen
                    name="PetEditInfoScreen"
                    component={PetEditInfoScreen}
                  />
                  <Stack.Screen
                    name="ConsultationFeedbackScreen"
                    component={ConsultationFeedbackScreen}
                    options={{
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name="PetProfileListScreen"
                    component={PetProfileListScreen}
                  />
                  <Stack.Screen
                    name="PetProfileDetailsScreen"
                    component={PetProfileDetailsScreen}
                  />
                  <Stack.Screen
                    name="SettingsMainScreen"
                    component={SettingsMainScreen}
                  />
                  {/* Appointments Screens */}
                  <Stack.Screen
                    name="AppointmentsScreen"
                    component={AppointmentsScreen}
                  />
                  <Stack.Screen
                    name="AppointmentDetailsScreen"
                    component={AppointmentDetailsScreen}
                  />

                  <Stack.Screen
                    name="PaymentDetailsScreen"
                    component={PaymentDetailsScreen}
                  />
                </Stack.Navigator>
              </StripeProvider>
            </SocketProvider>
            <FlashMessage position="top" />
          </ToastProvider>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingBottom: 5,
    // paddingTop: StatusBar.currentHeight,
    // paddingBottom: 20,
  },
});

export default App;

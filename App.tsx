import { SafeAreaView, StyleSheet } from "react-native";
import { Text, ThemeProvider } from "react-native-magnus";

import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { fontHauora } from "./constant/constant";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import { CometChatWrapper } from "./utils/chat";

import CasesListScreen from "./screens/Cases/CasesListScreen";
import CasesRequestScreen from "./screens/Cases/CasesRequestScreen";
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
import CaseForwardedScreen from "./screens/Consultation/CaseForwardedScreen";
import RequestCallBackScreen from "./screens/Consultation/RequestCallBackScreen";
import ExpertsScheduleConfirmationScreen from "./screens/Experts/ExpertsScheduleConfirmationScreen";
import ExpertsScheduleSuccessScreen from "./screens/Experts/ExpertsScheduleSuccessScreen";
import NotificationScreen from "./screens/NotificationScreen";
import NotificationTestScreen from "./screens/NotificationTestScreen";
import { useExpertStore } from "./store/modules/expert";
import * as rootNavigation from "./utils/root-navigation";
import { navigationRef } from "./utils/root-navigation";
import SplashScreen from "./screens/SplashScreen";
import ClinicProposalScreen from "./screens/bookingForm/ClinicProposalScreen";
import AppointmentsScreen from "./screens/Appointments/AppointmentsScreen";
import AppointmentDetailsScreen from "./screens/Appointments/AppointmentDetailsScreen";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

async function loadFonts() {
  await Font.loadAsync({
    Hauora: require("./assets/fonts/Hauora//Hauora-Regular.ttf"),
    HauoraMedium: require("./assets/fonts/Hauora/Hauora-Medium.ttf"),
    HauoraSemiBold: require("./assets/fonts/Hauora/Hauora-SemiBold.ttf"),
    HauoraBold: require("./assets/fonts/Hauora/Hauora-Bold.ttf"),
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

const App = () => {
  const { user } = useUserStore();
  const { expertDetailMap, fetchExpertDetail } = useExpertStore();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));

    CometChatWrapper.init();

    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    // OneSignal Initialization
    OneSignal.initialize("d6759ef5-566c-48b8-97cf-5ce0f3c4bb21");
    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.Notifications.requestPermission(true);
    // Method for listening for notification clicks

    // OneSignal.Notifications.addEventListener("click", (event) => {
    //   if (
    //     event.notification?.additionalData?.notificationType ===
    //     "consultation-notification"
    //   ) {
    //     rootNavigation.navigate("ConsultationWaitingScreen", {
    //       consultationId: event.notification?.additionalData?.consultationId,
    //     });
    //   }
    // });

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
    });
    // Method for listening for notifications received
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      (event) => {
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
      CometChatWrapper.initUIKit(user.id);
    }
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
                <Stack.Screen
                  name="HomeScreen"
                  component={HomeScreen}
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
                  name="CaseForwardedScreen"
                  component={CaseForwardedScreen}
                />
                <Stack.Screen
                  name="ExpertsScheduleConfirmationScreen"
                  component={ExpertsScheduleConfirmationScreen}
                />
                <Stack.Screen
                  name="ExpertsScheduleSuccessScreen"
                  component={ExpertsScheduleSuccessScreen}
                />
                <Stack.Screen
                  name="CaseDetailScreen"
                  component={CaseDetailScreen}
                />
                {/*  */}
                <Stack.Screen
                  // name="PartnerClinic"
                  name="CasesListScreen"
                  component={CasesListScreen}
                />
                <Stack.Screen
                  name="ClinicProposalScreen"
                  component={ClinicProposalScreen}
                />
                <Stack.Screen
                  name="CasesRequestScreen"
                  component={CasesRequestScreen}
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

                {/* <Stack.Screen name="Membership" component={MembershipScreen} />
          

              // <Stack.Screen name="ChatScreen" component={ChatScreen} /> */}
                {/* <Stack.Screen
              name="UserProfileForm"
              component={
                UserProfileScreen as ScreenComponentType<
                  ParamListBase,
                  "UserProfileForm"
                >
              }
            /> */}
              </Stack.Navigator>
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

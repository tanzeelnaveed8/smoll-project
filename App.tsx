import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Div, ThemeProvider } from "react-native-magnus";

import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { fontHauora, fontHauoraSemiBold } from "./constant/constant";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
import PetProfileCongratulationsScreen from "./screens/petProfile/PetProfileCongratulationsScreen";
import PetProfileMedicalHistoryScreen from "./screens/petProfile/PetProfileMedicalHistoryScreen";
import PetProfileScreen from "./screens/petProfile/PetProfileScreen";

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
import { OneSignal } from "react-native-onesignal";
import CaseDetailScreen from "./screens/Cases/CaseDetailScreen";
import RequestCallBackScreen from "./screens/Consultation/UnavailableScreen";
import ExpertsScheduleConfirmationScreen from "./screens/Experts/ExpertsScheduleConfirmationScreen";
import ExpertsScheduleSuccessScreen from "./screens/Experts/ExpertsScheduleSuccessScreen";
import SplashScreen from "./screens/SplashScreen";
import * as rootNavigation from "./utils/root-navigation";
import { navigationRef } from "./utils/root-navigation";

import { useUIStore } from "@/store/modules/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import {
  IconChecklist,
  IconMessage,
  IconWindow,
} from "@tabler/icons-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SignupScreen from "./components/app/onboarding/SignupScreen";
import AppointmentDetailsScreen from "./screens/Appointments/AppointmentDetailsScreen";
import AppointmentsScreen from "./screens/Appointments/AppointmentsScreen";
import CaseQuoteDescriptionScreen from "./screens/Cases/CaseQuoteDescriptionScreen";
import CaseQuotesScreen from "./screens/Cases/CaseQuotesScreen";
import CasesQuotesListScreen from "./screens/Cases/CasesQuotesListScreen";
import PaymentDetailsScreen from "./screens/Cases/PaymentDetailsScreen";
import UnavailableScreen from "./screens/Consultation/UnavailableScreen";
import NewOnboardingScreen from "./screens/NewOnboardingScreen";
import NotificationScreen from "./screens/NotificationScreen";
import { initializeChat, zim } from "./utils/chat.v2";
import * as Sentry from "@sentry/react-native";
import EmergencyScreen from "./screens/EmergencyScreen";
import ClinicListScreen from "./screens/Clinic/ClinicListScreen";
import ClinicDetailScreen from "./screens/Clinic/ClinicDetailScreen";
import Config from "react-native-config";
import { ZIMConversationQueryConfig, ZIMConversationType, ZIMEventHandler } from "zego-zim-react-native";
import { useExpertStore } from "./store/modules/expert";
import { useSound } from "./functions/useSound";
import { transformMessages } from "./utils/helpers";

Sentry.init({
  dsn: Config.SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  enableAutoSessionTracking: true,
});

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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const BASE_FONT_SCALE = SCREEN_WIDTH < 350 ? 0.85 : 1; // Reduce base font size by 15% on small screens

const BASE_FONT_SCALE =
  SCREEN_WIDTH < 320
    ? 0.72 // Very small screens (iPhone SE 1st gen)
    : SCREEN_WIDTH < 350
    ? 0.75 // Small screens
    : SCREEN_WIDTH < 375
    ? 0.85 // Medium screens
    : 1;

// Create a utility function to scale fonts
export const scaleFontSize = (size: number): number => {
  return Math.round(size * BASE_FONT_SCALE);
};

const theme = {
  fontSize: {
    // "5xl": 28,
    // "2xl": 20,
    // xl: 18,
    // lg: 16,
    // md: 14,
    "5xl": scaleFontSize(28),
    "2xl": scaleFontSize(20),
    "4xl": scaleFontSize(24),
    "6xl": scaleFontSize(32),
    xl: scaleFontSize(18),
    lg: scaleFontSize(16),
    md: scaleFontSize(14),
    sm: scaleFontSize(12),
    xs: scaleFontSize(11),
  },
  colors: {
    primary: "#427594",
    primaryLight: "#518cb0",
    bgColor: "#FAF8F5",
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
  const TabButton: React.FC<{ focused: boolean; icon: React.ReactNode;isNotification?:Boolean }> = ({
    focused,
    icon,
    isNotification
  }) => {

    const styles: {container:ViewStyle; notification:ViewStyle} = {
      container:{
          borderBottomRightRadius: 4,
          borderBottomLeftRadius: 4,
          position:'relative'
      },
      notification:{
        position: "absolute",
        top: 3,
        right: 52, 
        width: 10,
        height: 10,
        backgroundColor: '#f52c11',
        borderRadius: 5, 
      }
    }

    return (
      <>
        <Div
          h={4}
          bg={focused ? "#000" : "transparent"}
          w={60}
          mb={2}
          style={styles.container}
        />
        {icon}
        {isNotification && <Div style={styles.notification} />
        }
      </>
    );
  };
  
  const [allUnreadMessageCount,setAllUnreadMessageCount ] = useState(0)
  const {unreadMessages} = useExpertStore()

  useEffect(()=>{
    let countMessage = 0
    Array.from(unreadMessages.values()).forEach((count) => (countMessage += count))
    setAllUnreadMessageCount(countMessage)
  },[unreadMessages.size])

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 2,
          backgroundColor: "#FAF8F5",
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
              isNotification={Boolean(allUnreadMessageCount)}
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
  const { backgroundColor } = useUIStore();
  const [envs, setEnvs] = useState<{
    ONESIGNAL_APP_ID: string;
    STRIPE_PUBLISHABLE_KEY: string;
    ZEGO_APP_ID: string;
    ZEGO_APP_SIGN: string;
    ZEGO_SERVER_SECRET: string;
  } | null>(null);
 
  const {getUnreadMessage ,fetchExperts ,conversations ,setConversations ,activeConvo ,setUnreadMessage , unreadMessages} = useExpertStore();
  const { play } = useSound();


  
  useEffect(() => {
    (async () => {
      loadFonts().then(() => setFontsLoaded(true));

      if (Platform.OS === "ios") {
        PushNotificationIOS.requestPermissions({
          alert: true,
          badge: false,
          sound: false,
          critical: true,
        });
      }

      // Ensure OneSignal is initialized before adding event listeners
      if (envs) {
        OneSignal.Notifications.requestPermission(true);

        OneSignal.Notifications.addEventListener("click", (event) => {
          const additionalData = event.notification?.additionalData as {
            notificationType?: string;
            consultationId?: string;
            caseId?: string;
            vetId?: string;
            petName?: string;
            partnerId?: string;
            partnerBookingId?: string;
            expertId?: string;
            expertName?: string;
          };

          if (
            additionalData?.notificationType === "consultation-notification"
          ) {
            rootNavigation.navigate("AppointmentDetailsScreen", {
              id: additionalData.consultationId,
              type: "video",
            });
          }

          if (
            additionalData?.notificationType === "quote-submitted" ||
            additionalData?.notificationType === "quote-updated"
          ) {
            const caseId = additionalData.caseId;
            const partnerId = additionalData.partnerId;

            rootNavigation.navigate("CaseQuoteDescriptionScreen", {
              caseId,
              id: partnerId,
            });
          }

          if (
            additionalData?.notificationType === "partner-booking-notification"
          ) {
            const partnerBookingId = additionalData.partnerBookingId;

            rootNavigation.navigate("AppointmentDetailsScreen", {
              id: partnerBookingId,
              type: "in-clinic",
            });
          }

          if (additionalData?.notificationType === "chat") {
            rootNavigation.navigate("ExpertsChatScreen", {
              expertId: additionalData.expertId,
              expertName: additionalData.expertName,
            });
          }

          if (
            additionalData?.notificationType === "vet-consultation-reminder"
          ) {
            rootNavigation.navigate("ConsultationWaitingScreen", {
              consultationId: additionalData.consultationId,
              petName: additionalData.petName,
            });
          }
        });

        // Method for listening for notifications received
        OneSignal.Notifications.addEventListener(
          "foregroundWillDisplay",
          (event) => {
            const additionalData = event.notification?.additionalData as {
              expertId?: string;
            };
            const expertId = (
              rootNavigation.getCurrentRoute()?.params as Record<string, string>
            )?.expertId;

            if (
              rootNavigation.getCurrentRoute()?.name === "ExpertsChatScreen" &&
              additionalData?.expertId === expertId
            ) {
              return;
            }

            event.notification.display();
          }
        );
      }
    })();

    return () => {
      OneSignal.Notifications.removeEventListener("click", () => {});
      OneSignal.Notifications.removeEventListener(
        "foregroundWillDisplay",
        () => {}
      );
      PushNotificationIOS.removeEventListener("register");
      PushNotificationIOS.removeEventListener("notification");
    };
  }, [envs]);

  useEffect(() => {
    (async () => {
      if (user && user.name) {
        Sentry.setUser({
          id: user.id,
          name: user.name,
          email: `${user.email}`,
        });

        const storedEnvs = await AsyncStorage.getItem("envs");

        if (storedEnvs) {
          const parsedEnvs = JSON.parse(storedEnvs);
          setEnvs(parsedEnvs);

          // Ensure OneSignal is initialized before any other OneSignal methods
          OneSignal.initialize(parsedEnvs?.ONESIGNAL_APP_ID as string);

          if (user.playerId) {
            OneSignal.login(user.playerId);
          }

          const experts = await fetchExperts()

          await initializeChat(
            parsedEnvs?.ZEGO_APP_ID as string,
            parsedEnvs?.ZEGO_APP_SIGN as string,
            user.id,
            user.playerId,
            user.name,
            user?.profileImg?.url ?? ""
          ); 

          await getUnreadMessage()

          const eventHandler: Partial<ZIMEventHandler> = {
            receivePeerMessage: async (zim, { messageList, fromConversationID }) => {
              const convoName = experts?.find((exp)=>exp.id = fromConversationID)?.id as string
              const transformedMessages = transformMessages(messageList,{recipientId:fromConversationID, chatWithName:convoName});
      
              const updatedConversations = conversations

              const prevMessages = conversations.get(fromConversationID) as []
              updatedConversations.set(fromConversationID,[...transformedMessages,...prevMessages])
              setConversations(updatedConversations)

                const updatedUnreadMessages = unreadMessages
                 //IF fromConversation user is same as active user then clear unread message
                 console.log(activeConvo === fromConversationID,activeConvo , fromConversationID)
                 
                  if (activeConvo === fromConversationID) {
                    updatedUnreadMessages.delete(fromConversationID)
                  }else{
                  //Handling unread message count
                  const count = unreadMessages.get(fromConversationID) || 0
                  updatedUnreadMessages.set(fromConversationID, count + 1)
                  }

                  setUnreadMessage(updatedUnreadMessages)


              // setMessages((prevMessages) => [
              //   ...transformedMessages,
              //   ...prevMessages,
              // ]);
      
              play("messageReceived");
      
              // if (isAtBottomRef.current) {
              //   await new Promise((resolve) => setTimeout(resolve, 400));
              //   scrollToBottom();
              // } else {
              //   setShowNewMessageChip(true);
              // }
            },
          };
      
          zim.on("receivePeerMessage", eventHandler.receivePeerMessage!);
      
          return () => {
            zim.off("receivePeerMessage");
          };
        }
      }
    })();
  }, [user]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <ThemeProvider theme={theme}>
          <Div flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Div>
        </ThemeProvider>
      </SafeAreaView>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.safeAreaViewContainer, { backgroundColor }]}
        >
          <StatusBar barStyle="dark-content" />
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
                    statusBarColor: "#FAF8F5",
                  }}
                >
                  <Stack.Screen name="SplashScreen" component={SplashScreen} />
                  <Stack.Screen
                    name="OnboardingScreen"
                    component={OnboardingScreen}
                    options={{
                      gestureEnabled: false,
                    }}
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
                    options={{ headerShown: false, gestureEnabled: false }}
                  />
                  <Stack.Screen
                    name="NotificationScreen"
                    component={NotificationScreen}
                  />
                  <Stack.Screen
                    name="ClinicListScreen"
                    component={ClinicListScreen}
                    // options={{ headerShown: false, gestureEnabled: false }}
                  />
                  <Stack.Screen
                    name="ClinicDetailScreen"
                    component={ClinicDetailScreen}
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
                    options={{ headerTintColor: "#222" }}
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
                    options={{
                      gestureEnabled: false,
                    }}
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
                    name="EmergencyScreen"
                    component={EmergencyScreen}
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
              </SocketProvider>
              <FlashMessage position="top" />
            </ToastProvider>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
  },
});

export default Sentry.wrap(App);

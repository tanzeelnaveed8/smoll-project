import { SafeAreaView, StyleSheet } from "react-native";
import { Text, ThemeProvider } from "react-native-magnus";

import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
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
// import PetProfileScreen from "./screens/petProfile/PetProfileScreen";
// import PetProfileScreen from "./screens/petProfile/PetProfileScreen";
import CasesListScreen from "./screens/Cases/CasesListScreen";
import CasesRequestScreen from "./screens/Cases/CasesRequestScreen";
import PartnerVetScreen from "./screens/Cases/PartnerVetScreen";
import SlotBookingScreen from "./screens/doctorsScreens/SlotBookingScreen";
import PartnerVetDetailScreen from "./screens/Cases/PartnerVetDetailScreen";
import PartnerVetConfirmationScreen from "./screens/Cases/PartnerVetConfirmationScreen";
import PartnerVetSuccessfullScreen from "./screens/Cases/PartnerVetSuccessfullScreen";
import CaseBriefScreen from "./screens/VideoConsultation/CaseBriefScreen";
import WaitingRoomScreen from "./screens/VideoConsultation/WaitingRoomScreen";
import VideoConsultationFeedbackScreen from "./screens/VideoConsultation/VideoConsultationFeedbackScreen";
import SettingsMainScreen from "./screens/settings/SettingsMainScreen";
import SettingPersonalInfoScreen from "./screens/settings/SettingPersonalInfoScreen";

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

const windowHeight = Dimensions.get("window").height;

const Stack = createNativeStackNavigator();
const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
    CometChatWrapper.init();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Or any other loading component
  }

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {/* <ScrollDiv contentContainerStyle={{ flexGrow: 1 }}> */}
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <ToastProvider
            placement="bottom"
            textStyle={{
              textTransform: "capitalize",
            }}
            duration={2500}
          >
            <SocketProvider>
              <Stack.Navigator
                initialRouteName="OnboardingScreen"
                screenOptions={{
                  headerShown: false,
                }}
              >
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
                {/* <Stack.Screen
                  name="PetProfileScreen"
                  component={PetProfileScreen}
                /> */}
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
                  // name="PartnerClinic"
                  name="CasesListScreen"
                  component={CasesListScreen}
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
                {/* VideoConsultationScreens */}
                <Stack.Screen
                  name="CaseBriefScreen"
                  component={CaseBriefScreen}
                />
                <Stack.Screen
                  name="WaitingRoomScreen"
                  component={WaitingRoomScreen}
                />
                <Stack.Screen
                  name="VideoConsultationFeedbackScreen"
                  component={VideoConsultationFeedbackScreen}
                />
                {/*  */}
                <Stack.Screen name="Account" component={SettingsMainScreen} />
                <Stack.Screen
                  name="SettingPersonalInfoScreen"
                  component={SettingPersonalInfoScreen}
                />

                {/* <Stack.Screen name="Membership" component={MembershipScreen} />
          

              <Stack.Screen name="ChatScreen" component={ChatScreen} /> */}
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

import { Div, Icon, ScrollDiv, Text } from "react-native-magnus";
import { ThemeProvider } from "react-native-magnus";
import Onboarding from "./screens/Onboarding";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  FlatList,
  View,
} from "react-native";

import * as Font from "expo-font";
import { useEffect, useState } from "react";
import Register from "./screens/auth/Register";
import VerifyNumberScreen from "./screens/auth/VerifyNumberScreen";
import WelcomeMessageScreen from "./screens/WelcomeMessageScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import UserProfileScreen from "./screens/profile/UserProfileScreen";
import { fontHauora } from "./constant/constant";
import PetProfileScreen from "./screens/petProfileForm/PetProfileScreen";
import { Dimensions } from "react-native";
import PetBookingScreen from "./screens/bookingForm/PetBookingScreen";
import RequiresUrgentAttentionScreen from "./screens/RequiresUrgentAttentionScreen";
import InClinicDetailsScreen from "./screens/bookingForm/InClinicDetailsScreen";
import SettingsMainScreen from "./screens/settings/SettingsMainScreen";
import SettingPersonalInfoFirstNameScreen from "./screens/settings/SettingPersonalInfoFirstNameScreen";
import SettingPersonalInfoLastNameScreen from "./screens/settings/SettingPersonalInfoLastNameScreen";
import SettingPersonalInfoEmailScreen from "./screens/settings/SettingPersonalInfoEmailScreen";
import SettingPersonalInfoPhoneNoScreen from "./screens/settings/SettingPersonalInfoPhoneNoScreen";
import SettingPersonalInfoScreen from "./screens/settings/SettingPersonalInfoScreen";
import DoctotsListScreen from "./screens/doctorsScreens/DoctotsListScreen";
import SlotBookingScreen from "./screens/doctorsScreens/SlotBookingScreen";
import DetailsScreen from "./screens/doctorsScreens/DetailsScreen";
import ConfirmationScreen from "./screens/petProfileForm/ConfirmationScreen";

import { NavigationContainer, ParamListBase } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserNameScreen from "./screens/auth/UserNameScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountSetupScreen from "./screens/AccountSetup/AccountSetupScreen";
import ProfileAddressScreen from "./screens/profile/ProfileAddressScreen";
import VerifyEmailScreen from "./screens/AccountSetup/VerifyEmailScreen";
import VerifyEmailOtpScreen from "./screens/AccountSetup/VerifyEmailOtpScreen";
import HomeScreen from "./screens/HomeScreen";
import MembershipScreen from "./screens/HumanCounselling/MembershipScreen";
import HumanCounsellingMessageScreen from "./screens/HumanCounselling/HumanCounsellingMessageScreen";
import ChatScreen from "./screens/ChatScreen";
import { AuthStateProvider } from "./store/auth/provider";
import PartnerClinicScreen from "./screens/partnerClinics/PartnerClinicScreen";

type ScreenComponentType<P, N extends string> = React.ComponentType<P>;

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

// const screensData = [<Onboarding />, <Register />];
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PartnerClinic"
        component={PartnerClinicScreen}
        options={{ title: "Partner", headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={PetProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        component={SettingsMainScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Or any other loading component
  }
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      {/* <ScrollDiv contentContainerStyle={{ flexGrow: 1 }}> */}
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <AuthStateProvider>
            <Stack.Navigator
              initialRouteName="Landing"
              screenOptions={{
                headerShown: false,
                statusBarHidden: true,
              }}
            >
              <Stack.Screen
                name="Landing"
                component={TabNavigation}
                options={{ headerShown: false }}
              />

              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen
                name="VerifyNumber"
                component={VerifyNumberScreen}
              />
              <Stack.Screen name="SignUpUserName" component={UserNameScreen} />
              <Stack.Screen
                name="Confirmation"
                component={WelcomeMessageScreen}
              />

              <Stack.Screen
                name="AccountSetup"
                component={AccountSetupScreen}
              />
              <Stack.Screen
                name="ProfileAddressScreen"
                component={ProfileAddressScreen}
              />
              <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
              <Stack.Screen
                name="VerifyEmailOtp"
                component={VerifyEmailOtpScreen}
              />
              <Stack.Screen
                name="PetProfileForm"
                component={PetProfileScreen}
              />
              <Stack.Screen name="Membership" component={MembershipScreen} />
              <Stack.Screen
                name="HumanCounsellingMessage"
                component={HumanCounsellingMessageScreen}
              />
              <Stack.Screen name="ChatScreen" component={ChatScreen} />

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
          </AuthStateProvider>
        </NavigationContainer>

        {/* <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator> */}
      </ThemeProvider>
      {/* </ScrollDiv> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
    // paddingBottom: 20,
  },
});

export default App;

import { SafeAreaView, StyleSheet } from "react-native";
import { Text, ThemeProvider } from "react-native-magnus";

import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { TOAST_CONFIGS, fontHauora } from "./constant/constant";
import WelcomeMessageScreen from "./screens/WelcomeMessageScreen";
import PetProfileScreen from "./screens/petProfileForm/PetProfileScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountSetupScreen from "./screens/AccountSetup/AccountSetupScreen";
import VerifyEmailOtpScreen from "./screens/AccountSetup/VerifyEmailOtpScreen";
import VerifyEmailScreen from "./screens/AccountSetup/VerifyEmailScreen";
import HomeScreen from "./screens/HomeScreen";
import HumanCounsellingMessageScreen from "./screens/HumanCounselling/HumanCounsellingMessageScreen";
import MembershipScreen from "./screens/HumanCounselling/MembershipScreen";
// import UserNameScreen from "./screens/auth/UserNameScreen";
import ProfileAddressScreen from "./screens/profile/ProfileAddressScreen";
import OnboardingScreen from "./screens/OnboardingScreen";

type ScreenComponentType<P, N extends string> = React.ComponentType<P>;
import { ToastProvider } from "react-native-toast-notifications";

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
    xl: 18,
    lg: 16,
    md: 14,
  },
  colors: {
    primary: "#427594",
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
          <ToastProvider
            placement="top"
            textStyle={{
              textTransform: "capitalize",
            }}
          >
            <Stack.Navigator
              initialRouteName="OnboardingScreen"
              screenOptions={{
                headerShown: false,
                // statusBarHidden: true,
              }}
            >
              <Stack.Screen
                name="OnboardingScreen"
                component={OnboardingScreen}
              />
              <Stack.Screen
                name="WelcomeMessageScreen"
                component={WelcomeMessageScreen}
              />
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen
                name="AccountSetupScreen"
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
          </ToastProvider>
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

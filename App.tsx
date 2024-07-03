import { SafeAreaView, StyleSheet } from "react-native";
import { Text, ThemeProvider } from "react-native-magnus";

import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { fontHauora } from "./constant/constant";
import PetProfileScreen from "./screens/petProfileForm/PetProfileScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import HumanCounsellingMessageScreen from "./screens/HumanCounselling/HumanCounsellingMessageScreen";
import MembershipScreen from "./screens/HumanCounselling/MembershipScreen";
import { ToastProvider } from "react-native-toast-notifications";
import AccountSetupAddressScreen from "./screens/AccountSetup/AccountSetupAddressScreen";
import AccountSetupEmailOtpScreen from "./screens/AccountSetup/AccountSetupEmailOtpScreen";
import AccountSetupEmailScreen from "./screens/AccountSetup/AccountSetupEmailScreen";
import ChatScreen from "./screens/ChatScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import ProfileAddressScreen from "./screens/profile/ProfileAddressScreen";

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
            placement="center"
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

              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen
                name="PetProfileScreen"
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

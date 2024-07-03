import { SafeAreaView, StyleSheet } from "react-native";
import { Text, ThemeProvider } from "react-native-magnus";

import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import {
  fontHauora,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "./constant/constant";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import HumanCounsellingMessageScreen from "./screens/HumanCounselling/HumanCounsellingMessageScreen";
import MembershipScreen from "./screens/HumanCounselling/MembershipScreen";
import AccountSetupAddressScreen from "./screens/AccountSetup/AccountSetupAddressScreen";
import AccountSetupEmailOtpScreen from "./screens/AccountSetup/AccountSetupEmailOtpScreen";
import AccountSetupEmailScreen from "./screens/AccountSetup/AccountSetupEmailScreen";
import ChatScreen from "./screens/ChatScreen";
import PartnerClinicScreen from "./screens/partnerClinics/PartnerClinicScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import PetProfileScreen from "./screens/petProfile/PetProfileScreen";

import { ToastProvider } from "react-native-toast-notifications";
import SettingsMainScreen from "./screens/settings/SettingsMainScreen";
import WelcomeMessageScreen from "./screens/WelcomeMessageScreen";
import {
  IconBuildingHospital,
  IconMessage,
  IconSettings,
  IconWindow,
} from "@tabler/icons-react-native";

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
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: fontHauoraSemiBold,
        },
        tabBarInactiveTintColor: "#494949",
        tabBarActiveTintColor: "#427594",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconWindow
              width={28}
              height={28}
              color={focused ? "#427594" : "#494949"}
            />
          ),
        }}
      />

      <Tab.Screen
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
      />

      <Tab.Screen
        name="PartnerClinic"
        component={PartnerClinicScreen}
        options={{
          title: "Partner",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconBuildingHospital
              width={28}
              height={28}
              color={focused ? "#427594" : "#494949"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={SettingsMainScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconSettings
              width={28}
              height={28}
              color={focused ? "#427594" : "#494949"}
            />
          ),
        }}
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
          <ToastProvider
            placement="center"
            textStyle={{
              textTransform: "capitalize",
            }}
          >
            <Stack.Navigator
              initialRouteName="LandingScreen"
              screenOptions={{
                headerShown: false,
                // statusBarHidden: true,
              }}
            >
              <Stack.Screen
                name="LandingScreen"
                component={TabNavigation}
                options={{ headerShown: false }}
              />

              {/* <Stack.Screen name="Onboarding" component={Onboarding} /> */}
              <Stack.Screen
                name="OnboardingScreen"
                component={OnboardingScreen}
              />
              {/* <Stack.Screen name="Register" component={Register} /> */}
              {/* <Stack.Screen
                name="VerifyNumber"
                component={VerifyNumberScreen}
              /> */}
              {/* <Stack.Screen name="SignUpUserName" component={UserNameScreen} /> */}
              <Stack.Screen
                name="Confirmation"
                component={WelcomeMessageScreen}
              />

              {/* <Stack.Screen
                name="AccountSetup"
                component={AccountSetupScreen}
              /> */}
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
              {/* <Stack.Screen
                name="HumanCounsellingMessage"
                component={HumanCounsellingMessageScreen}
              /> */}
              <Stack.Screen name="ChatScreen" component={ChatScreen} />
            </Stack.Navigator>
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

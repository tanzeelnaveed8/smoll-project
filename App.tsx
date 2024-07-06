import { SafeAreaView, StyleSheet } from "react-native";
import { Text, ThemeProvider } from "react-native-magnus";

import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { fontHauora, fontHauoraSemiBold } from "./constant/constant";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountSetupAddressScreen from "./screens/AccountSetup/AccountSetupAddressScreen";
import AccountSetupEmailOtpScreen from "./screens/AccountSetup/AccountSetupEmailOtpScreen";
import AccountSetupEmailScreen from "./screens/AccountSetup/AccountSetupEmailScreen";
import HomeScreen from "./screens/HomeScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import PartnerClinicScreen from "./screens/partnerClinics/PartnerClinicScreen";

import {
  IconBuildingHospital,
  IconSettings,
  IconWindow,
} from "@tabler/icons-react-native";
import { ToastProvider } from "react-native-toast-notifications";
import PetProfileScreen from "./screens/PetProfile/PetProfileScreen";
import WelcomeMessageScreen from "./screens/WelcomeMessageScreen";
import SettingsMainScreen from "./screens/settings/SettingsMainScreen";
import CounsellingRequestScreen from "./screens/HumanCounselling/CounsellingRequestScreen";
import { SocketProvider } from "./socket/provider";
import ChatScreen from "./screens/ChatScreen";

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
        name="HomeScreen"
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
                  // statusBarHidden: true,
                }}
              >
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

                <Stack.Screen
                  name="HomeScreen"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="PetProfileScreen"
                  component={PetProfileScreen}
                />

                <Stack.Screen
                  name="CounsellingRequestScreen"
                  component={CounsellingRequestScreen}
                />

                <Stack.Screen name="ChatScreen" component={ChatScreen} />

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

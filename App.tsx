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

import { NavigationContainer, ParamListBase } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserNameScreen from "./screens/auth/UserNameScreen";

type ScreenComponentType<P, N extends string> = React.ComponentType<P>;

async function loadFonts() {
  await Font.loadAsync({
    Hauora: require("./assets/fonts/Hauora//Hauora-Regular.ttf"),
    HauoraSemiBold: require("./assets/fonts/Hauora/Hauora-SemiBold.ttf"),
    HauoraMedium: require("./assets/fonts/Hauora/Hauora-Medium.ttf"),
  });
}

const theme = {
  fontSize: {
    "5xl": 28,
    xl: 18,
    lg: 16,
    md: 14,
  },
  components: {
    Text: {
      fontFamily: fontHauora,
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

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const screens = [
  {
    name: "Home",
    screen: Onboarding,
  },
  {
    name: "Register",
    screen: Register,
  },
];

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
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={Onboarding} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="SignUpUserName" component={UserNameScreen} />
            {/* <Stack.Screen name="VerifyNumber" component={VerifyNumberScreen} /> */}
            {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
            <Stack.Screen
              name="Confirmation"
              component={WelcomeMessageScreen}
            />
            <Stack.Screen
              name="UserProfileForm"
              component={
                UserProfileScreen as ScreenComponentType<
                  ParamListBase,
                  "UserProfileForm"
                >
              }
            />

            {/* <Stack.Screen name="Home" component={Onboarding} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingBottom: 20,
    // paddingHorizontal: 20,
    // marginHorizontal: 20,
  },

  // container: {
  //   height: windowHeight - 70,
  //   overflow: "hidden",
  //   marginTop: 12,
  //   marginBottom: 34,
  // },
});

export default App;

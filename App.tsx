import { StatusBar } from "expo-status-bar";
import { Div, ScrollDiv, Text } from "react-native-magnus";
import { ThemeProvider } from "react-native-magnus";
import Onboarding from "./screens/Onboarding";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import * as Font from "expo-font";
import { useEffect, useState } from "react";
import Register from "./screens/auth/Register";
import VerifyEmailScreen from "./screens/auth/VerifyEmailScreen";
import WelcomeMessageScreen from "./screens/WelcomeMessageScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import UserProfileScreen from "./screens/profile/UserProfileScreen";
import { fontHauora } from "./constant/constant";
import PetProfileScreen from "./screens/petProfile/PetProfileScreen";
import { Dimensions } from "react-native";
import PetBookingScreen from "./screens/bookingForm/PetBookingScreen";
import DoctotsListScreen from "./screens/doctorsScreens/DoctotsListScreen";

async function loadFonts() {
  await Font.loadAsync({
    Hauora: require("./assets/fonts/Hauora//Hauora-Regular.ttf"),
  });
}

const theme = {
  fontSize: {
    "5xl": 28,
    xl: 18,
    md: 14,
    lg: 16,
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

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Or any other loading component
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <ScrollDiv style={{ flex: 1 }}> */}
      <ThemeProvider theme={theme}>
        <Div style={styles.container}>
          {/* <Onboarding /> */}
          {/* <Register /> */}
          {/* <LoginScreen /> */}
          {/* <VerifyEmailScreen /> */}
          {/* <WelcomeMessageScreen /> */}
          {/* <UserProfileScreen /> */}
          {/* <PetProfileScreen /> */}
          {/* <PetBookingScreen /> */}
          <DoctotsListScreen />
        </Div>
      </ThemeProvider>
      {/* </ScrollDiv> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: windowHeight,
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 20,
    fontFamily: "Hauora",
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 34,
    color: "#222222",
  },
});

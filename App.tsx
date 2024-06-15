import { StatusBar } from "expo-status-bar";
import { Div, Text } from "react-native-magnus";
import { ThemeProvider } from "react-native-magnus";
import Onboarding from "./screens/Onboarding";
import { StyleSheet } from "react-native";

import * as Font from "expo-font";
import { useEffect, useState } from "react";
import Register from "./screens/Auth/Register";
import VerifyEmailScreen from "./screens/Auth/VerifyEmailScreen";
import WelcomeMessageScreen from "./screens/WelcomeMessageScreen";
import LoginScreen from "./screens/Auth/LoginScreen";

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
  },
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Or any other loading component
  }
  return (
    <ThemeProvider theme={theme}>
      <Div style={styles.container}>
        {/* <Onboarding /> */}
        {/* <Register /> */}
        {/* <VerifyEmailScreen /> */}
        {/* <WelcomeMessageScreen /> */}
        <LoginScreen />
      </Div>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    fontFamily: "Hauora",
    overflow: "hidden",
    marginTop: 70,
    marginBottom: 34,
    color: "#222222",
  },
});

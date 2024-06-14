import { StatusBar } from "expo-status-bar";
import { Div, Text } from "react-native-magnus";
import { ThemeProvider } from "react-native-magnus";
import Onboarding from "./screens/Onboarding/Onboarding";
import { StyleSheet } from "react-native";

import * as Font from "expo-font";
import { useEffect, useState } from "react";

async function loadFonts() {
  await Font.loadAsync({
    "Eagle Lake": require("./assets/fonts/EagleLake-Regular.ttf"),
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
        <Onboarding />
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
    fontFamily: "Eagle Lake",
    overflow: "hidden",
  },
});

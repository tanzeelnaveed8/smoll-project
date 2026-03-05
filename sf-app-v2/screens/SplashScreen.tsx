import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { DEV_MOCK_USER } from "@/utils/mockData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Div, Image } from "react-native-magnus";

const SplashScreen: React.FC<{ navigation: NavigationType }> = ({ navigation }) => {
  const { findUser, setDevUser } = useUserStore();

  useEffect(() => {
    const getStoredToken = async () => {
      const storedToken = await AsyncStorage.getItem("accessToken");

      if (storedToken) {
        try {
          await findUser(true);
          navigation.navigate("HomeScreen");
        } catch (error) {
          setTimeout(() => {
            navigation.navigate("NewOnboardingScreen");
          }, 1000);
        }
        return;
      }

      // Dev-only: skip login/OTP and go straight to Home with a mock user so you can explore the app.
      if (__DEV__) {
        setDevUser(DEV_MOCK_USER);
        setTimeout(() => navigation.navigate("HomeScreen"), 500);
        return;
      }

      setTimeout(() => {
        navigation.navigate("NewOnboardingScreen");
      }, 1000);
    };

    getStoredToken();
  }, []);

  return (
    <Div bg="#FAF8F5" flex={1} justifyContent="center" alignItems="center">
      <Image source={require("../assets/logo.png")} w={220} h={60} />
    </Div>
  );
};

export default SplashScreen;

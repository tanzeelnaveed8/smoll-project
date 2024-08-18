import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Div, Image } from "react-native-magnus";

const SplashScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { findUser } = useUserStore();

  useEffect(() => {
    const getStoredToken = async () => {
      const storedToken = await AsyncStorage.getItem("accessToken");

      if (storedToken) {
        try {
          await findUser(true);
          navigation.navigate("HomeScreen");
        } catch (error) {
          setTimeout(() => {
            navigation.navigate("OnboardingScreen");
          }, 1000);
        }
      } else {
        setTimeout(() => {
          navigation.navigate("OnboardingScreen");
        }, 1000);
      }
    };

    getStoredToken();
  }, []);

  return (
    <Div bg="#fff" flex={1} justifyContent="center" alignItems="center">
      <Image source={require("../assets/logo.png")} w={220} h={60} />
    </Div>
  );
};

export default SplashScreen;

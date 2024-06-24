import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauora } from "@/constant/constant";
import React from "react";
import { StyleSheet } from "react-native";
import { Div, Image, Text } from "react-native-magnus";

const WelcomeMessageScreen = () => {
  return (
    <Div>
      <Div style={styles.imageContainer}></Div>

      <Text fontSize={"5xl"} fontFamily={fontHauora} mb={12} textAlign="center">
        Welcome! Let's personalize your profile.
      </Text>

      <Text fontSize={"xl"} textAlign="center" color="#494949" mb={32}>
        Begin the journey of building not just your own profile, but also
        crafting a profile for your beloved pet.
      </Text>

      <ButtonPrimary>Build Profile</ButtonPrimary>
    </Div>
  );
};

export default WelcomeMessageScreen;

const styles = StyleSheet.create({
  imageContainer: {
    aspectRatio: 350 / 212,
    backgroundColor: "#C5C5C5",
    marginTop: 64,
    marginBottom: 24,
    width: "100%",
  },
});

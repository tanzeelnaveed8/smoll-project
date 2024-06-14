import React from "react";
import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { Div, Image, Text } from "react-native-magnus";
import { Image as NativeImg } from "react-native";
import logo from "@/assets/logo.png";
import slide1Img from "@/assets/onboarding/slide-1.png";
import slide2Img from "@/assets/onboarding/slide-2.png";
import slide3Img from "@/assets/onboarding/slide-3.png";

const OnboardingCard: React.FC<{
  img: ImageSourcePropType;
  heading: string;
  text: string;
}> = ({ img, heading, text }) => {
  return (
    <View>
      <Image
        w={350}
        h={345}
        mb={24}
        mx={"auto"}
        source={img}
        style={styles.slideCardImg}
      />

      <Div px={15.5} mb={12} maxW={330} mx={"auto"}>
        <Text
          fontWeight="600"
          textAlign="center"
          fontSize={"5xl"}
          fontFamily="Eagle Lake"
          lineHeight={36}
          mb={12}
        >
          {heading}
        </Text>
        <Text
          fontFamily="Eagle Lake"
          textAlign="center"
          fontSize={"xl"}
          fontWeight={"normal"}
        >
          {text}
        </Text>
      </Div>
    </View>
  );
};

const Onboarding = () => {
  return (
    <Div>
      <Image
        w={143}
        h={40}
        mb={24}
        mx={"auto"}
        source={require("./../../assets/logo.png")}
      />
      <Div style={styles.cardContainer}>
        <OnboardingCard
          img={require("../../assets/onboarding/slide-1.png")}
          heading="Talk to veterinarians you can trust"
          text="Expert, caring vets. Your pet deserves the best."
        />
        <OnboardingCard
          img={require("../../assets/onboarding/slide-1.png")}
          heading="Talk to veterinarians you can trust"
          text="Expert, caring vets. Your pet deserves the best."
        />
        <OnboardingCard
          img={require("../../assets/onboarding/slide-1.png")}
          heading="Talk to veterinarians you can trust"
          text="Expert, caring vets. Your pet deserves the best."
        />
      </Div>
    </Div>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    columnGap: 20,
  },

  slideCardImg: {
    width: "100%",
    height: "auto",
    aspectRatio: 350 / 345,
  },
});

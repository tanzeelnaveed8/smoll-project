import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauora } from "@/constant/constant";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";

const OnboardingCard: React.FC<{
  img: ImageSourcePropType;
  heading: string;
  text: string;
}> = ({ img, heading, text }) => {
  return (
    <View style={{ maxWidth: "100%", width: "100%" }}>
      <Image
        w={350}
        h={345}
        mb={24}
        mx={"auto"}
        source={img}
        style={styles.slideCardImg}
      />

      <Div px={15.5} maxW={350} mx={"auto"}>
        <Text
          fontWeight="600"
          textAlign="center"
          fontSize={"5xl"}
          fontFamily={fontHauora}
          lineHeight={36}
          mb={12}
        >
          {heading}
        </Text>
        <Text
          fontFamily={fontHauora}
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

const dot = [1, 2, 3];

const Onboarding = () => {
  const [activeCard, setActiveCard] = useState(0);
  const cardContainerRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeCard === 2) {
        setActiveCard(0);
      } else {
        setActiveCard((prev) => prev + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeCard]);

  useEffect(() => {
    cardContainerRef.current?.scrollTo();
  }, [activeCard]);

  return (
    <Div>
      <Image
        w={143}
        h={40}
        mb={24}
        mx={"auto"}
        source={require("./../assets/logo.png")}
      />

      {/* <ScrollView
        horizontal
        style={styles.cardContainer}
        ref={cardContainerRef}
      >
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
      </ScrollView> */}

      <View style={styles.cardContainer}>
        <OnboardingCard
          img={require("../assets/onboarding/slide-1.png")}
          heading="Talk to veterinarians you can trust"
          text="Expert, caring vets. Your pet deserves the best."
        />
        <OnboardingCard
          img={require("../assets/onboarding/slide-2.png")}
          heading="Personalized Human Counselling"
          text="Tailored counseling for personal growth and well-being."
        />
        <OnboardingCard
          img={require("../assets/onboarding/slide-3.png")}
          heading="Get pet medicine delivered home."
          text="Get pet medicine delivered hassle-free to your door."
        />
      </View>

      <Div style={styles.dotContainer}>
        {dot.map((item, i) => (
          <Div
            style={{
              ...styles.dot,
              ...(i === activeCard ? styles.activeDot : {}),
            }}
            key={i}
          />
        ))}
      </Div>

      <ButtonPrimary>Get Started</ButtonPrimary>

      <Div style={styles.linkContainer}>
        <Text fontSize={"xl"} fontFamily={fontHauora} color="#494949">
          Already have an account?{" "}
        </Text>
        {/* <Text fontSize={"xl"} fontFamily={fontHauora} color="#0189F9">
          Log in
        </Text> */}
        <Button
          color="#0189F9"
          bg="transparent"
          px={0}
          py={0}
          fontSize={"xl"}
          fontFamily={fontHauora}
        >
          Log in
        </Button>
      </Div>
    </Div>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    gap: 20,
    overflow: "hidden",
  },

  slideCardImg: {
    width: "100%",
    height: "auto",
    aspectRatio: 350 / 345,
  },
  dotContainer: {
    gap: 8,
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "#D9D9D9",
  },
  activeDot: {
    backgroundColor: "#222222",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "center",
  },
});

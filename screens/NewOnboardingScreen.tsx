import Layout from "@/components/app/Layout";
import {
  fontHauora,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Button, Div, Text, Image } from "react-native-magnus";
import { useWindowDimensions } from "react-native";

import OnboardingIcon1 from "@/components/icons/OnboardingIcon1";
import OnboardingIcon2 from "@/components/icons/OnboardingIcon2";
import OnboardingIcon3 from "@/components/icons/OnboardingIcon3";
import OnboardingIcon4 from "@/components/icons/OnboardingIcon4";
import OnboardingIcon5 from "@/components/icons/OnboardingIcon5";

const images = [
  {
    img: <OnboardingIcon1 />,
    heading: ["Access", "to Pet", "Experts"],
    style: { transform: [{ scale: 1.1 }], paddingLeft: 20 },
  },
  {
    img: <OnboardingIcon2 />,
    heading: ["Recieve &", "Compare", "Upfront Prices"],
  },
  {
    img: <OnboardingIcon3 />,
    heading: ["Book", "appointments", "instantly"],
  },
  {
    img: <OnboardingIcon4 />,
    heading: ["Helping You", "Navigate Pet", "Loss"],
    style: { transform: [{ scale: 1.1 }], paddingLeft: 50 },
  },
  {
    img: <OnboardingIcon5 />,
    heading: ["Get your pet", "a PetID"],
    style: { transform: [{ scale: 1.3 }], paddingLeft: 50 },
  },
];

const windowWidth = Dimensions.get("window").width;

const NewOnboardingScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { height } = useWindowDimensions();
  const fontSize = height < 900 ? 46 : 54;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const time = 4000;
    if (currentIndex === images.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }, time);
      return () => clearTimeout(timeout);
      // return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Update currentIndex
      flatListRef.current?.scrollToIndex({
        index: (currentIndex + 1) % images.length,
        animated: true,
      });
    }, time); // Adjust the interval time as needed

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]);

  return (
    <>
      <Layout style={{ flex: 1 }}>
        <Div px={8} justifyContent="space-between" flex={1}>
          <Div flexDir="row" justifyContent="space-between" alignItems="center">
            <Image
              w={90}
              h={30}
              style={{ objectFit: "contain" }}
              source={require("./../assets/logo.png")}
            />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignupScreen");
              }}
            >
              <Button
                bg="transparent"
                px={8}
                py={2}
                rounded={30}
                borderWidth={1.5}
                borderColor="#222"
                color="#222"
                pointerEvents="none"
                fontFamily={fontHauoraSemiBold}
              >
                Get Started
              </Button>
            </TouchableOpacity>
          </Div>

          <Div>
            <Div mb={40}>
              {images[currentIndex].heading.map((item, index) => (
                <Text
                  key={index}
                  fontFamily={fontHauoraMedium}
                  fontSize={fontSize}
                >
                  {item}
                </Text>
              ))}
            </Div>
          </Div>
        </Div>

        <FlatList
          data={images}
          ref={flatListRef}
          style={{
            height: 0,
            backgroundColor: "#fff",
            pointerEvents: "none",
          }}
          keyExtractor={(item, i) => `${i}`}
          renderItem={({ item }: { item: (typeof images)[0] }) => (
            <Div
              w={windowWidth}
              h={350}
              justifyContent="center"
              alignItems="flex-start"
              mt={"auto"}
              // pl={50}
            >
              <Div style={item.style ? { ...item.style } : {}}>{item.img}</Div>
            </Div>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />

        {/* Dots Indicator */}
        <Div
          flexDir="row"
          justifyContent="flex-start"
          alignItems="center"
          pl={20}
          pb={30}
          pt={20}
          bg="#fff"
        >
          {images.map((_, index) => (
            <Div
              key={index}
              style={{
                height: currentIndex === index ? 5 : 10,
                width: currentIndex === index ? 15 : 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#222",
                backgroundColor:
                  currentIndex === index ? "#222" : "transparent",
                margin: 3,
              }}
            />
          ))}
        </Div>
      </Layout>
    </>
  );
};

export default NewOnboardingScreen;

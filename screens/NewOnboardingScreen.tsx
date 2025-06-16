import Layout from "@/components/app/Layout";
import { fontHauora, fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, ImageResolvedAssetSource, TouchableOpacity } from "react-native";
import { Button, Div, Text, Image } from "react-native-magnus";
import { useWindowDimensions } from "react-native";
import { Image as RNImage } from "react-native";

const images = [
  {
    img: require("@/assets/images/onboarding-screen/new/slide-1.jpg"),
    heading: ["Your All-Inclusive Pet", "Wellness Plan"],
    width: 260,
    height: 260,
  },
  {
    img: require("@/assets/images/onboarding-screen/new/slide-2.jpg"),
    heading: ["Vaccines, tests and", "checkups, all here"],
    width: 380,
    height: 350,
  },
  {
    img: require("@/assets/images/onboarding-screen/new/slide-3.jpg"),
    heading: ["Free Telehealth all", "year long"],
    width: 300,
    height: 350,
  },
  {
    img: require("@/assets/images/onboarding-screen/new/slide-4.jpg"),
    heading: ["Stress Free,", "at-home visits"],
    width: 400,
    height: 380,
  },
];

const windowWidth = Dimensions.get("window").width;

const NewOnboardingScreen: React.FC<{ navigation: NavigationType }> = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const fontSize = height < 900 ? 30 : 36;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Preload images
    return;
    images.forEach((image) => {
      const resolvedImage = RNImage.resolveAssetSource(image.img);
      console.log(resolvedImage.uri); // Log the URI to debug
      resolvedImage.uri && RNImage.prefetch(resolvedImage.uri);
    });
  }, []);

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
        <Div px={8}>
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
            <Div mt={50} my={30}>
              {images[currentIndex].heading.map((item, index) => (
                <Text
                  key={index}
                  fontFamily={fontHauoraMedium}
                  fontSize={fontSize}
                  lineHeight={fontSize + 12}
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
            pointerEvents: "none",
          }}
          contentContainerStyle={{ alignItems: "flex-start" }}
          keyExtractor={(item, i) => `${i}`}
          renderItem={({ item }: { item: (typeof images)[0] }) => (
            <Div w={windowWidth} h={height / 1.66} mt="auto">
              <Div
                alignSelf="flex-start"
                w="88.9%"
                h="100%"
                rounded={40}
                overflow="hidden"
                bg="transparent"
              >
                <Image
                  w="100%"
                  h="100%"
                  resizeMode="cover"
                  source={item.img}
                  style={{
                    borderRadius: 40,
                  }}
                />
              </Div>
            </Div>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />

        {/* Dots Indicator */}
        <Div flexDir="row" justifyContent="flex-start" alignItems="center" pl={20} pb={30} pt={20}>
          {images.map((_, index) => (
            <Div
              key={index}
              style={{
                height: currentIndex === index ? 5 : 10,
                width: currentIndex === index ? 15 : 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#222",
                backgroundColor: currentIndex === index ? "#222" : "transparent",
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

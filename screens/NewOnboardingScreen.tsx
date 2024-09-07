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
import Svg, { Image as SvgImage } from "react-native-svg";

const images = [
  {
    img: require("./../assets/images/onboarding-screen/slide-1.png"),
    // img: require("../assets/icons/onboarding-icons/icon-1.svg"),
    heading: ["Access", "to Pet", "Experts"],
    width: 260,
    height: 260,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-5.png"),
    // img: require("../assets/icons/onboarding-icons/icon-2.svg"),
    heading: ["Recieve &", "Compare", "Upfront Prices"],
    width: 400,
    height: 380,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-2.png"),
    // img: require("../assets/icons/onboarding-icons/icon-3.svg"),
    heading: ["Book", "appointments", "instantly"],
    width: 250,
    height: 300,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-3.png"),
    // img: require("../assets/icons/onboarding-icons/icon-4.svg"),
    heading: ["Helping You", "Navigate Pet", "Loss"],
    width: 380,
    height: 350,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-4.png"),
    // img: require("../assets/icons/onboarding-icons/icon-5.svg"),
    heading: ["Get your pet", "a PetID"],
    width: 300,
    height: 350,
  },

  // {
  //   img: require("./../assets/images/onboarding-screen/slide-1.png"),
  //   width: 350,
  //   height: 350,
  // },
];

const windowWidth = Dimensions.get("window").width;

const NewOnboardingScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { height } = useWindowDimensions();
  const fontSize = height < 900 ? 46 : 60;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const time = 3000;
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
                  lineHeight={58}
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
          renderItem={({ item }) => (
            <Div
              w={windowWidth}
              h={350}
              justifyContent="flex-end"
              alignItems="center"
              mt={"auto"}
              // bg="red"
            >
              {/* <Svg
                width={"80%"}
                height={"90%"}
                // mb={20}
                // alignSelf="flex-start"
                // style={{ objectFit: "contain" }}
              >
                <SvgImage href={item.img} width="100%" height="100%" />
              </Svg> */}
              <Image
                w={"80%"}
                h={"90%"}
                mb={20}
                alignSelf="flex-start"
                // mx={"auto"}
                style={{ objectFit: "contain" }}
                source={item.img}
              />
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

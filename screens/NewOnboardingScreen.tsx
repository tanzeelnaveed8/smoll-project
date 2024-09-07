import Layout from "@/components/app/Layout";
import {
  fontHauora,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";
import { useWindowDimensions } from "react-native";

const images = [
  {
    img: require("./../assets/images/onboarding-screen/slide-1.png"),
    heading: ["Access", "to Pet", "Experts"],
    width: 330,
    height: 330,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-5.png"),
    heading: ["Recieve &", "Compare", "Upfront Prices"],
    width: 400,
    height: 380,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-2.png"),
    heading: ["Book", "appointments", "instantly"],
    width: 250,
    height: 300,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-3.png"),
    heading: ["Helping You", "Navigate Pet", "Loss"],
    width: 380,
    height: 350,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-4.png"),
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
    if (currentIndex === images.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }, 8000);
      return () => clearTimeout(timeout);
      // return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Update currentIndex
      flatListRef.current?.scrollToIndex({
        index: (currentIndex + 1) % images.length,
        animated: true,
      });
    }, 8000); // Adjust the interval time as needed

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
      </Layout>

      <FlatList
        data={images}
        ref={flatListRef}
        style={{ height: 0, backgroundColor: "#fff", pointerEvents: "none" }}
        keyExtractor={(item, i) => `${i}`}
        renderItem={({ item }) => (
          <Div
            w={windowWidth}
            h={400}
            justifyContent="center"
            alignItems="center"
            mt={"auto"}
          >
            <Image
              w={item.width}
              h={item.height}
              alignSelf="flex-start"
              mx={"auto"}
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
        pl={50}
        pb={50}
        pt={50}
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
              backgroundColor: currentIndex === index ? "#222" : "transparent",
              margin: 3,
            }}
          />
        ))}
      </Div>
    </>
  );
};

export default NewOnboardingScreen;

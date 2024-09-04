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

const images = [
  {
    img: require("./../assets/images/onboarding-screen/slide-1.png"),
    width: 350,
    height: 350,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-2.png"),
    width: 250,
    height: 300,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-3.png"),
    width: 380,
    height: 350,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-4.png"),
    width: 300,
    height: 350,
  },
  {
    img: require("./../assets/images/onboarding-screen/slide-5.png"),
    width: 400,
    height: 380,
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
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === images.length - 1) {
      // setCurrentIndex(0);
      // const timeout = setTimeout(() => {
      //   flatListRef.current?.scrollToIndex({
      //     index: 0,
      //     animated: false,
      //   });
      // }, 100);
      // return () => clearTimeout(timeout);
      return;
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
              <Text fontFamily={fontHauora} fontSize={74} lineHeight={74}>
                Access
              </Text>
              <Text fontFamily={fontHauora} fontSize={74} lineHeight={74}>
                to Pet
              </Text>
              <Text fontFamily={fontHauora} fontSize={74} lineHeight={74}>
                Experts
              </Text>
            </Div>

            {/* <Image
            w={"100%"}
            h={400}
            mb={40}
            mx={"auto"}
            style={{ objectFit: "contain" }}
            source={require("./../assets/icons/splash-screen-image.png")}
          /> */}
          </Div>
        </Div>
      </Layout>

      <FlatList
        data={images}
        ref={flatListRef}
        style={{ marginBottom: 20, height: 0, backgroundColor: "#fff" }}
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
    </>
  );
};

export default NewOnboardingScreen;

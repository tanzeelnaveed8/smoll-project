import Layout from "@/components/app/Layout";
import StarRating from "@/components/partials/StarRating";
import {
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { IconCircleCheck, IconPhone } from "@tabler/icons-react-native";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Div, Image, ScrollDiv, Text } from "react-native-magnus";

const TimeTab: React.FC<{ heading: string; time: string; mb?: number }> = ({
  heading,
  time,
  mb,
}) => {
  return (
    <Div flexDir="row" alignItems="center" mb={mb || 0}>
      <Div px={8} py={6} bg="#F4F6F8" rounded={12} mr={8}>
        <Text
          fontSize={"md"}
          mb={-1}
          fontFamily={fontHauoraSemiBold}
          lineHeight={14}
        >
          {heading}
        </Text>
      </Div>
      <Text
        fontSize={"md"}
        fontFamily={fontHauoraSemiBold}
        lineHeight={24}
        color="primary"
      >
        {time}
      </Text>
    </Div>
  );
};

const category = ["Primary", "Equistrain", "Hospitalization", "Rehabilitation"];

const images = [
  require("@/assets/images/slider-1.png"),
  require("@/assets/images/slider-2.png"),
  require("@/assets/images/slider-3.png"),
  require("@/assets/images/slider-1.png"),
  require("@/assets/images/slider-2.png"),
  require("@/assets/images/slider-3.png"),
];

const doctorList = [
  {
    img: require("@/assets/images/doctor-img.png"),
    name: "Dr. Christopher Adams",
    speciality: "DVM, GPCERT (FelP)",
    experience: 3,
  },
  {
    img: require("@/assets/images/doctor-img.png"),
    name: "Dr. Christopher Adams",
    speciality: "DVM, GPCERT (FelP)",
    experience: 3,
  },
  {
    img: require("@/assets/images/doctor-img.png"),
    name: "Dr. Christopher Adams",
    speciality: "DVM, GPCERT (FelP)",
    experience: 3,
  },
];

const ClinicDetailScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  return (
    <Layout
      showBack
      title="Clinic Details"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <Div flex={1} pt={24}>
        <ScrollDiv showsVerticalScrollIndicator={false}>
          <Div flexDir="row" alignItems="center" style={{ gap: 12 }} mb={16}>
            <Image
              source={require("@/assets/images/doctor-img.png")}
              w={100}
              h={100}
              rounded={100}
            />

            <Div>
              <Text
                fontSize={"xl"}
                fontFamily={fontHauoraBold}
                lineHeight={24}
                mb={4}
              >
                Harmony Vet Clinic
              </Text>
              <Div flexDir="row" alignItems="center" mb={4}>
                <StarRating defaultRating={4} size={12} columnGap={4} />
                <Text
                  ml={8}
                  fontSize={"md"}
                  fontFamily={fontHauoraMedium}
                  lineHeight={24}
                  color="#494949"
                >
                  4/5 Rating
                </Text>
              </Div>

              <Div flexDir="row" alignItems="center">
                <Image
                  source={require("@/assets/images/uae-icon.png")}
                  w={20}
                  h={20}
                  rounded={20}
                  mr={8}
                />
                <Text
                  fontSize={"md"}
                  fontFamily={fontHauoraBold}
                  lineHeight={20}
                  color="#494949"
                >
                  Dubai
                </Text>
              </Div>
            </Div>
          </Div>

          <Div mb={16}>
            <TimeTab heading={"Morn"} time={"08:00am - 13:00pm"} mb={2} />
            <TimeTab heading={"Eves"} time={"16:00pm - 20:00pm"} />
          </Div>

          <Div flexDir="row" flexWrap="wrap" style={{ gap: 8 }} mb={16}>
            {category.map((item, i) => (
              <Div
                key={i}
                px={8}
                py={6}
                rounded={32}
                borderWidth={1.2}
                borderColor="#222"
              >
                <Text
                  fontSize={"md"}
                  fontFamily={fontHauoraSemiBold}
                  lineHeight={20}
                >
                  {item}
                </Text>
              </Div>
            ))}
          </Div>

          <Div mb={16}>
            <Text fontSize={12} fontFamily={fontHauora} mb={8} color="#494949">
              Inside clinic
            </Text>

            <FlatList
              data={images}
              renderItem={({ item, index }) => (
                <Div pr={index + 1 === images.length ? 0 : 8}>
                  <Image source={item} w={120} h={100} rounded={8} />
                </Div>
              )}
              // keyExtractor={({ item, index }) => `${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </Div>

          <Div
            pb={24}
            borderBottomWidth={1}
            borderBottomColor="#D0D7DC"
            mb={24}
          >
            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              lineHeight={24}
              mb={4}
            >
              Address - Harmony Vet Clinic
            </Text>

            <Text
              fontSize={"lg"}
              fontFamily={fontHauoraMedium}
              lineHeight={24}
              mb={14}
              color="#494949"
            >
              Villa 12, Street 24, Jumeirah 3, Dubai, United Arab Emirates
            </Text>
            <TouchableOpacity>
              <Div flexDir="row" alignItems="center">
                <IconPhone
                  width={24}
                  height={24}
                  color={"#427594"}
                  strokeWidth={1.5}
                />
                <Text
                  fontSize={"lg"}
                  fontFamily={fontHauoraMedium}
                  lineHeight={24}
                  color="primary"
                  ml={4}
                >
                  (+971) 82 474 7493
                </Text>
              </Div>
            </TouchableOpacity>
          </Div>

          <Div>
            <Text
              fontSize={12}
              fontFamily={fontHauoraSemiBold}
              color="#494949"
              mb={24}
            >
              Veterinarian
            </Text>

            {doctorList.map((item, i) => (
              <Div
                key={i}
                pb={16}
                mb={16}
                borderBottomWidth={1}
                borderColor="#D0D7DC"
                flexDir="row"
              >
                <Image source={item.img} w={32} h={32} rounded={32} mr={16} />
                <Div>
                  <Text
                    fontSize={"lg"}
                    fontFamily={fontHauoraSemiBold}
                    lineHeight={24}
                    mb={4}
                  >
                    {item.name}
                  </Text>
                  <Text
                    fontSize={"md"}
                    fontFamily={fontHauoraMedium}
                    lineHeight={20}
                    color="#494949"
                    mb={4}
                  >
                    {item.speciality}
                  </Text>
                  <Text
                    fontSize={"md"}
                    fontFamily={fontHauoraMedium}
                    lineHeight={20}
                    color="#494949"
                    mb={12}
                  >
                    {item.experience} yrs of experience
                  </Text>
                  <Div flexDir="row" alignItems="center">
                    <Div p={2}>
                      <IconCircleCheck
                        size={12}
                        color={"#2F6E20"}
                        strokeWidth={1.5}
                      />
                    </Div>
                    <Text
                      fontSize={12}
                      fontFamily={fontHauoraMedium}
                      lineHeight={16}
                    >
                      Verified
                    </Text>
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>
        </ScrollDiv>
      </Div>
    </Layout>
  );
};

export default ClinicDetailScreen;

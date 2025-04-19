import Layout from "@/components/app/Layout";
import StarRating from "@/components/partials/StarRating";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { IconChevronRight } from "@tabler/icons-react-native";
import React from "react";
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import { Div, Image, ScrollDiv, Text } from "react-native-magnus";

const data = [
  {
    img: require("@/assets/images/doctor-img.png"),
    name: "Harmony Vet Clinic",
    rating: 4,
    morning: "08:00am - 13:00pm",
    evening: "16:00pm - 20:00pm",
    category: ["Primary", "Equistrain", "Hospitalization", "Rehabilitation"],
  },
  {
    img: require("@/assets/images/doctor-img.png"),
    name: "Harmony Vet Clinic",
    rating: 5,
    morning: "08:00am - 13:00pm",
    evening: "16:00pm - 20:00pm",
    category: ["Primary", "Equistrain", "Hospitalization", "Rehabilitation"],
  },
  {
    img: require("@/assets/images/doctor-img.png"),
    name: "Harmony Vet Clinic",
    rating: 4,
    morning: "08:00am - 13:00pm",
    evening: "16:00pm - 20:00pm",
    category: ["Primary", "Equistrain", "Hospitalization", "Rehabilitation"],
  },
  {
    img: require("@/assets/images/doctor-img.png"),
    name: "Harmony Vet Clinic",
    rating: 4,
    morning: "08:00am - 13:00pm",
    evening: "16:00pm - 20:00pm",
    category: ["Primary", "Equistrain", "Hospitalization", "Rehabilitation"],
  },
  {
    img: require("@/assets/images/doctor-img.png"),
    name: "Harmony Vet Clinic",
    rating: 5,
    morning: "08:00am - 13:00pm",
    evening: "16:00pm - 20:00pm",
    category: ["Primary", "Equistrain", "Hospitalization", "Rehabilitation"],
  },
  {
    img: require("@/assets/images/doctor-img.png"),
    name: "Harmony Vet Clinic",
    rating: 4,
    morning: "08:00am - 13:00pm",
    evening: "16:00pm - 20:00pm",
    category: ["Primary", "Equistrain", "Hospitalization", "Rehabilitation"],
  },
];

const TimeTab: React.FC<{ heading: string; time: string; mb?: number }> = ({
  heading,
  time,
  mb,
}) => {
  return (
    <Div flexDir="row" alignItems="center" mb={mb || 0}>
      <Div px={8} py={6} bg="#F4F6F8" rounded={12} mr={8}>
        <Text fontSize={"md"} mb={-1} fontFamily={fontHauoraSemiBold} lineHeight={14}>
          {heading}
        </Text>
      </Div>
      <Text fontSize={"md"} fontFamily={fontHauoraSemiBold} lineHeight={24} color="primary">
        {time}
      </Text>
    </Div>
  );
};

const ClinicListScreen = () => {
  return (
    <Layout showBack title="Clinic" style={{ backgroundColor: "#fff" }}>
      <Div flex={1}>
        <ScrollDiv showsVerticalScrollIndicator={false}>
          <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={20}>
            Clinics
          </Text>

          <Div>
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Div
                  flexDir="row"
                  style={{ gap: 16 }}
                  pb={16}
                  borderBottomWidth={1}
                  borderBottomColor="#D0D7DC"
                  mb={20}
                >
                  <Image source={item.img} w={32} h={32} rounded={32} />
                  <Div flex={1}>
                    <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} lineHeight={24} mb={4}>
                      {item.name}
                    </Text>

                    <Div flexDir="row" alignItems="center" mb={12}>
                      <StarRating defaultRating={item.rating} size={10} columnGap={5} />
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

                    <Div mb={12}>
                      <TimeTab heading={"Morn"} time={item.morning} mb={2} />
                      <TimeTab heading={"Eves"} time={item.evening} />
                    </Div>

                    <Div flexDir="row" flexWrap="wrap" style={{ gap: 8 }}>
                      {item.category?.map((item, i) => (
                        <Div
                          key={i}
                          px={8}
                          py={6}
                          rounded={12}
                          borderWidth={1.2}
                          borderColor="#222"
                        >
                          <Text fontSize={"md"} fontFamily={fontHauoraSemiBold} lineHeight={20}>
                            {item}
                          </Text>
                        </Div>
                      ))}
                    </Div>
                  </Div>
                  <IconChevronRight size={32} color={"#222"} />
                  {/* <Div w={32} h={32}>
                  </Div> */}
                </Div>
              )}
              keyExtractor={(item, index) => `${index}`}
              onEndReached={async () => {}}
              onStartReached={async () => {}}
            />
          </Div>
        </ScrollDiv>
      </Div>
    </Layout>
  );
};

export default ClinicListScreen;

import { fontHauoraBold, fontHauoraSemiBold } from "@/constant/constant";
import React from "react";
import { FlatList } from "react-native";
import { Div, Image, Text } from "react-native-magnus";

const list = [
  {
    name: "Lucy",
    forwardBy: "Dr Abbas Sheikh",
    caseId: "38401",
    nuOfRequest: 2,
  },
];

const PartnerClinicScreen = () => {
  return (
    <Div>
      <Text fontSize={"6xl"} mb={24}>
        Partner Clinics
      </Text>
      <Text fontSize={"xl"} mb={20} fontFamily={fontHauoraBold}>
        In-Clinic Request
      </Text>

      <Div>
        <Text fontSize={"md"} mb={8} fontFamily={fontHauoraSemiBold}>
          Today
        </Text>

        <FlatList
          data={list}
          renderItem={() => (
            <Div>
              <Image
                source={require("../../assets/images/dog.png")}
                w={56}
                h={56}
                mr={7}
              />
              <Div></Div>
            </Div>
          )}
          keyExtractor={(item) => item.caseId}
        />
      </Div>
    </Div>
  );
};

export default PartnerClinicScreen;

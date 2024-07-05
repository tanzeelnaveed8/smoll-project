import Layout from "@/components/app/Layout";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";

const requestList = [
  {
    title: "Harmony Vet Clinic",
    id: "94AED",
    rating: 4,
    address: "Arjan - Dubailand, Dubai",
  },
  {
    title: "Modern Vet Downtown",
    id: "120AED",
    rating: 3,
    address: "Downtown,Dubai",
  },
];

const PartnerCaseDetailsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  return (
    <Layout showBack backBtnText="">
      <Div flex={1}>
        <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={20}>
          Clinics
        </Text>

        <FlatList
          data={requestList}
          renderItem={({ item }) => (
            <Div pb={16} borderBottomWidth={1} borderColor="#D0D7DC" mb={12}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                onPress={() => {
                  navigation.navigate("DoctotsList");
                }}
              >
                <Div>
                  <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={6}>
                    {item.title}
                  </Text>

                  <Div mb={6}>
                    <Text
                      fontSize={"md"}
                      color="darkGreyText"
                      fontFamily={fontHauoraMedium}
                    >
                      {item.rating}/5 Rating
                    </Text>
                  </Div>
                  <Text
                    fontSize={"md"}
                    color="darkGreyText"
                    fontFamily={fontHauoraSemiBold}
                  >
                    {item.address}
                  </Text>
                </Div>

                <Div alignItems="flex-end">
                  <Text
                    fontSize={"xl"}
                    fontFamily={fontHauoraSemiBold}
                    color="primary"
                  >
                    ~{item.id}
                  </Text>
                  <Text
                    fontSize={"md"}
                    color="darkGreyText"
                    fontFamily={fontHauoraMedium}
                  >
                    Proposal
                  </Text>
                </Div>
              </TouchableOpacity>
            </Div>
          )}
          keyExtractor={(item, i) => `${i}`}
        />
      </Div>
    </Layout>
  );
};

export default PartnerCaseDetailsScreen;

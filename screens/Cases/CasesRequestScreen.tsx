import Layout from "@/components/app/Layout";
import {
  colorPrimary,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useCasesStore } from "@/store/modules/cases";
import { NavigationType } from "@/store/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
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

const CasesRequestScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { caseRequests, fetchCaseRequests } = useCasesStore();

  useEffect(() => {
    handleFetchRequests();
  }, []);

  const handleFetchRequests = async () => {
    try {
      setIsLoading(true);

      if (caseRequests.length === 0) {
        await fetchCaseRequests();
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <Layout
      showBack
      backBtnText=""
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <Div flex={1}>
        <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={20}>
          Clinics
        </Text>

        {!isLoading && (
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
                    navigation.navigate("PartnerVetScreen");
                  }}
                >
                  <Div>
                    <Text
                      fontSize={"xl"}
                      fontFamily={fontHauoraSemiBold}
                      mb={6}
                    >
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
        )}

        {isLoading && (
          <Div flex={1} justifyContent="center" maxH={"70%"}>
            <ActivityIndicator size="large" color={colorPrimary} />
          </Div>
        )}
      </Div>
    </Layout>
  );
};

export default CasesRequestScreen;

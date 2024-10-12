import Layout from "@/components/app/Layout";
import StarRating from "@/components/partials/StarRating";
import {
  colorPrimary,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useCaseStore } from "@/store/modules/case";
// import { useCaseStore } from "@/store/modules/case";
// import { useCasesStore } from "@/store/modules/case";
import { NavigationType } from "@/store/types";
import { CaseQuotesDto } from "@/store/types/case";
import { useRoute } from "@react-navigation/native";
import { IconHome } from "@tabler/icons-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Div, Image, Text } from "react-native-magnus";
import PartnerVetStarRating from "./PartnerVetStarRating";
import { IconArrowRight } from "@tabler/icons-react-native";

const CaseQuotesScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const caseId = (route.params as Record<string, string>)?.id;
  const hasPartnerBooking = (route.params as Record<string, string>)
    ?.hasPartnerBooking;

  const { fetchCaseQuotes, casesQuotes } = useCaseStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setRefresh] = useState(false);

  const caseQuotes = useMemo(
    () => casesQuotes.get(caseId),
    [caseId, casesQuotes]
  );

  useEffect(() => {
    handleFetchRequests();
  }, []);

  const getTotalQuote = (caseQuotes: CaseQuotesDto) => {
    const q = caseQuotes.services.reduce((total, curr) => {
      return total + curr.price;
    }, 0);

    return q;
  };

  const getMinQuote = (caseQuotes: CaseQuotesDto) => {
    let q = 0;
    caseQuotes.services.forEach((service) => {
      if (service.label !== "Recommended") {
        q += service.price;
      }
    });

    return q;
  };

  const handleFetchRequests = async (isRefreshing?: boolean) => {
    const caseQuotes = casesQuotes.get(caseId);

    if (caseQuotes?.length && !isRefreshing) {
      return;
    }

    try {
      if (isRefreshing) {
        setRefresh(true);
      } else {
        setIsLoading(true);
      }

      await fetchCaseQuotes(caseId);
    } finally {
      setIsLoading(false);
      setRefresh(false);
    }
  };

  return (
    <Layout
      showBack
      title="Case"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <Div flex={1}>
        <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={20}>
          Quotations
        </Text>

        {!isLoading && (
          <FlatList
            data={caseQuotes}
            ListEmptyComponent={() => {
              return <Text>No quotes yet. :(</Text>;
            }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleFetchRequests}
              />
            }
            renderItem={({ item }) => {
              return (
                <Div
                  py={16}
                  px={20}
                  borderWidth={1}
                  borderColor="#222"
                  rounded={35}
                  mb={25}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("CaseQuoteDescriptionScreen", {
                        id: item.partner.id,
                        caseId,
                        hasPartnerBooking,
                      });
                    }}
                  >
                    <Div flexDir="row" justifyContent="space-between">
                      <Div maxW={"70%"}>
                        <Text
                          fontSize={"xl"}
                          mb={4}
                          fontFamily={fontHauoraSemiBold}
                        >
                          {item.partner.name}
                        </Text>

                        {/* <PartnerVetStarRating rating={4} color="" /> */}

                        <Text
                          fontSize={"md"}
                          color="darkGreyText"
                          fontFamily={fontHauoraSemiBold}
                          mb={20}
                        >
                          {item.partner.address}
                        </Text>
                      </Div>

                      <Image
                        source={{ uri: item.partner?.clinicImg?.url }}
                        w={80}
                        h={80}
                        rounded={100}
                        bg="#fefefe"
                      />
                    </Div>

                    <Div flexDir="row" alignItems="flex-end">
                      <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                        Min{"  "}
                      </Text>
                      <Text fontSize={"lg"} fontFamily={fontHauoraMedium}>
                        AED {getMinQuote(item)}
                      </Text>
                    </Div>

                    <Div
                      flexDir="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Div flexDir="row" alignItems="flex-end">
                        <Text
                          fontSize={"md"}
                          fontFamily={fontHauoraMedium}
                          mb={3}
                        >
                          Max{"  "}
                        </Text>
                        <Text fontSize={"2xl"} fontFamily={fontHauoraBold}>
                          AED {getTotalQuote(item)}
                        </Text>
                      </Div>

                      <IconArrowRight
                        color={"#222"}
                        width={34}
                        height={34}
                        strokeWidth={2.4}
                      />
                    </Div>
                    {/* <Div maxW="60%">
                    <Text
                      fontSize={"xl"}
                      fontFamily={fontHauoraSemiBold}
                      mb={6}
                    >
                      {item.partner.name}
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
                      {item.partner.address}
                    </Text>
                  </Div>

                  <Div alignItems="flex-end">
                    <Text
                      fontSize={"xl"}
                      fontFamily={fontHauoraSemiBold}
                      color="primary"
                    >
                      ~{getTotalQuote(item)} AED
                    </Text>
                    <Text
                      fontSize={"md"}
                      color="darkGreyText"
                      fontFamily={fontHauoraMedium}
                    >
                      Proposal
                    </Text>
                  </Div> */}
                  </TouchableOpacity>
                </Div>
              );
            }}
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

export default CaseQuotesScreen;

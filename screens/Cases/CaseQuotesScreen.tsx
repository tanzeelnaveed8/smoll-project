import Layout from "@/components/app/Layout";
import {
  colorPrimary,
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

const CaseQuotesScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const caseId = (route.params as Record<string, string>)?.id;

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

  const getMinQuote = (caseQuotes: CaseQuotesDto) => {
    const q = caseQuotes.services.reduce((total, curr) => {
      return total + curr.price;
    }, 0);

    return q;
  };

  const handleFetchRequests = async (isRefreshing?: boolean) => {
    const caseQuotes = casesQuotes.get(caseId);

    console.log("caseQuotes", caseQuotes);

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
            renderItem={({ item }) => (
              <Div pb={16} borderBottomWidth={1} borderColor="#D0D7DC" mb={12}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  onPress={() => {
                    navigation.navigate("CaseQuoteDescriptionScreen", {
                      id: item.partner.id,
                      caseId,
                    });
                  }}
                >
                  <Div flexDir="row" alignItems="center" rounded={100}>
                    {item.partner.clinicImg ? (
                      <Image
                        source={{ uri: item.partner.clinicImg.url }}
                        w={65}
                        h={65}
                        rounded={100}
                        borderWidth={1}
                        borderColor="#D0D7DC"
                        mr={12}
                      />
                    ) : (
                      <IconHome size={24} />
                    )}
                  </Div>

                  <Div maxW="60%">
                    <Text
                      fontSize={"xl"}
                      fontFamily={fontHauoraSemiBold}
                      mb={6}
                    >
                      {item.partner.name}
                    </Text>

                    {/* <Div mb={6}>
                      <Text
                        fontSize={"md"}
                        color="darkGreyText"
                        fontFamily={fontHauoraMedium}
                      >
                        {item.rating}/5 Rating
                      </Text>
                    </Div> */}
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
                      ~{getMinQuote(item)} AED
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

export default CaseQuotesScreen;

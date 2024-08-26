import Layout from "@/components/app/Layout";
import TabNavigationBar from "@/components/app/TabNavigationBar";
import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
import { useCaseStore } from "@/store/modules/case";
import { NavigationType } from "@/store/types";
import { CaseStatusEnum } from "@/store/types/case.d";
import { getCaseStatusColor, getCaseStatusLabel } from "@/utils/helpers";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-bidirectional-infinite-scroll";

import { Button, Div, Image, Text } from "react-native-magnus";
import { useInterval } from "usehooks-ts";

const CasesListScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const { cases, fetchCases } = useCaseStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [nextPageId, setNextPageId] = useState<number | null>(1);
  const [page, setPage] = useState(1);

  const comingFrom = (route.params as Record<string, string | undefined>)?.from;

  useInterval(() => {
    setRenderKey(Math.random() * 1000);
  }, 1000);

  useEffect(() => {
    handleFetchCases();
  }, []);

  const handleFetchCases = async (isRefresh?: boolean) => {
    console.log("fetching handleFetchCases");
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetchCases(1, isRefresh);
      setNextPageId(response.nextPage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const sessionInProgress = useCallback(
    (status: CaseStatusEnum, scheduledAt?: string) => {
      if (scheduledAt) return false;

      if (status !== CaseStatusEnum.OPEN) return false;

      return (
        scheduledAt &&
        dayjs(scheduledAt).isBefore(dayjs()) &&
        dayjs(scheduledAt).isAfter(dayjs().subtract(30, "minutes"))
      );
    },
    [renderKey]
  );

  const handleLoadMore = async () => {
    console.log("nextPageId", nextPageId);
    if (!nextPageId) return;
    console.log("fetching data again");

    return new Promise<void>(async (resolve) => {
      const newPage = page + 1;
      try {
        const fetchedData = await fetchCases(newPage); // commented-out for now
        setNextPageId(fetchedData.nextPage); /// commented-out for now
        setPage(newPage);
      } finally {
        resolve();
      }
    });
  };

  return (
    <>
      <Layout
        showBack
        onBackPress={() => {
          if (comingFrom) {
            navigation.navigate("HomeScreen");
          } else {
            navigation.goBack();
          }
        }}
        title="Cases"
        loading={isLoading}
      >
        <Div mb={24}>
          <Text
            fontSize={"xl"}
            fontWeight="bold"
            fontFamily={fontHauoraSemiBold}
          >
            All Cases
          </Text>
        </Div>
        <Div flex={1}>
          <FlatList
            ListEmptyComponent={() => {
              return <Text>You have not created any case yet. :(</Text>;
            }}
            data={cases}
            style={{ height: "100%" }}
            onEndReached={handleLoadMore} // required, should return a promise
            onEndReachedThreshold={20} // optional
            activityIndicatorColor={"black"} // optional
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                tintColor={colorPrimary}
                onRefresh={() => handleFetchCases(true)}
              />
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Div mb={index + 1 === cases?.length ? 0 : 12}>
                <Text
                  fontSize={"md"}
                  mb={8}
                  fontFamily={fontHauoraSemiBold}
                  style={{
                    textTransform: "capitalize",
                  }}
                >
                  {dayjs(item.createdAt).fromNow()}
                </Text>
                <Button
                  bg="transparent"
                  p={0}
                  underlayColor="#f3f3f3"
                  flexDir="row"
                  alignItems="center"
                  mb={12}
                >
                  <Image
                    source={{ uri: item.pet.photos?.[0].url }}
                    w={56}
                    h={56}
                    mr={7}
                    rounded={100}
                  />
                  <Div flex={1}>
                    <Div
                      mb={4}
                      flexDir="row"
                      justifyContent="space-between"
                      flex={1}
                    >
                      <Text fontFamily={fontHauoraSemiBold} fontSize={"xl"}>
                        {item.pet.name}
                      </Text>

                      {item.status === CaseStatusEnum.OPEN_ESCALATED &&
                        item.requestCount && (
                          <Text
                            fontFamily={fontHauoraSemiBold}
                            fontSize={"lg"}
                            color="#2F6E20"
                          >
                            {item.requestCount} Request
                          </Text>
                        )}

                      {item.scheduledAt && (
                        <Text
                          fontFamily={fontHauoraSemiBold}
                          fontSize={"lg"}
                          color={getCaseStatusColor(
                            item.status,
                            item.scheduledAt
                          )}
                        >
                          {dayjs(item.scheduledAt).format(
                            "HH:mm A, DD MMM YYYY"
                          )}
                        </Text>
                      )}
                    </Div>

                    <Div>
                      <Text
                        color="#494949"
                        fontFamily={fontHauoraSemiBold}
                        fontSize={"md"}
                      >
                        Expert: {item.vet}
                      </Text>

                      <Text
                        fontFamily={fontHauoraSemiBold}
                        fontSize={"md"}
                        color="#494949"
                      >
                        Case Status:{" "}
                        <Text
                          fontFamily={fontHauoraSemiBold}
                          color={getCaseStatusColor(
                            item.status,
                            item.scheduledAt
                          )}
                        >
                          {getCaseStatusLabel(
                            item.status,
                            item.scheduledAt,
                            item.hasPartnerBooking
                          )}
                        </Text>
                      </Text>
                    </Div>
                  </Div>
                </Button>

                <Div
                  py={8}
                  borderTopWidth={1}
                  borderBottomWidth={1}
                  borderColor="#D0D7DC"
                  flexDir="row"
                  justifyContent="space-between"
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("CaseDetailScreen", {
                        caseId: item.id,
                      })
                    }
                  >
                    <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
                      View Case Brief
                    </Text>
                  </TouchableOpacity>

                  {sessionInProgress(item.status, item.scheduledAt) && (
                    <Button
                      fontSize={"lg"}
                      bg="transparent"
                      p={0}
                      fontFamily={fontHauoraSemiBold}
                      color="primary"
                      onPress={() => {
                        if (!item.consultationId) return;

                        navigation.navigate("ConsultationWaitingScreen", {
                          consultationId: item.consultationId,
                        });
                      }}
                    >
                      Join Session
                    </Button>
                  )}

                  {item.status === CaseStatusEnum.OPEN_ESCALATED &&
                    !item.hasPartnerBooking && (
                      <Button
                        fontSize={"lg"}
                        bg="transparent"
                        p={0}
                        fontFamily={fontHauoraSemiBold}
                        color="primary"
                        onPress={() => {
                          navigation.navigate("CaseQuotesScreen", {
                            id: item.id,
                          });
                        }}
                      >
                        View Requests
                      </Button>
                    )}
                </Div>
              </Div>
            )}
            keyExtractor={(item, i) => `${i}`}
          />
        </Div>
      </Layout>

      <TabNavigationBar navigation={navigation} />
    </>
  );
};

export default CasesListScreen;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: "#EFEFEF",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  btn: {
    padding: 8,
    // fontSize: 16,
    borderWidth: 1,
    borderRadius: 34,
    borderColor: "transparent",
    width: "65%",
  },
  activeBtn: {
    paddingHorizontal: 30,
    backgroundColor: "#fff",
    borderColor: "#427594",
  },
});

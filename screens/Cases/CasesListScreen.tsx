import Layout from "@/components/app/Layout";
import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
import { useCaseStore } from "@/store/modules/case";
import { NavigationType } from "@/store/types";
import { CaseStatusEnum } from "@/store/types/case.d";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";

const CasesListScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { cases, fetchCases } = useCaseStore();

  useEffect(() => {
    handleFetchCases();
  }, []);

  const handleFetchCases = async (isRefresh?: boolean) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      await fetchCases();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const caseStatus = (status: CaseStatusEnum) => {
    switch (status) {
      case CaseStatusEnum.OPEN_ESCALATED:
        return "Emergency";
      case CaseStatusEnum.CLOSED:
        return "Closed";
      case CaseStatusEnum.OPEN:
        return "Open";
    }
  };

  return (
    <Layout
      showBack
      onBackPress={() => {
        navigation.navigate("HomeScreen");
      }}
      loading={isLoading}
    >
      <Div flex={1}>
        <Text fontSize={"6xl"} mb={24}>
          Cases
        </Text>

        <Div>
          {!isLoading && (
            <FlatList
              ListEmptyComponent={() => {
                return <Text>You have not created any case yet. :(</Text>;
              }}
              data={cases}
              style={{ height: "100%" }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  tintColor={colorPrimary}
                  onRefresh={() => handleFetchCases(true)}
                />
              }
              renderItem={({ item, index }) => (
                <Div mb={index + 1 === cases?.length ? 0 : 12}>
                  <Text fontSize={"md"} mb={8} fontFamily={fontHauoraSemiBold}>
                    Today
                  </Text>
                  <Button
                    bg="transparent"
                    p={0}
                    underlayColor="#f3f3f3"
                    flexDir="row"
                    alignItems="center"
                    mb={12}
                    onPress={() => {
                      navigation.navigate("CasesRequestScreen");
                    }}
                  >
                    <Image
                      source={{ uri: item.pet.photos?.[0].url }}
                      w={56}
                      h={56}
                      mr={7}
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

                        {item.status === CaseStatusEnum.OPEN_ESCALATED && (
                          <Text
                            fontFamily={fontHauoraSemiBold}
                            fontSize={"lg"}
                            color="#2F6E20"
                          >
                            {item.requestCount} Request
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
                          color="#494949"
                          fontFamily={fontHauoraSemiBold}
                          fontSize={"md"}
                        >
                          Case Status: {caseStatus(item.status)}
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
                    <TouchableOpacity>
                      <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
                        View Case Brief
                      </Text>
                    </TouchableOpacity>

                    {item.status === CaseStatusEnum.OPEN_ESCALATED && (
                      <Button
                        fontSize={"lg"}
                        bg="transparent"
                        p={0}
                        fontFamily={fontHauoraSemiBold}
                        color="primary"
                        onPress={() => {
                          navigation.navigate("CasesRequestScreen");
                        }}
                      >
                        View Request
                      </Button>
                    )}
                  </Div>
                </Div>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </Div>
      </Div>
    </Layout>
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

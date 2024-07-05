import Layout from "@/components/app/Layout";
// import BlankButton from "@/components/partials/BlankButton";
import { fontHauoraBold, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";

const list = [
  {
    name: "Lucy",
    forwardBy: "Dr Abbas Sheikh",
    caseId: "38401",
    nuOfRequest: 2,
  },
];

const btns = ["Open", "Archive"];

const PartnerCasesListScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState("Open");

  return (
    <Layout showBack backBtnText="">
      <Div flex={1}>
        <Text fontSize={"6xl"} mb={24}>
          Partner Cases
        </Text>

        <Div flexDir="row" style={styles.tabContainer}>
          {btns.map((item) => (
            <Button
              color="#222222"
              fontFamily={fontHauoraSemiBold}
              fontSize={"lg"}
              p={0}
              m={0}
              onPress={() => {
                setActiveTab(item);
              }}
              key={item}
              bg="transparent"
              style={{
                ...styles.btn,
                ...(activeTab === item ? styles.activeBtn : {}),
              }}
            >
              {item}
            </Button>
          ))}
        </Div>

        {/* <Text fontSize={"xl"} mb={20} fontFamily={fontHauoraBold}>
          In-Clinic Request
        </Text> */}

        <Div>
          <Text fontSize={"md"} mb={8} fontFamily={fontHauoraSemiBold}>
            Today
          </Text>

          <FlatList
            data={list}
            renderItem={({ item, index }) => (
              <Div mb={index + 1 === list.length ? 0 : 12}>
                <Button
                  bg="transparent"
                  p={0}
                  underlayColor="#f3f3f3"
                  flexDir="row"
                  alignItems="center"
                  mb={12}
                >
                  <Image
                    source={require("../../assets/images/dog.png")}
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
                        {item.name}
                      </Text>

                      <Text
                        fontFamily={fontHauoraSemiBold}
                        fontSize={"lg"}
                        color="#2F6E20"
                      >
                        {item.nuOfRequest} Request
                      </Text>
                    </Div>

                    <Div>
                      <Text
                        color="#494949"
                        fontFamily={fontHauoraSemiBold}
                        fontSize={"md"}
                      >
                        Forward by: {item.forwardBy}
                      </Text>

                      <Text
                        color="#494949"
                        fontFamily={fontHauoraSemiBold}
                        fontSize={"md"}
                      >
                        Case Id: {item.caseId}
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
                  <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
                    View Case Brief
                  </Text>

                  <Button
                    fontSize={"lg"}
                    bg="transparent"
                    p={0}
                    fontFamily={fontHauoraSemiBold}
                    color="primary"
                    onPress={() => {
                      navigation.navigate("PartnerCaseDetails");
                    }}
                  >
                    View Request
                  </Button>
                </Div>
              </Div>
            )}
            keyExtractor={(item) => item.caseId}
          />
        </Div>
      </Div>
    </Layout>
  );
};

export default PartnerCasesListScreen;

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
    width: "60%",
  },
  activeBtn: {
    paddingHorizontal: 30,
    backgroundColor: "#fff",
    borderColor: "#427594",
  },
});

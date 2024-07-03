import Layout from "@/components/app/Layout";
// import BlankButton from "@/components/partials/BlankButton";
import { fontHauoraBold, fontHauoraSemiBold } from "@/constant/constant";
import React from "react";
import { FlatList } from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";

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
    <Layout style={{ paddingVertical: 32 }}>
      <Div flex={1}>
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

export default PartnerClinicScreen;

import Layout from "@/components/app/Layout";
import React from "react";
import { StyleSheet } from "react-native";
import { Div, Image, Text } from "react-native-magnus";

const HomeScreen = () => {
  return (
    <Layout
      style={{
        paddingTop: 20,
        justifyContent: "flex-start",
      }}
    >
      <Div>
        <Div flexDir="row" alignItems="center" style={{ gap: 12 }}>
          <Image w={100} h={27} source={require("../assets/logo.png")} />
          <Image w={56} h={56} source={require("../assets/images/dog.png")} />
        </Div>

        <Div>
          <Image
            w={56}
            h={56}
            source={require("../assets/icons/notification-icon.svg")}
          />
        </Div>
      </Div>
    </Layout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

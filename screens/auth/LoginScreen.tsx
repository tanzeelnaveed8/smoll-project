import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import { fontHauora } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Div, Input, Text } from "react-native-magnus";

const LoginScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  return (
    <Layout style={styles.layout}>
      <Div style={styles.container}>
        <Div mb={188}>
          <Text fontSize={"5xl"} fontFamily={fontHauora} mb={20}>
            Welcome back!
          </Text>

          <InputField placeholder="Email address" marginBottom={16} />
          <InputField
            placeholder="Password"
            marginBottom={32}
            icon="eye-off-outline"
          />

          <ButtonPrimary
            bgColor="primary"
            link="Confirmation"
            navigation={navigation}
          >
            Login
          </ButtonPrimary>

          <Div
            mt={24}
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            <Text fontSize={16} color="#6B6B6B" fontFamily={fontHauora}>
              Already have an account?{" "}
            </Text>
            <Button
              bg="transparent"
              color="#0189F9"
              px={0}
              py={0}
              fontSize={16}
              fontFamily={fontHauora}
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              Signup
            </Button>
          </Div>
        </Div>

        <Text
          fontSize={"md"}
          fontFamily={fontHauora}
          color="#7B7B7B"
          textAlign="center"
          maxW={306}
          mx={"auto"}
          lineHeight={24}
        >
          By singing up, I agree to Smoll{" "}
          <Text lineHeight={24}>Terms & Conditions</Text> and{" "}
          <Text lineHeight={24}>Privacy Policy</Text>
        </Text>
      </Div>
    </Layout>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  layout: {
    paddingTop: 20,
  },
  container: {
    flex: 1,
  },
});

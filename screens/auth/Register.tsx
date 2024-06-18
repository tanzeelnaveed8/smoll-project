import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import { fontHauora } from "@/constant/constant";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, Div, Icon, Image, Input, Text } from "react-native-magnus";

const formFields = [
  {
    placeholder: "Email address",
    icon: "",
  },
  {
    placeholder: "Create a Password",
    icon: "eye-outline",
  },
  {
    placeholder: "Confirm Password",
    icon: "eye-outline",
  },
];

const Register = () => {
  return (
    <Div style={styles.container}>
      <Div>
        <Text
          fontWeight="600"
          fontSize={"5xl"}
          fontFamily={fontHauora}
          lineHeight={36}
          mb={20}
        >
          Let’s Get Started!
        </Text>

        <FlatList
          style={{ marginBottom: 8 }}
          data={formFields}
          renderItem={({ item, index }) => (
            <InputField
              placeholder={item.placeholder}
              icon={item.icon || ""}
              iconFamily="Ionicons"
              marginBottom={index === formFields.length - 1 ? 0 : 16}
            />
          )}
          keyExtractor={(item, i) => `${i}`}
        />

        <Text fontFamily={fontHauora} color="#7B7B7B" fontSize={"md"} mb={32}>
          Password must be at least 8 characters, uppercase, lowercase, and a
          special character.
        </Text>

        <ButtonPrimary bgColor="primary">Register</ButtonPrimary>

        <Div style={styles.linkContainer}>
          <Text fontSize={"xl"} fontFamily={fontHauora} color="#7B7B7B">
            Already have an account?{" "}
          </Text>
          {/* <Text fontSize={"xl"} fontFamily={fontHauora} color="#0189F9">
          Log in
        </Text> */}
          <Button
            color="#0189F9"
            bg="transparent"
            px={0}
            py={0}
            fontSize={"xl"}
            fontFamily={fontHauora}
          >
            Log in
          </Button>
        </Div>
      </Div>

      <Div>
        <Text
          fontSize={"md"}
          fontFamily={fontHauora}
          color="#7B7B7B"
          textAlign="center"
          maxW={306}
          mx={"auto"}
        >
          By singing up, I agree to Smoll <Text>Terms & Conditions</Text> and{" "}
          <Text>Privacy Policy</Text>
        </Text>
      </Div>
    </Div>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "space-between",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "center",
  },
});

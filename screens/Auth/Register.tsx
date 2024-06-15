import ButtonPrimary from "@/components/partials/ButtonPrimary";
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
    icon: "eye-off-outline",
  },
  {
    placeholder: "Confirm Password",
    icon: "eye-off-outline",
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
            <Input
              placeholder={item.placeholder}
              mb={index === formFields.length - 1 ? 0 : 16}
              fontFamily={fontHauora}
              placeholderTextColor={"#494949"}
              color="#494949"
              fontSize={18}
              px={12}
              py={16}
              focusBorderColor="#222222"
              borderColor="#494949"
              suffix={
                item.icon ? (
                  <Icon
                    name="eye-outline"
                    color="gray900"
                    fontFamily="Ionicons"
                    fontSize={24}
                  />
                ) : (
                  ""
                )
              }
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

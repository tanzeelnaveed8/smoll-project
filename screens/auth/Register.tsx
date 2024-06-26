import CountryDropdown from "@/components/app/CountryDropdown";
import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import ModalCard from "@/components/partials/ModalCard";
import { fontHauora } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, Div, Icon, Image, Input, Text } from "react-native-magnus";
import VerifyNumberScreen from "./VerifyNumberScreen";

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

const Register: React.FC<{ navigation: NavigationType }> = ({ navigation }) => {
  const [showVerificationScreen, setShowVerificationScreen] = useState(false);
  const [showRegisterForm, setShowRetregisterForm] = useState(false);

  useEffect(() => {
    setShowRetregisterForm(true);
  }, []);

  return (
    <ModalCard
      visible={showRegisterForm}
      backBtn
      onClose={() => {
        navigation.goBack();
      }}
    >
      <Div style={styles.container}>
        <Div>
          <Text
            fontWeight="600"
            fontSize={"5xl"}
            fontFamily={fontHauora}
            lineHeight={36}
            mb={20}
          >
            {/* Let’s Get Started! */}
            Login/Signup
          </Text>

          <CountryDropdown
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          />

          <InputField
            placeholder="Enter Phone number"
            marginBottom={32}
            borderColor="#222222"
            keyboardType="number-pad"
            inputStyle={{
              borderRadius: 12,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          />

          <ButtonPrimary
            bgColor="primary"
            // link="VerifyNumber"
            // navigation={navigation}
            onTouchEnd={() => {
              navigation.navigate("VerifyNumber");
              // setShowVerificationScreen(true);
            }}
          >
            Get OTP
          </ButtonPrimary>
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
    </ModalCard>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 20,
    // paddingTop: 20,
    // backgroundColor: "#fff",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "center",
  },
});

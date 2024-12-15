import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import SelectInput from "@/components/partials/SelectInput";
import { fontHauora } from "@/constant/constant";
import { useAuthStore } from "@/store/modules/auth";
import { NavigationType } from "@/store/types";
import { getAxiosErrMsg } from "@/utils/helpers";
import { AxiosError } from "axios";
import parsePhoneNumber from "libphonenumber-js";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Linking,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Div, Image, Text } from "react-native-magnus";
import { GestureResponderEvent } from "react-native-modal";
import Toast from "react-native-toast-notifications";
import ToastContainer from "react-native-toast-notifications/lib/typescript/toast-container";
import Layout from "../Layout";
import OnboardingOtpModal from "./OnboardingOtpModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  navigation: NavigationType;
  isVisible: boolean;
  onBack: () => void;
  onSuccess: (isNewUser?: boolean) => void;
}

const SignupScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const toastRef = useRef<ToastContainer>(null);
  const { login } = useAuthStore();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSelectInputOpen, setIsSelectInputOpen] = useState(false);

  const [country, setCountry] = useState({
    label: "",
    value: "",
  });
  const [phone, setPhone] = useState("");
  const [codes, setCodes] = useState<
    { label: string; value: string; flag: string }[]
  >([
    {
      flag: "https://flagcdn.com/w320/in.png",
      label: "(+91) India",
      value: "+91",
    },
    {
      flag: "https://flagcdn.com/w320/ae.png",
      label: "(+971) United Arab Emirates",
      value: "+971",
    },
  ]);

  const handlePhoneChange = (value: string) => {
    const phoneNumber = parsePhoneNumber(value);

    // Remove any non-digit characters
    let cleanedValue = value.replace(/\D/g, "");

    // Remove country code if present and valid
    if (country.value && country.value.length > 1) {
      const codeWithoutPlus = country.value.slice(1); // Remove the '+' from the country code
      const codeRegex = new RegExp(`^${codeWithoutPlus}`);
      cleanedValue = cleanedValue.replace(codeRegex, "");
    }

    // Limit to 10 digits

    if (phoneNumber && phoneNumber.isValid()) {
      const formattedPhone = phoneNumber.formatNational();
      cleanedValue = formattedPhone;
    }

    setPhone(cleanedValue.replace(/\s/g, ""));
  };

  const handleGetOtp = async () => {
    try {
      setIsLoading(true);
      Keyboard.dismiss();

      await login({
        phone: country.value + phone,
      });

      setShowOtpModal(true);
    } catch (err) {
      const message = getAxiosErrMsg(err as AxiosError);

      if (!message.toLowerCase().includes("not found")) {
        toastRef.current?.show(message, {
          type: "danger",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Div justifyContent="space-between" pb={24} pt={20} h="100%">
          <Div>
            <Text
              fontWeight="600"
              fontSize={"5xl"}
              fontFamily={fontHauora}
              lineHeight={36}
              mb={20}
            >
              Login/Signup
            </Text>

            <SelectInput
              label="Select a country"
              options={codes}
              onSelect={(val) => {
                setCountry(val);
                // Clear phone when country changes
                setPhone("");
              }}
              onOpen={() => {
                setIsSelectInputOpen(true);
              }}
              onClose={() => {
                setIsSelectInputOpen(false);
              }}
              selectedValue={country}
              renderLabel={(options, onClick) => (
                <Country
                  onPress={() => {
                    Keyboard.dismiss();
                    onClick({ value: options.value, label: options.label });
                  }}
                  label={options.label}
                  flag={options.flag}
                />
              )}
              mainInputStyle={{
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            />

            <InputField
              onChangeText={handlePhoneChange}
              placeholder={
                country.value ? `05XXXXXXX` : "Select a country first"
              }
              marginBottom={32}
              borderColor="#222222"
              keyboardType="phone-pad"
              disabled={isLoading || !country.value}
              inputStyle={{
                borderRadius: 12,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderTopWidth: 0,
              }}
              value={phone}
              focus={isFocused}
              maxLength={17}
              textContentType={
                Platform.OS === "ios" ? "telephoneNumber" : undefined
              }
            />

            <ButtonPrimary
              //   bgColor="primary"
              loading={isLoading}
              disabled={isLoading || !country.value || phone.length < 10}
              onPress={handleGetOtp}
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
              By signing up, I agree to Smoll{" "}
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://smoll.me/terms-and-conditions")
                }
              >
                <Text lineHeight={24}>
                  Terms & Conditions and Privacy Policy
                </Text>
              </TouchableOpacity>
            </Text>
          </Div>
        </Div>
      </TouchableWithoutFeedback>

      <OnboardingOtpModal
        isVisible={showOtpModal}
        onSuccess={(isNewUser?: boolean) => {
          setShowOtpModal(false);
          navigation.navigate("HomeScreen", {
            isNewUser: String(isNewUser),
          });
        }}
        onBack={() => setShowOtpModal(false)}
        navigation={navigation}
        phone={country.value + phone}
        label={country.value + " " + phone}
      />

      <Toast
        ref={toastRef}
        placement="top"
        textStyle={{ textTransform: "capitalize" }}
      />
    </Layout>
  );
};

export default SignupScreen;
const Country: React.FC<{
  label: string;
  flag: string;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}> = ({ label, flag, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Div
        borderBottomWidth={0.75}
        borderColor="#DEDEDE"
        py={16}
        flexDir="row"
        alignItems="center"
        px={16}
      >
        {/* <Div h={18} w={18} bgImg={{ uri: flag }} mr={16} /> */}
        <Image
          src={flag}
          h={18}
          w={26}
          mr={16}
          style={{ objectFit: "contain" }}
        />
        <Text fontSize="lg">{label}</Text>
      </Div>
    </TouchableOpacity>
  );
};

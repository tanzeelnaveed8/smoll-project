import CountryDropdown from "@/components/app/CountryDropdown";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import { fontHauora } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useRef, useState } from "react";
import { Div, Text } from "react-native-magnus";
import BottomSheet from "@/components/partials/BottomSheet";
import BackButton from "@/components/partials/BackButton";
import OnboardingOtpModal from "./OnboardingOtpModal";
import { useAuthStore } from "@/store/modules/auth";
import ToastContainer from "react-native-toast-notifications/lib/typescript/toast-container";
import Toast from "react-native-toast-notifications";
import { getAxiosErrMsg } from "@/utils/helpers";
import { AxiosError } from "axios";

interface Props {
  navigation: NavigationType;
  isVisible: boolean;
  onBack: () => void;
  onSuccess: () => void;
}

const OnboardingAuthModal: React.FC<Props> = (props) => {
  const toastRef = useRef<ToastContainer>(null);
  const { login } = useAuthStore();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [country, setCountry] = useState({
    codeLabel: "",
    code: "",
    label: "",
  });
  const [phone, setPhone] = useState("");

  const handleGetOtp = async () => {
    try {
      setIsLoading(true);

      await login({
        phone: country.code + phone,
      });

      setShowOtpModal(true);

      toastRef.current?.show("OTP sent to your phone");
    } catch (err) {
      const message = getAxiosErrMsg(err as AxiosError);
      toastRef.current?.show(message, {
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BottomSheet isVisible={props.isVisible} showCloseIcon={false} h="95%">
      <Div justifyContent="space-between" pb={24} h="100%">
        <Div>
          <BackButton mb={20} onPress={props.onBack} />
          <Text
            fontWeight="600"
            fontSize={"5xl"}
            fontFamily={fontHauora}
            lineHeight={36}
            mb={20}
          >
            Login/Signup
          </Text>

          <CountryDropdown
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onChange={setCountry}
            onSelect={() => setIsFocused(true)}
            value={country}
            isDisabled={isLoading}
          />

          <InputField
            onChangeText={setPhone}
            placeholder="Enter Phone number"
            marginBottom={32}
            borderColor="#222222"
            keyboardType="number-pad"
            disabled={isLoading}
            inputStyle={{
              borderRadius: 12,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderTopWidth: 0,
            }}
            value={phone}
            focus={isFocused}
            maxLength={10}
            inputType="numeric"
          />

          <ButtonPrimary
            bgColor="primary"
            loading={isLoading}
            disabled={isLoading || !country.code || phone.length < 10}
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
            By singing up, I agree to Smoll <Text>Terms & Conditions</Text> and{" "}
            <Text>Privacy Policy</Text>
          </Text>
        </Div>
      </Div>

      <OnboardingOtpModal
        isVisible={showOtpModal}
        onSuccess={props.onSuccess}
        onBack={() => setShowOtpModal(false)}
        navigation={props.navigation}
        phone={country.code + phone}
        label={country.codeLabel + " " + phone}
      />

      <Toast
        ref={toastRef}
        placement="top"
        textStyle={{ textTransform: "capitalize" }}
      />
    </BottomSheet>
  );
};

export default OnboardingAuthModal;

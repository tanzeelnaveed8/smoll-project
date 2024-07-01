import BackButton from "@/components/partials/BackButton";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { TOAST_CONFIGS, fontHauora } from "@/constant/constant";
import { useAuthStore } from "@/store/modules/auth";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { getAxiosErrMsg } from "@/utils/helpers";
import { AxiosError } from "axios";

import React, { useRef, useState } from "react";
import { View } from "react-native-animatable";
import { Button, Div, Input, Text } from "react-native-magnus";
import Toast from "react-native-toast-notifications";
import ToastContainer from "react-native-toast-notifications/lib/typescript/toast-container";
import OnboardingUserModal from "./OnboardingUserModal";

interface Props {
  navigation: NavigationType;
  isVisible: boolean;
  phone: string;
  label: string;
  onBack: () => void;
  onSuccess: () => void;
}

const OnboardingOtpModal: React.FC<Props> = (props) => {
  const { verifyOtp, login } = useAuthStore();
  const { findUser } = useUserStore();

  const toastRef = useRef<ToastContainer>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  const [otp, setOtp] = useState("");

  const handleConfirm = async (_otp?: string) => {
    try {
      setIsLoading(true);

      await verifyOtp({ phone: props.phone, otp: _otp ?? otp });
      const user = await findUser();

      if (!user?.name) {
        setShowNameModal(true);
      } else {
        props.navigation.navigate("HomeScreen");
      }
    } catch (err) {
      const msg = getAxiosErrMsg(err as AxiosError);

      toastRef.current?.show(msg, {
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e: string) => {
    setOtp(e);

    if (e.length === 4) {
      handleConfirm(e);
    }
  };

  const handleResend = async () => {
    await login({ phone: props.phone });
  };

  return (
    <>
      <BottomSheet
        isVisible={props.isVisible}
        h="95%"
        showCloseIcon={false}
        barMb={28}
      >
        <View>
          <BackButton onPress={props.onBack} mb={20} />
          <Text fontSize={"5xl"} fontFamily={fontHauora} mb={4}>
            Enter your verification code
          </Text>

          <Text fontSize={"xl"} mb={24} color="#494949">
            We have send a 4 digit code to the phone number{" "}
            <Text fontSize={"xl"} color="#222222">
              {props.label}
            </Text>
          </Text>

          <Input
            placeholder={"Verification Code"}
            mb={8}
            fontFamily={fontHauora}
            placeholderTextColor={"#494949"}
            color="#494949"
            fontSize={18}
            px={12}
            py={16}
            value={otp}
            focusBorderColor="#222222"
            borderColor="#494949"
            maxLength={4}
            inputMode="numeric"
            keyboardType="number-pad"
            autoFocus
            onChangeText={handleOtpChange}
          />

          <Button
            color="#0189F9"
            bg="transparent"
            px={0}
            py={0}
            mb={32}
            disabled={isLoading}
            fontSize={"md"}
            fontFamily={fontHauora}
            onPress={handleResend}
          >
            Resend Code
          </Button>

          <ButtonPrimary
            bgColor="primary"
            onPress={() => handleConfirm()}
            loading={isLoading}
            disabled={isLoading}
          >
            Confirm
          </ButtonPrimary>

          <Div
            mt={24}
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            <Text fontSize={16} color="#6B6B6B" fontFamily={fontHauora}>
              Can’t find the code?{" "}
            </Text>
            <Button
              bg="transparent"
              color="#222222"
              px={0}
              py={0}
              fontSize={16}
              fontFamily={fontHauora}
            >
              Get help
            </Button>
          </Div>
        </View>

        <OnboardingUserModal
          isVisible={showNameModal}
          onSuccess={props.onSuccess}
        />

        <Toast
          ref={toastRef}
          placement="top"
          textStyle={{ textTransform: "capitalize" }}
        />
      </BottomSheet>
    </>
  );
};

export default OnboardingOtpModal;

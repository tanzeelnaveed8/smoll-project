import BackButton from "@/components/partials/BackButton";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { colorPrimary, fontHauora } from "@/constant/constant";
import { useAuthStore } from "@/store/modules/auth";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { getAxiosErrMsg, getUserTimezoneOffset } from "@/utils/helpers";
import { AxiosError } from "axios";

import InputField from "@/components/partials/InputField";
import React, { useRef, useState, useEffect } from "react";
import { Button, Div, Text } from "react-native-magnus";
import Toast from "react-native-toast-notifications";
import ToastContainer from "react-native-toast-notifications/lib/typescript/toast-container";
import OnboardingUserModal from "./OnboardingUserModal";
import {
  ActivityIndicator,
  Keyboard,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import { OneSignal } from "react-native-onesignal";
import dayjs from "dayjs";

interface Props {
  navigation: NavigationType;
  isVisible: boolean;
  phone: string;
  label: string;
  onBack: () => void;
  onSuccess: (isNewUser?: boolean) => void;
}

const OnboardingOtpModal: React.FC<Props> = (props) => {
  const { verifyOtp, login } = useAuthStore();
  const { findUser, updateUser } = useUserStore();

  const toastRef = useRef<ToastContainer>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [resendOtpWating, setResendOtpWating] = useState(0);
  const [otp, setOtp] = useState("");

  const handleConfirm = async (_otp?: string) => {
    try {
      Keyboard.dismiss();

      setIsLoading(true);

      await verifyOtp({ phone: props.phone, otp: _otp ?? otp });
      const user = await findUser();

      // Update the playerId everytime the user login
      const playerId = await OneSignal.User.pushSubscription.getIdAsync();

      if (playerId) {
        await updateUser({ playerId });
      }

      if (!user.timeZone) {
        await updateUser({ timeZone: getUserTimezoneOffset() });
      }

      if (!user?.name) {
        setShowNameModal(true);
      } else {
        props.onSuccess();
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

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendOtpWating > 0) {
      timer = setInterval(() => {
        setResendOtpWating((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [resendOtpWating]);

  const handleResend = async () => {
    try {
      setResendOtpLoading(true);
      await login({ phone: props.phone });

      setResendOtpWating(30);

      toastRef.current?.show(
        "The code has been successfully sent to your number.",
        {
          type: "dark",
        }
      );
    } finally {
      setResendOtpLoading(false);
    }
  };

  return (
    <>
      <BottomSheet
        isVisible={props.isVisible}
        h="95%"
        showCloseIcon={false}
        barMb={28}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Div h="100%">
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

            <InputField
              placeholder="Verification Code"
              value={otp}
              mb={8}
              onChangeText={handleOtpChange}
              maxLength={4}
              inputMode="numeric"
              keyboardType="number-pad"
              autoFocus={true}
            />

            {resendOtpWating === 0 && (
              <Button
                bg="transparent"
                px={0}
                py={0}
                mb={32}
                disabled={isLoading || resendOtpLoading}
                fontSize={"md"}
                fontFamily={fontHauora}
                onPress={handleResend}
                position="relative"
              >
                <Text color={resendOtpLoading ? "#ddd" : "#0189F9"}>
                  Resend Code
                </Text>
                {resendOtpLoading && (
                  <Div position="absolute" top={4}>
                    <ActivityIndicator size={16} color={colorPrimary} />
                  </Div>
                )}
              </Button>
            )}

            {resendOtpWating > 0 && (
              <Text mb={32} color="#666">
                Resend Code in {resendOtpWating} seconds
              </Text>
            )}

            <ButtonPrimary
              // bgColor="primary"
              onPress={() => handleConfirm()}
              loading={isLoading}
              disabled={isLoading || otp.length < 4}
            >
              Confirm
            </ButtonPrimary>

            <Div
              mt={24}
              style={{ flexDirection: "row", justifyContent: "center" }}
            >
              <Text fontSize={16} color="#6B6B6B" fontFamily={fontHauora}>
                Can't find the code?{" "}
              </Text>
              <Button
                bg="transparent"
                color="#222222"
                px={0}
                py={0}
                fontSize={16}
                fontFamily={fontHauora}
                onPress={() => Linking.openURL("https://smoll.me/help")}
              >
                Get help
              </Button>
            </Div>
          </Div>
        </TouchableWithoutFeedback>

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

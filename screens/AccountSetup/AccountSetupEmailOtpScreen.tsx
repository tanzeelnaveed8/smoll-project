import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import { fontHauora, fontHauoraSemiBold } from "@/constant/constant";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { getAxiosErrMsg } from "@/utils/helpers";
import { AxiosError } from "axios";

import React, { useState } from "react";
import { View } from "react-native-animatable";
import { Button, Div, Input, Text } from "react-native-magnus";
import { useToast } from "react-native-toast-notifications";

interface Props {
  navigation: NavigationType;
}

const AccountSetupEmailOtpScreen: React.FC<Props> = (props) => {
  const toast = useToast();
  const { user, verifyEmail, sendVerificationEmail } = useUserStore();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    await sendVerificationEmail();
  };

  const handleOtpChange = (otp: string) => {
    setOtp(otp);

    if (otp.length === 4) {
      handleVerify(otp);
    }
  };

  const handleVerify = async (_otp?: string) => {
    try {
      await verifyEmail(_otp ?? otp);

      props.navigation.navigate("HomeScreen", {
        showSetupModal: "true",
      });
    } catch (err) {
      const errMsg = getAxiosErrMsg(err as AxiosError);

      toast.show(errMsg, {
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      showBack
      onBackPress={() => {
        props.navigation.goBack();
      }}
    >
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <Div>
          <Text fontSize={"6xl"} fontFamily={fontHauora} mb={4}>
            Verify your email{" "}
          </Text>
          <Text color="#494949" mb={20} fontSize={"xl"}>
            We have send a 4 digit code to your email address {user?.email}
          </Text>

          <InputField
            value={otp}
            onChangeText={handleOtpChange}
            placeholder="Verification Code"
            keyboardType="numeric"
            maxLength={4}
            disabled={loading}
            autoFocus={true}
          />

          <Button
            bg="transparent"
            mt={8}
            p={0}
            color="primary"
            fontFamily={fontHauoraSemiBold}
            onPress={handleResend}
          >
            Resend Code
          </Button>
        </Div>

        <ButtonPrimary
          bgColor="primary"
          onPress={() => handleVerify()}
          loading={loading}
          disabled={otp.length < 4 || loading}
        >
          Confirm
        </ButtonPrimary>
      </View>
    </Layout>
  );
};

export default AccountSetupEmailOtpScreen;

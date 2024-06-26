import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import ModalCard from "@/components/partials/ModalCard";
import { fontHauora, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";

import React from "react";
import { View } from "react-native-animatable";
import { Button, Div, Input, Text } from "react-native-magnus";

const VerifyEmailOtpScreen: React.FC<{
  navigation: NavigationType;
}> = ({ navigation }) => {
  return (
    <ModalCard
      backBtn
      onClose={() => {
        navigation.goBack();
      }}
    >
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <Div>
          <Text fontSize={"6xl"} fontFamily={fontHauora} mb={4}>
            What’s your email?
          </Text>
          <Text color="#494949" mb={20} fontSize={"xl"}>
            Enter the email address that you would like to use with smoll
          </Text>

          <InputField placeholder="Verification Code" />
          <Button
            bg="transparent"
            mt={8}
            p={0}
            color="primary"
            fontFamily={fontHauoraSemiBold}
          >
            Resend Code
          </Button>
        </Div>

        <ButtonPrimary
          bgColor="primary"
          // onTouchEnd={onConfirm}
          onTouchEnd={() => {
            navigation.navigate("Onboarding");
          }}
        >
          Confirm
        </ButtonPrimary>
      </View>
    </ModalCard>
  );
};

export default VerifyEmailOtpScreen;

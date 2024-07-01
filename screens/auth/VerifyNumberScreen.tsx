import BackButton from "@/components/partials/BackButton";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import ModalCard from "@/components/partials/ModalCard";
import { fontHauora } from "@/constant/constant";
import { useAuthState } from "@/store/auth/provider";
import { NavigationType } from "@/store/types";

import React from "react";
import { View } from "react-native-animatable";
import { Button, Div, Input, Text } from "react-native-magnus";

const VerifyNumberScreen: React.FC<{
  navigation: NavigationType;
}> = ({ navigation }) => {
  const { confirmOTPHandler, isOTPConfrimInProgress, fieldChangeHandler } =
    useAuthState();
  return (
    <BottomSheet
      // onClose={() => {
      //   navigation.goBack();
      // }}
      isVisible={true}
      h="95%"
      showCloseIcon={false}
      barMb={28}
    >
      <View>
        <BackButton onPress={() => navigation.goBack()} mb={20} />
        <Text fontSize={"5xl"} fontFamily={fontHauora} mb={4}>
          Enter your verification code
        </Text>

        <Text fontSize={"xl"} mb={24} color="#494949">
          We have send a 4 digit code to the phone number{" "}
          <Text fontSize={"xl"} color="#222222">
            (+971) 82 474 7493
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
          focusBorderColor="#222222"
          borderColor="#494949"
          onChangeText={(e) => fieldChangeHandler("ON_OTP_CHANGE", e)}
        />

        <Button
          color="#0189F9"
          bg="transparent"
          px={0}
          py={0}
          mb={32}
          fontSize={"md"}
          fontFamily={fontHauora}
        >
          Resend Code
        </Button>

        <ButtonPrimary
          bgColor="primary"
          onPress={confirmOTPHandler}
          loading={isOTPConfrimInProgress}
          disabled={isOTPConfrimInProgress}
        >
          Confirm
        </ButtonPrimary>

        <Div mt={24} style={{ flexDirection: "row", justifyContent: "center" }}>
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
    </BottomSheet>
  );
};

export default VerifyNumberScreen;

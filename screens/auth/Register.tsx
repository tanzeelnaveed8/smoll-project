import CountryDropdown from "@/components/app/CountryDropdown";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import { fontHauora } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React from "react";
import { Div, Text } from "react-native-magnus";
import { useAuthState } from "@/store/auth/provider";
import BottomSheet from "@/components/partials/BottomSheet";
import BackButton from "@/components/partials/BackButton";

const Register: React.FC<{ navigation: NavigationType }> = ({ navigation }) => {
  const { fieldChangeHandler, code, phone, getOPTHandler, isLoginInProgress } =
    useAuthState();

  return (
    <BottomSheet isVisible={true} showCloseIcon={false} h="95%">
      <Div justifyContent="space-between" pb={24} h="100%">
        <Div>
          <BackButton mb={20} onPress={() => navigation.goBack()} />
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
            onChange={(e) => fieldChangeHandler("ON_CODE_CHANGE", e)}
            value={code}
          />

          <InputField
            onChangeText={(e) => fieldChangeHandler("ON_PHONE_CHANGE", e)}
            placeholder="Enter Phone number"
            marginBottom={32}
            borderColor="#222222"
            keyboardType="number-pad"
            inputStyle={{
              borderRadius: 12,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderTopWidth: 0,
            }}
            value={phone}
          />

          <ButtonPrimary
            bgColor="primary"
            loading={isLoginInProgress}
            disabled={isLoginInProgress}
            onPress={getOPTHandler}
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
    </BottomSheet>
  );
};

export default Register;

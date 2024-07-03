import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import { fontHauora } from "@/constant/constant";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { IconCircleCheck } from "@tabler/icons-react-native";

import React, { useMemo, useState } from "react";
import { View } from "react-native-animatable";
import { Div, Text } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
}

const AccountSetupEmailScreen: React.FC<Props> = (props) => {
  const { updateUser, sendVerificationEmail } = useUserStore();

  const [email, setEmail] = useState("mohibarshi834@gmail.com");
  const [loading, setLoading] = useState(false);

  const isValidEmail = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  const handleNext = async () => {
    if (!isValidEmail) return;

    try {
      setLoading(true);

      await updateUser({ email });
      await sendVerificationEmail();

      props.navigation.navigate("AccountSetupEmailOtpScreen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      showBack
      onBackPress={() =>
        props.navigation.navigate("HomeScreen", {
          showSetupModal: "true",
        })
      }
    >
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <Div>
          <Text fontSize={"6xl"} fontFamily={fontHauora} mb={4}>
            What’s your email?
          </Text>
          <Text color="#494949" mb={20} fontSize={"xl"}>
            Enter the email address that you would like to use with smoll
          </Text>

          <InputField
            value={email}
            placeholder="Email address"
            floatingPlaceholder
            suffix={
              isValidEmail ? <IconCircleCheck color="#2F6E20" /> : undefined
            }
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            disabled={loading}
            autoCapitalize="none"
          />
        </Div>

        <ButtonPrimary
          bgColor="primary"
          onPress={handleNext}
          disabled={!isValidEmail || loading}
          loading={loading}
        >
          Next
        </ButtonPrimary>
      </View>
    </Layout>
  );
};

export default AccountSetupEmailScreen;

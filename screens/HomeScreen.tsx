import Layout from "@/components/app/Layout";
import AccountSetupModal from "@/components/app/account/AccountSetupModal";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Div, Image, Text } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
  isNewUser?: boolean;
}

const HomeScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const { user } = useUserStore();

  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);

  useEffect(() => {
    const showSetupModal = (route.params as Record<string, string>)
      ?.showSetupModal;

    if (showSetupModal) {
      setShowAccountSetupModal(true);
    }
  }, [route.params]);

  // TODO: Add pet profile exist check.
  // Also check if congrats modal is open ( for new user ) if yes, don't do this.
  useEffect(() => {
    const basicInfoExist = Boolean(user?.address?.length);
    const emailInfoExist = user?.isEmailVerified;

    if (!basicInfoExist || !emailInfoExist) {
      setShowAccountSetupModal(true);
    }
  }, [user]);

  // TODO: remove this when done.
  setTimeout(() => {
    setShowAccountSetupModal(true);
  }, 1000);

  return (
    <Layout
      style={{
        paddingTop: 20,
        justifyContent: "flex-start",
      }}
    >
      <Div>
        <Div flexDir="row" alignItems="center" style={{ gap: 12 }}>
          <Image w={100} h={27} source={require("../assets/logo.png")} />
          <Image w={56} h={56} source={require("../assets/images/dog.png")} />
        </Div>

        <Div>
          <Image
            w={56}
            h={56}
            source={require("../assets/icons/notification-icon.svg")}
          />
        </Div>
      </Div>

      <AccountSetupModal
        isVisible={showAccountSetupModal}
        onBack={() => setShowAccountSetupModal(false)}
        navigation={props.navigation}
      />
    </Layout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

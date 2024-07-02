import ButtonPrimary from "@/components/partials/ButtonPrimary";
import ModalCard from "@/components/partials/ModalCard";
import React from "react";
import { Div, Image, Text } from "react-native-magnus";

const AccountCreatedCongratulationScreen = () => {
  return (
    <ModalCard height={"60%"}>
      <Div>
        <Div px={18} mb={32}>
          <Image
            w={90}
            h={90}
            mb={24}
            mx={"auto"}
            source={require("../../assets/images/congratulation-screen-tick.png")}
          />
          <Text fontSize={"6xl"} textAlign="center" mb={8}>
            Congratulations, your account has been created.
          </Text>
          <Text fontSize={"lg"} textAlign="center">
            To enjoy Smoll's services, you need to build your profile and your
            pet's profile.
          </Text>
        </Div>

        <ButtonPrimary bgColor="primary">Start now</ButtonPrimary>
      </Div>
    </ModalCard>
  );
};

export default AccountCreatedCongratulationScreen;

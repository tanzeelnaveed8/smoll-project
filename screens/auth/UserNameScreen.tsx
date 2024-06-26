import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import ModalCard from "@/components/partials/ModalCard";
import { NavigationType } from "@/store/types";
import React from "react";
import { Div, Text } from "react-native-magnus";

const UserNameScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  return (
    <ModalCard
      backBtn
      onClose={() => {
        navigation.navigate("Register");
        // navigation.goBack();
      }}
      visible
    >
      <Div>
        <Text fontSize={"4xl"} mb={20}>
          What should we call you?
        </Text>
        <InputField
          placeholder="First Name"
          marginBottom={16}
          floatingPlaceholder
          inputStyle={{ borderRadius: 12 }}
        />
        <InputField
          placeholder="Last Name (Optional)"
          floatingPlaceholder
          inputStyle={{ borderRadius: 12 }}
          marginBottom={32}
        />

        <ButtonPrimary
          bgColor="primary"
          onTouchEnd={() => {
            navigation.navigate("Home");
          }}
        >
          Continue
        </ButtonPrimary>
      </Div>
    </ModalCard>
  );
};

export default UserNameScreen;

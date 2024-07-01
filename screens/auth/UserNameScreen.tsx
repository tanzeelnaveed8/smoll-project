import BackButton from "@/components/partials/BackButton";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import ModalCard from "@/components/partials/ModalCard";
import { useAuthState } from "@/store/auth/provider";
import { NavigationType } from "@/store/types";
import React from "react";
import { Div, Text } from "react-native-magnus";

const UserNameScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const {
    fieldChangeHandler,
    firstName,
    lastName,
    updateUserDetailsHandler,
    isUpdatingUserInProgress,
  } = useAuthState();
  return (
    <BottomSheet showCloseIcon={false} isVisible h="95%" barMb={28}>
      <Div>
        <BackButton mb={20} />
        <Text fontSize={"4xl"} mb={20}>
          What should we call you?
        </Text>
        <InputField
          placeholder="First Name"
          marginBottom={16}
          floatingPlaceholder
          inputStyle={{ borderRadius: 12 }}
          onChangeText={(e) => fieldChangeHandler("ON_FIRST_NAME_CHANGE", e)}
          value={firstName}
        />
        <InputField
          placeholder="Last Name (Optional)"
          floatingPlaceholder
          inputStyle={{ borderRadius: 12 }}
          marginBottom={32}
          onChangeText={(e) => fieldChangeHandler("ON_LAST_NAME_CHANGE", e)}
          value={lastName}
        />

        <ButtonPrimary
          bgColor="primary"
          onPress={updateUserDetailsHandler}
          loading={isUpdatingUserInProgress}
        >
          Continue
        </ButtonPrimary>
      </Div>
    </BottomSheet>
  );
};

export default UserNameScreen;
